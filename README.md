# K1D T0M1 Portfolio

Portfolio profesional de Tomás Cabello creado como proyecto independiente con Vue 3 y Vite.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Qué incluye

- Marca principal: `K1D T0M1`.
- Presentación profesional como Tomás Cabello, Full-stack Developer.
- Casos destacados con problema, solución y resultado.
- Explorador de repositorios públicos de GitHub con búsqueda y filtros.
- Fallback local si la API de GitHub no responde.
- Selector bilingüe ES/EN persistido en `localStorage`.
- Sección discreta para enlazar una futura web de DJ/productor musical.

## Datos externos

La sección de repositorios consulta:

```txt
https://api.github.com/users/Tomascabfer4/repos?sort=updated&per_page=100
```

Si la petición falla, se renderiza una lista local definida en `src/data.js`.
