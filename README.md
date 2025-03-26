# Instagramable Frontend

This is a modern React application bootstrapped with [Vite](https://vite.dev/), a fast and lightweight development tool.

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm (comes with Node.js)
- Environment variables (request from team lead)

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the required values (ask another teammate)
3. Install dependencies:

```bash
npm install
```

### Running the App

To start the development server:

```bash
npm run dev
```

This will start the app at `http://localhost:5173`

## 📁 Project Structure

instagramable-fe/
├── src/ # Source code
│ ├── assets/ # Images, fonts, etc.
│ ├── components/ # application components
│ ├── App.jsx # Main App component
│ ├── main.jsx # Application entry point
│ ├── App.css # App-specific styles
│ └── index.css # Global styles
├── public/ # Static files
└── index.html # HTML entry point

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔧 Development Tools

### Vite

This project uses Vite for blazing-fast development. It provides:

- Hot Module Replacement (HMR)
- Lightning-fast server start
- Optimized builds

### Code Quality Tools

1. **ESLint**

   - Helps catch bugs and enforce consistent code style
   - Configuration can be found in `eslint.config.js`

2. **Prettier**

   - Automatically formats your code
   - Configuration in `.prettierrc`
   - Run with `npm run format`

3. **Git Hooks**
   - Pre-commit hooks ensure code quality
   - Automatically formats code before commits

## 💅 Styling

The project uses plain CSS with some modern features:

- CSS Variables (Custom Properties)
- Flexbox layouts
- Dark/Light mode support via `prefers-color-scheme`

You can find global styles in `src/index.css` and component-specific styles in `src/App.css`.

## 🔍 Important Files

1. **vite.config.js**

   - Configures build tools and aliases
   - Sets up React plugin
   - Defines path aliases (use `@/` to import from `src/`)

2. **index.html**

   - Entry point of the application
   - Contains meta tags and root div

3. **.gitignore**
   - Specifies which files Git should ignore
   - Includes common development files and directories

## 🤝 Contributing

1. Make sure your code follows the project's style guide
2. Run `npm run lint` and `npm run format` before committing
3. Git hooks will automatically format your code on commit

## 🐛 Common Issues

1. **Module not found errors**

   - Make sure all dependencies are installed (`npm install`)
   - Check import paths (use `@/` for src directory)

2. **Styling issues**
   - Check if you're in dark/light mode
   - Verify CSS class names
   - Check browser console for errors

## 📚 Learning Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

## Hosting

This project will be hosted on Vercel.

will add more information here soon.

## Hosting

This project will be hosted on Vercel.

will add more information here soon.

## Errors that come up

if you can't run your app and you see this error:

```
Instagramable-fe git:(main) ✗ npm run dev

> instagramable-fe@0.0.0 dev
> vite

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
              ^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:128:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
```

go to your terminal and run `nvm use`.

vite

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
              ^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:128:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

```

```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.


file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
              ^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:128:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.
```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

```

```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

```

```

```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

```

```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

```

```

```

```

file:///Users/parsatajik/pari-codes/ig/Instagramable-fe/node_modules/vite/dist/node/chunks/dep-ByPKlqZ5.js:4
import fsp, { constants as constants$9 } from 'node:fs/promises';
^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
at ModuleJob.\_instantiate (node:internal/modules/esm/module_job:128:21)
at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
at async Promise.all (index 0)
at async ESMLoader.import (node:internal/modules/esm/loader:385:24)

```

go to your terminal and run `nvm use`.
go to your terminal and run `nvm use`.

```

```

```
