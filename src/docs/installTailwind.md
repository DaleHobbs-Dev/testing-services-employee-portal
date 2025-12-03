# Tailwind CSS v4 Setup Guide for React + Vite

This guide walks you through setting up Tailwind CSS v4 in a React project using Vite.

---

## Prerequisites

- Node.js installed (v18 or higher recommended)
- A React project using Vite (if you don't have one, see below)

---

## Step 1: Create a React + Vite Project (if needed)

If you're starting from scratch:

```bash
npm create vite@latest my-project -- --template react
cd my-project
npm install
```

---

## Step 2: Install Tailwind CSS v4

Install Tailwind CSS v4 and the Vite plugin:

```bash
npm install -D tailwindcss@next @tailwindcss/vite@next
```

---

## Step 3: Configure Vite

Update your `vite.config.js` to include the Tailwind plugin:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Note:** The `alias` configuration is optional but recommended for cleaner imports.

---

## Step 4: Set Up Your CSS File

Create or update `src/index.css`:

```css
/* Load Tailwind v4 */
@import "tailwindcss";

/* Optional: Define your custom theme */
@theme {
  /* Custom colors */
  --color-primary-500: #6c2fb3;
  --color-primary-700: #4b1c77;
  
  /* Add more custom values as needed */
}

/* Optional: Add custom component styles */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}
```

---

## Step 5: Import CSS in Your App

Make sure your `src/main.jsx` imports the CSS file:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'  // ← Make sure this line is here

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

---

## Step 6: Start Using Tailwind

Update your `src/App.jsx` to test Tailwind:

```jsx
function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Hello Tailwind v4!
        </h1>
        <p className="text-gray-600">
          If you can see this styled, Tailwind is working! 🎉
        </p>
      </div>
    </div>
  )
}

export default App
```

---

## Step 7: Run Your Dev Server

```bash
npm run dev
```

Open your browser to the URL shown (usually `http://localhost:5173`) and you should see your styled page!

---

## Common Issues & Solutions

### Issue: `__dirname is not defined`

If you get this error in `vite.config.js`, make sure you have these imports:

```javascript
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

### Issue: Styles not loading

1. Make sure you've restarted your dev server after changing `vite.config.js`
2. Verify `./index.css` is imported in `main.jsx`
3. Check that `@import "tailwindcss"` is at the top of `index.css`

### Issue: Custom colors not working

Make sure custom colors are defined inside the `@theme` block in your CSS file, not in `:root`:

```css
/* ✅ Correct */
@theme {
  --color-primary-500: #6c2fb3;
}

/* ❌ Won't work for Tailwind utilities */
:root {
  --color-primary-500: #6c2fb3;
}
```

---

## VS Code Setup (Optional)

### Install Extension

Install the official Tailwind CSS IntelliSense extension for autocomplete.

### Disable CSS Unknown At-Rule Warnings

Add to your `.vscode/settings.json`:

```json
{
  "css.lint.unknownAtRules": "ignore"
}
```

---

## Next Steps

- Check out the [Tailwind v4 documentation](https://tailwindcss.com/docs)
- Create reusable UI components
- Customize your theme in the `@theme` block
- Build something amazing! 🚀

---

## Quick Reference

### Using Custom Colors

After defining `--color-primary-500` in `@theme`:

```jsx
<div className="bg-primary-500 text-white">
  Custom themed button
</div>
```

### Using Arbitrary Values

```jsx
<div className="bg-[#123456] w-[347px]">
  One-off custom values
</div>
```

### Responsive Design

```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>
```
