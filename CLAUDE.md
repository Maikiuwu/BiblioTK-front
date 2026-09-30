# BiblioTK-front — Landing pública, login, registro y catálogo

Parte del sistema BiblioTK (ver `../CLAUDE.md`). Reemplaza la parte pública de `FrontBiblioTK` (sin autenticar): landing, login, registro y un catálogo de ejemplo. React 19 + React Router 7 + Vite 8 + Tailwind CSS 4.

- **Arranque:** `npm run dev` → http://localhost:5172
- **Tipografías/íconos:** igual que el resto de los fronts — Fontsource (Bricolage Grotesque + Geist, importadas en `globals.css`) y `@phosphor-icons/react` con `IconContext` (de `@phosphor-icons/react/dist/lib/context`) fijado en `src/main.jsx`. Un import por ícono (`@phosphor-icons/react/ArrowRight`); ESLint prohíbe el paquete entero.
- **Librería de interfaz:** `bibliotk-ui` `^0.2.0` **de npm** (repo `UiBiblioTK`), con JS y CSS ya compilados. `ErrorBoundary` y `CoverImage` vienen de ahí; solo `PublicFooter` vive en `src/app/components/`. `vite.config.js` mantiene el `resolve.dedupe` de React/router/íconos.
- **CSS:** `src/app/styles/globals.css`, enlazado con `<link>` en `index.html` (no se importa desde `main.jsx`): fuentes + `bibliotk-ui/styles.css` + solo `theme` y `utilities` de Tailwind. Ver `../UiBiblioTK/CLAUDE.md`.
- **`main.jsx`** envuelve `<App />` en `ErrorBoundary` (de la librería), afuera del `BrowserRouter`.
- **Carga:** Landing y Login van en el paquete inicial; Catálogo y Registro (con Zod) se cargan con `React.lazy` y se precargan cuando el navegador queda libre.

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
      PublicNav.jsx     # Nav compartido entre Landing y Catalogo (única pieza que usan ambas páginas)
      PublicFooter.jsx  # Pie de las páginas públicas
    dto/              # loginUser, registerUser
    utils/userValidation.js  # Validación compartida con BiblioTK-front-user (Perfil)
    styles/globals.css
  service/
    LoginService.js     # loginUser, getCurrentSession, logoutUser → :3001
    RegisterService.js  # registerUser → :3000
    CatalogoService.js  # listCatalogo → :3003 (MaterialesBiblioTK, lectura pública)
```

## Redirección entre apps (`App.jsx`)

Cada rol vive en una app/puerto separado. `ROLE_HOME` mapea `rol` → `{ path, url }` (con fallback `http://localhost:PUERTO` si no hay `.env`):

| Rol | App | Puerto |
|---|---|---|
| `usuario` | BiblioTK-front-user | 5173 |
| `admin` | BiblioTK-front-admin | 5174 |
| `superadmin` | BiblioTK-front-superadmin | 5175 |
| `catalogo` | (futuro, servicio propio) | 5146 |

Tras un login exitoso, `handleLoginSuccess(rol)` usa el rol que ya devuelve `POST /Login` (`{ user: { email, rol } }`) y hace `window.location.assign(...)` a la app correspondiente; solo si no viene consulta `GET /Sesion`. Devuelve `true` cuando ya está redirigiendo: `Login` y `Register` dejan el botón en "cargando" hasta que cambie la página. (`InicioSesionBiblioTK` también deja la cookie `bibliotk_rol`, no httpOnly, que hoy este front no lee.) La sesión real la valida cada backend contra la cookie `token_acceso` (httpOnly).

### Mensajes tras un redirect entre apps (`?motivo=`)

Las otras 3 apps no pueden pasar estado de React cuando redirigen acá con `window.location.assign` (sesión vencida, rol sin permiso, cuenta borrada): en vez de eso agregan `?motivo=X` a la URL de destino (`/login?motivo=sesion_expirada`, por ejemplo). `AppContent` lee `useSearchParams()` una vez al montar y usa `MOTIVO_MENSAJES` para mostrar el mensaje correspondiente en `Login` (`sessionMessage`). Motivos usados hoy: `sesion_expirada`, `sin_permiso`, `cuenta_eliminada`.

## Catálogo (`Catalogo.jsx`)

Pública, sin sesión: llama a `GET /MaterialesBiblioTK/Materiales` (público en el backend). Si el servicio no responde o no hay materiales cargados, muestra una pantalla "en construcción" en vez de un error o una página en blanco. Con datos, muestra una grilla de tarjetas de solo lectura con la portada de cada material (`CoverImage` de la librería: primero la copia remota/Cloudinary, si falla la local) — no hay edición ni préstamos acá: pedir un préstamo es de `BiblioTK-front-user`, editar es de `BiblioTK-front-admin`.

## Registro (`Register.jsx`)

La validación de campos vive en `utils/userValidation.js` (compartida con la edición de perfil) más la contraseña, propia de este formulario. Los errores que devuelve el backend (formato inválido, correo/cédula/usuario duplicado) llegan con `{ campo, message }` — `RegisterService.js` los expone como `error.field`/`error.message` y `Register.jsx` los muestra en el campo correspondiente, no en un banner genérico.

## Pendientes conocidos

- El catálogo real (con su propio dominio/puerto 5146, según el diagrama original) todavía no existe como servicio aparte: por ahora esta página cumple ese rol leyendo directo de `MaterialesBiblioTK`.
- `README.md` sigue siendo la plantilla por defecto de Vite.
