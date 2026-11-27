import { createClient } from '@supabase/supabase-js';
export const el = (tag, cls = '', value) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (value !== undefined) e.textContent = value;
  return e;
};
export function button(label, click, cls = '') {
  const b = el('button', cls, label);
  b.type = 'button';
  b.onclick = click;
  return b;
}
export function input(label, type = 'text', attributes = {}) {
  const wrapper = el('label', 'field', label),
    control = el('input');
  control.type = type;
  Object.assign(control, attributes);
  wrapper.append(control);
  return { wrapper, control };
}
export function select(label, entries) {
  const wrapper = el('label', 'field', label),
    control = el('select');
  for (const [value, text] of entries) {
    const opt = el('option', '', text);
    opt.value = value;
    control.append(opt);
  }
  wrapper.append(control);
  return { wrapper, control };
}
const url = import.meta.env.VITE_SUPABASE_URL,
  key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const db = url && key ? createClient(url, key) : null;
export async function rpc(op, p = {}) {
  const { data, error } = await db.rpc('tcards', { op, p });
  if (error) throw Object.assign(new Error(error.message), { code: error.code });
  return data;
}
export async function command(op, p = {}) {
  const args = { ...p, commandId: crypto.randomUUID() };
  try {
    return await rpc(op, args);
  } catch (e) {
    if (!/fetch|network|conexi|timeout/i.test(e.message)) throw e;
    return rpc(op, args);
  }
}
export function authForm(parent, done, register = true) {
  if (!db) {
    parent.append(
      el(
        'p',
        'notice',
        'Realms necesita la configuración de Supabase de desarrollo. Consulta el README para conectarlo.',
      ),
    );
    return;
  }
  const form = el('form', 'form'),
    email = input('Correo electrónico', 'email', { required: true, autocomplete: 'email' }),
    password = input('Contraseña', 'password', {
      required: true,
      minLength: 8,
      autocomplete: 'current-password',
    });
  const submit = el('button', 'primary', 'Iniciar sesión'),
    signup = el('button', '', 'Crear cuenta');
  const msg = el('p', 'notice');
  msg.setAttribute('role', 'status');
  form.append(email.wrapper, password.wrapper, submit);
  if (register) form.append(signup);
  form.append(msg);
  parent.append(form);
  form.onsubmit = async (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    submit.disabled = signup.disabled = true;
    try {
      const args = { email: email.control.value.trim(), password: password.control.value };
      const { data, error } =
        e.submitter === signup
          ? await db.auth.signUp(args)
          : await db.auth.signInWithPassword(args);
      if (error) {
        const messages = {
          invalid_credentials: 'Revisa el correo y la contraseña.',
          email_not_confirmed: 'Confirma tu correo antes de iniciar sesión.',
          weak_password: 'Elige una contraseña más segura.',
          over_email_send_rate_limit: 'Espera unos minutos antes de solicitar otro correo.',
          user_already_exists: 'Ya hay una cuenta registrada con ese correo.',
        };
        throw Error(
          messages[error.code] ??
            'No se pudo completar el acceso. Comprueba tu conexión e inténtalo de nuevo.',
        );
      }
      if (data.session) {
        password.control.value = '';
        await done();
      } else msg.textContent = 'Revisa tu correo para confirmar la cuenta y después inicia sesión.';
    } catch (err) {
      msg.textContent = err.message;
    } finally {
      submit.disabled = signup.disabled = false;
    }
  };
}
