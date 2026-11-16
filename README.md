# React + TypeScript + Vite

## Optional IMDb ratings

To display numeric IMDb ratings on movie and TV detail pages, request a free [OMDb key](https://www.omdbapi.com/apikey.aspx), set `VITE_OMDB_API_KEY` in `.env.local`, and restart Vite. OMDb limits free keys to 1,000 daily requests. Vite includes this key in the browser bundle, so leave it unset in public builds if you need to keep it private.

Detail pages use TMDB for viewer scores and age certifications. When TMDB has an IMDb ID for the title, they also link to IMDb and its Parents Guide.

## Awards archive

The app ships a snapshot through 2026. Oscar winner records use the archive years shown by the Academy, including the labels assigned to the first five editions. The Oscar snapshot uses the [Film Awards API dataset](https://github.com/mattgrosso/film-awards-api), published under MIT, with links to the [Academy archive](https://www.oscars.org/oscars/ceremonies). Emmy highlights use the [Television Academy winners archive](https://www.televisionacademy.com/awards/nominees-winners/1949) and link to its year and category records.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
