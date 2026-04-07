# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

npm create nuxt@latest <project-name> 

=> npm create nuxt@latest my-nuxt-app


# Using npm install primevue

=> npm install primevue @primeuix/themes

=> npm install --save-dev @primevue/nuxt-module


=> After install primevue Add to file nuxt.config


import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
    modules: [
        '@primevue/nuxt-module'
    ],
    primevue: {
        options: {
            ripple: true,
            inputVariant: 'filled',
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
            }
        }
    }
})

# pinia install

=>npx nuxi@latest module add pinia

=> After install pinia Add to file nuxt.config
// nuxt.config.js
export default defineNuxtConfig({
  // ... other options
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})

# Install Tailwind CSS with Nuxt

=> npm install tailwindcss @tailwindcss/vite

=> After install Tailwind Add to file nuxt.config

# Configure Vite Plugin

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});

# Import Tailwind CSS

Create an ./app/assets/css/main.css file and add an @import that imports Tailwind CSS.

/// main.css

@import "tailwindcss";


# Add the CSS file globally

Add your newly-created ./app/assets/css/main.css to the css array in your nuxt.config.ts file.

import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
});

# Start using Tailwind in your project

/// app.vue
<template>
  <h1 class="text-3xl font-bold underline">
    Hello world!
  </h1>
</template>



```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
