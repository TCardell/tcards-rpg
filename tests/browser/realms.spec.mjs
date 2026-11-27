import {readFileSync} from 'node:fs';
import {test,expect} from '@playwright/test';
test.skip(!process.env.TCARDS_TEST_FIXTURES,'Requiere cuatro cuentas ficticias preparadas en desarrollo.');
test('dos navegadores completan la expedición, reconectan y Admin compensa',async({browser,baseURL})=>{
 test.setTimeout(150000);
 const fixtures=JSON.parse(readFileSync(process.env.TCARDS_TEST_FIXTURES,'utf8'));
 const ctx=async()=>browser.newContext({baseURL,reducedMotion:'reduce'});
 const [ca,cb,co]=await Promise.all([ctx(),ctx(),ctx()]);
 const [a,b,o]=await Promise.all([ca.newPage(),cb.newPage(),co.newPage()]);
 const faults=[];for(const p of [a,b,o])p.on('pageerror',e=>faults.push(e.message));
 async function login(page,who,admin=false){
   await page.goto(admin?'/apps/admin/':'/');if(!admin)await page.getByRole('button',{name:'Entrar en Realms'}).click();
   await page.getByLabel('Correo electrónico').fill(fixtures[who].email);await page.getByLabel('Contraseña').fill(fixtures[who].password);await page.getByRole('button',{name:'Iniciar sesión'}).click();
 }
 const names=['Alda','Bruno'].map(n=>n+' '+crypto.randomUUID().slice(0,6));
 async function character(p,who,name){
   await login(p,who);await p.getByLabel('Nombre del personaje').fill(name);await p.getByRole('button',{name:'Crear personaje libre'}).click();
   await expect(p.locator('.card-title')).toHaveText('Plaza de las campanas');await p.getByRole('navigation').getByRole('button',{name:'Compañía'}).click();
 }
 try{
   await Promise.all([character(a,'first',names[0]),character(b,'second',names[1])]);
   await a.getByRole('button',{name:'Preparar expedición'}).click();
   const code=await a.getByLabel('Código para tu compañero').inputValue();
   await b.getByLabel('Código de expedición',{exact:true}).fill(code);await b.getByRole('button',{name:'Unirse al compañero'}).click();
   await expect(a.locator('[data-id=guard]')).toBeVisible({timeout:20000});
   await a.locator('[data-id=guard]').click();
   await expect(b.locator('[data-id=strike]')).toBeVisible({timeout:20000});await b.reload();
   await b.locator('[data-id=strike]').click();await expect(a.locator('[data-id=strike]')).toBeVisible({timeout:20000});await a.locator('[data-id=strike]').click();
   await b.locator('[data-id=strike]').click();
   for(const p of [a,b]){await expect(p.locator('.card-title')).toHaveText('El vado está libre',{timeout:20000});await p.reload();await expect(p.locator('.card-title')).toHaveText('El vado está libre');}
   await a.getByRole('button',{name:'Volver a la aventura'}).click();
   await login(o,'operator',true);await o.getByRole('combobox',{name:'Personaje',exact:true}).selectOption({label:names[0]});await o.getByLabel('Monedas que devolver').fill('2');await o.getByLabel('Motivo de la compensación').fill('Reposición ficticia del vado');
   await o.getByRole('button',{name:'Registrar compensación'}).click();await expect(o.getByRole('status')).toContainText('confirmada');
   await expect(a.locator('.hud')).toContainText('6 oro',{timeout:20000});
   await a.goto('/apps/admin/');await expect(a.getByText(/Acceso restringido/)).toBeVisible();
   expect(faults).toEqual([]);
 }finally{await Promise.all([ca.close(),cb.close(),co.close()]);}
});
