# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Frontend ABM Express

## Deploy en GitHub Pages

1. Asegúrate de tener el repo en GitHub y la rama principal (`main` o `master`).
2. Configura el archivo `vite.config.js` con la base correcta:
   ```js
   base: '/frontendABM/'
   ```
   (Ya está configurado.)
3. Instala las dependencias (si no lo hiciste):
   ```sh
   npm install
   ```
4. Para publicar:
   ```sh
   npm run deploy
   ```
   Esto compila el proyecto y sube el contenido de `dist/` a la rama `gh-pages`.
5. Ve a la configuración del repo en GitHub > Pages y selecciona la rama `gh-pages` como fuente.
6. Accede a tu app en:
   `https://Juanmabott.github.io/frontendABM/`

## Notas
- Si cambias el nombre del repo, actualiza la propiedad `homepage` en `package.json` y la base en `vite.config.js`.
- El backend debe estar desplegado aparte (Render, Railway, etc).
- Si usas rutas internas, asegúrate de que sean relativas o maneja el basePath correctamente.

## Scripts útiles
- `npm run dev` — desarrollo local
- `npm run build` — build de producción
- `npm run deploy` — publica en GitHub Pages

---

¿Problemas con el deploy? Verifica que la rama `gh-pages` existe y que la URL base coincide con el nombre del repo.
