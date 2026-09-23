# BiblioTK-front — Landing pública, login, registro y catálogo

Parte del sistema BiblioTK (ver `../CLAUDE.md`). Reemplaza la parte pública de `FrontBiblioTK` (sin autenticar): landing, login, registro y un catálogo de ejemplo. React 19 + React Router 7 + Vite 8 + Tailwind CSS 4.

- **Arranque:** `npm run dev` → http://localhost:5172
- **Tipografías/íconos:** igual que el resto de los fronts — Fontsource (Bricolage Grotesque + Geist) y `@phosphor-icons/react` con `IconContext` fijado en `src/main.jsx`.
- **Librería de interfaz:** `bibliotk-ui` (`file:../BiblioTK-ui`) — ver su CLAUDE.md para el sistema de diseño completo. `vite.config.js` necesita el `resolve.dedupe` de React/router/íconos, si no se duplica React.
- **`main.jsx`** envuelve `<App />` en `ErrorBoundary` (de `bibliotk-ui`), afuera del `BrowserRouter`.

## Estructura

```
src/
  main.jsx
  app/
    pages/
      App.jsx        # Rutas ("/", "/catalogo", "/login", "/register"), redirect por rol tras loguearse
      Landing.jsx     # "/" — hero y CTAs a login/registro/catálogo
      Catalogo.jsx    # "/catalogo" — lista pública de materiales, o "en construcción" si no hay datos
      Login.jsx
      Register.jsx
    components/
      PublicNav.jsx   # Nav compartido entre Landing y Catalogo (única pieza que usan ambas páginas)
    dto/              # loginUser, registerUser
    utils/userValidation.js  # Validación compartida con BiblioTK-front-user (Perfil)
    styles/globals.css
  service/
    LoginService.js     # loginUser, getCurrentSession, logoutUser → :3001
    RegisterService.js  # registerUser → :3000
    CatalogoService.js  # listCatalogo → :3004 (MaterialesBiblioTK, lectura pública)
```

## Redirección entre apps (`App.jsx`)

Cada rol vive en una app/puerto separado. `ROLE_HOME` mapea `rol` → `{ path, url }` (con fallback `http://localhost:PUERTO` si no hay `.env`):

| Rol | App | Puerto |
|---|---|---|
| `usuario` | BiblioTK-front-user | 5173 |
| `admin` | BiblioTK-front-admin | 5174 |
| `superadmin` | BiblioTK-front-superadmin | 5145 |
| `catalogo` | (futuro, servicio propio) | 5146 |

Tras un login exitoso, `InicioSesionBiblioTK` ya dejó la cookie `bibliotk_rol` (no httpOnly) en la misma respuesta de `POST /Login`: `handleLoginSuccess` la lee directo de `document.cookie` (helper local `leerCookie`) y hace `window.location.assign(...)` a la app correspondiente — sin esperar un segundo `GET /Sesion`. Esa cookie es solo una ayuda de enrutamiento en el cliente: la sesión real la sigue validando cada backend contra la cookie `token_acceso` (httpOnly).

### Mensajes tras un redirect entre apps (`?motivo=`)

Las otras 3 apps no pueden pasar estado de React cuando redirigen acá con `window.location.assign` (sesión vencida, rol sin permiso, cuenta borrada): en vez de eso agregan `?motivo=X` a la URL de destino (`/login?motivo=sesion_expirada`, por ejemplo). `AppContent` lee `useSearchParams()` una vez al montar y usa `MOTIVO_MENSAJES` para mostrar el mensaje correspondiente en `Login` (`sessionMessage`). Motivos usados hoy: `sesion_expirada`, `sin_permiso`, `cuenta_eliminada`.

## Catálogo (`Catalogo.jsx`)

Pública, sin sesión: llama a `GET /MaterialesBiblioTK/Materiales` (público en el backend). Si el servicio no responde o no hay materiales cargados, muestra una pantalla "en construcción" (mismo estilo que `Construccion.jsx` en `BiblioTK-front-user`) en vez de un error o una página en blanco. Con datos, muestra una grilla de tarjetas de solo lectura — no hay edición acá, eso vive en `BiblioTK-front-admin`.

## Registro (`Register.jsx`)

La validación de campos vive en `utils/userValidation.js` (compartida con la edición de perfil) más la contraseña, propia de este formulario. Los errores que devuelve el backend (formato inválido, correo/cédula/usuario duplicado) llegan con `{ campo, message }` — `RegisterService.js` los expone como `error.field`/`error.message` y `Register.jsx` los muestra en el campo correspondiente, no en un banner genérico.

## Pendientes conocidos

- El catálogo real (con su propio dominio/puerto 5146, según el diagrama original) todavía no existe como servicio aparte: por ahora esta página cumple ese rol leyendo directo de `MaterialesBiblioTK`.
- `README.md` sigue siendo la plantilla por defecto de Vite.
