# Zag

Aplicación de escritorio desarrollada con Tauri 2, React, TypeScript y Vite.
Bun estable se utiliza para instalar dependencias y ejecutar el toolchain del
frontend.

## Requisitos

- [Bun estable](https://bun.com/docs/installation)
- [Dependencias de Tauri 2](https://v2.tauri.app/start/prerequisites/) para tu
  sistema operativo
- Toolchain estable de Rust

## Desarrollo

Instala las dependencias respetando el lockfile:

```sh
bun install --frozen-lockfile
```

Ejecuta la aplicación de escritorio:

```sh
bun run tauri-dev
```

Para trabajar únicamente en el frontend:

```sh
bun run dev
```

Vite estará disponible en `http://localhost:1234`.

## Verificación y build

Comprueba tipos y genera el frontend de producción:

```sh
bun run check
```

Genera los instaladores de Tauri:

```sh
bun run tauri build
```

El CI utiliza la versión estable más reciente de Bun y
`bun install --frozen-lockfile` para evitar que una
instalación modifique silenciosamente las versiones resueltas.
