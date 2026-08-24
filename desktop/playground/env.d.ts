/// <reference types="vite/client" />

// `@stonecrop/desktop/styles` is a CSS subpath export. Vite resolves it through the package's
// `exports` map, but there is no declaration file for TypeScript to find, and unlike a bare
// `*.css` specifier it does not match vite/client's wildcard.
declare module '@stonecrop/desktop/styles'
