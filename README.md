# Internal Landing Page Template

This repository serves as a template for creating new landing pages at Fractal. It's built with Next.js, TypeScript, and Tailwind CSS to ensure consistency and accelerate development.

---

## 🚀 Features

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Internationalization (i18n)** with `next-intl` (EN/RU pre-configured)
- **Ark UI** for accessible components
- **Type-safe page definitions** with a custom `definePage` utility
- **Feature-based project structure** for better organization

## 🛠 How to Use This Template

This repository is configured as a GitHub template. To create a new landing page project from it, follow these steps:

1.  **Create a new repository**: Click the **"Use this template"** button at the top of this page and select "Create a new repository".

2.  **Clone your new repository**:

    ```bash
    git clone <your-new-repository-url>
    cd <your-new-repository-name>
    ```

3.  **Install dependencies**:

    ```bash
    npm install
    ```

4.  **Start the development server**:
    ```bash
    npm run dev
    ```
    The project will be available at [http://localhost:4000](http://localhost:4000).

## ⚙️ Available Scripts

- `npm run dev`: Starts the development server with Turbopack.
- `npm run build`: Creates a production-ready build.
- `npm run start`: Runs the production server.
- `npm run lint`: Checks code quality with ESLint and Prettier.
- `npm run lint:fix`: Automatically fixes linting and formatting issues.

## 🏗 Architecture & Customization

### Project Structure

The template uses a feature-based architecture to keep code organized:

```
src/
├── app/            # Next.js App Router (routing)
├── features/      # Business logic and feature modules (pages, i18n)
├── locales/      # Translation files (en.json, ru.json)
├── shared/       # Reusable UI components and utilities
└── middleware.ts # Handles i18n routing
```

### Customization

- **Styling**: Modify global styles in `src/app/globals.css` and the theme in `tailwind.config.js`.
- **Adding Pages**: Create new page components in `src/features/pages/` and define their routes in `src/app/[locale]/`.
- **Internationalization**: Add new languages by updating `src/features/i18n/routing.ts` and creating a corresponding `new-locale.json` file in `src/locales/`.

## 🚢 Deployment

Deployment should follow standard company procedures for web applications. This project includes a `Dockerfile` that can be used for creating a containerized build suitable for our internal infrastructure.

To build and run the Docker container locally:

```bash
docker build -t fractal-landing-template .
docker run -p 4000:4000 fractal-landing-template
```

## 🤝 Contributing to the Template

If you enhance the template with a useful, reusable feature, please contribute back!

1.  Make your changes on a separate branch.
2.  Ensure all code passes linting checks with `npm run lint:fix`.
3.  Open a pull request against the `main` branch of this template repository for review.

## 🆘 Support

For any questions or issues regarding this template, please contact the **Frontend Team**.
