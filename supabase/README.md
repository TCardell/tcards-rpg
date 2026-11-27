# Operar Valbruma en desarrollo

El cliente usa Supabase Auth, PostgreSQL mediante la RPC `public.tcards` y notificaciones personales de Realtime. La revisión confirmada, los inventarios, las expediciones, los recibos y la auditoría residen en la base de datos. El proyecto de desarrollo autorizado tiene referencia `ocnvfivxbnbypjfhpnlx`.

## Conectar un cliente

1. Copia `.env.example` a `.env.local`, en la raíz del repositorio.
2. En el panel del proyecto de desarrollo, abre **Connect** y copia la URL del proyecto a `VITE_SUPABASE_URL`. En **Settings → API Keys** copia la clave **publishable** a `VITE_SUPABASE_PUBLISHABLE_KEY`. Vite incluye ambas en el cliente.
3. Reinicia `npm run dev` después de cambiar el archivo. Para una compilación estática, configura las variables antes de `npm run build`.
4. Abre **Entrar en Realms → Crear cuenta**. Confirma la dirección si Auth lo solicita y vuelve a iniciar sesión. La admisión en el mundo requiere una invitación del operador.

El esquema de desarrollo ya contiene las dos migraciones del repositorio. Comprueba su historial antes de aplicar cambios futuros. La CLI local puede trabajar sin vincularse al proyecto alojado.

## Arrancar una base local

Con Docker activo y Supabase CLI instalada, ejecuta `supabase start` desde la raíz en una instalación local nueva. El CLI aplica las migraciones y expone la API junto a los servicios locales. Configura las dos variables del cliente con la URL y la clave pública de **esta** instancia. Puedes obtenerlas con `supabase status` en un terminal privado. La salida también contiene valores privilegiados que se deben mantener fuera de transcripciones y capturas.

En una instalación local existente, consulta `supabase migration list --local`. Aplica las migraciones pendientes con `supabase migration up --local`. El catálogo v1 forma parte de la segunda migración. Se conservan los datos entre reinicios con los volúmenes de Docker.

## Dar acceso al primer operador

El propietario de la base provisiona el rol inicial de una cuenta Auth ya confirmada. En **Authentication → Users**, comprueba su identidad y copia su **User UID**. En el editor SQL del proyecto de desarrollo, sustituye el marcador por ese UUID y ejecuta una vez:

```sql
insert into tcards.operators (actor, role, world)
values ('<UUID de la cuenta confirmada>'::uuid, 'operator', 'valbruma');
```

Para acceso de lectura usa el rol `observer`. Los permisos temporales admiten una columna `expires_at`. Auth, las invitaciones de mundo y los roles de operación se gestionan por separado. No se asigna un operador personal por defecto.

Con la cuenta operadora, abre `/apps/admin/` e inicia sesión. En **Operaciones → Emitir invitación de un uso**, copia el código y entrégalo en privado a un jugador. Cada cuenta necesita un código propio, válido siete días. El jugador lo canjea en Realms y puede crear varios personajes. La invitación de expedición se genera dentro de **Compañía** y admite al segundo personaje de otra cuenta en el encuentro en espera.

## Inspección, compensación y recuperación

- Admin presenta personajes, inventario, oro, carta y revisión, participantes y estado del encuentro, y los últimos cien eventos del mundo. Los identificadores de cuenta permiten localizar el registro sin mostrar direcciones de correo.
- El operador puede devolver entre 1 y 50 monedas con un motivo de 8–240 caracteres. Selecciona el personaje, revisa el saldo y confirma. El servidor comprueba el rol y la revisión y registra actor, comando, motivo, estado anterior y posterior. Si la revisión ha cambiado, actualiza los datos antes de valorar la reparación.
- El actor autenticado y el identificador del comando identifican un recibo. Un reintento idéntico devuelve su resultado original. Enviar otro contenido con el mismo identificador se rechaza. La interfaz recupera después el snapshot vigente.
- El guardado en solitario se exporta y restaura desde **Ajustes**. Su revisión y versión se validan al importar. La importación sustituye la partida local tras confirmación.
- Para comprobar una copia PostgreSQL en desarrollo, guarda un `pg_dump --format=custom` en almacenamiento privado y restaura con `pg_restore --single-transaction --exit-on-error` en una **base nueva y vacía**, con los roles y extensiones del origen disponibles. Comprueba recuentos y huellas de personajes, expediciones y auditoría. La verificación que figura en PROGRESS se hizo sobre la instalación local con identidades ficticias. El procedimiento remoto de recuperación de desastres depende de la configuración del propietario.

## Compatibilidad y retirada

Las migraciones añaden el esquema interno `tcards`, una RPC pública y una tabla pública de señales con RLS. El navegador obtiene sus permisos de la sesión. La asignación de roles y la administración de copias requieren acceso de propietario fuera del cliente. Las nueve tablas internas aplican RLS sin políticas de acceso directo para jugadores. La función de dominio valida cada comando con `auth.uid()`, permisos y estado bajo transacción.

Para retirar el prototipo, detén el cliente de desarrollo o vuelve a su revisión anterior y conserva la base y el catálogo v1. Las correcciones del esquema se distribuyen mediante nuevas migraciones hacia delante. Mantén disponibles las definiciones y reglas de una versión mientras existan partidas que la usen.
