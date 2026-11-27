# Cliente compartido

`client.js` conecta juego y Admin con Supabase Auth y la RPC de dominio. También comparte los controles de formulario y la construcción segura de texto en el DOM. Los contratos `ActionIntent` y `GameSnapshot` se definen junto al motor de reglas en `packages/engine/world.ts`.
