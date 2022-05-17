# Iconic Devs Exercise 1 - Gabriel Mendez

Full-Stack software application (supermarket checkout).

## Requirements:

- Node.JS v16 (at the time of writing this is the current LTS).
- Preferably Mac or Linux OS because of issues Windows might present during
  development since it's known for not working quite well with development unless using WSL.

## Technical description

- `back` contains the back-end of the application and it's written in NodeJS using TypeScript and [ExpressJS](https://expressjs.com/) as the web framework.
- `front` contains the front-end of the application and it's written in React using the [Remix](https://remix.run/) framework. The framework solves similar problems to the ones [Next.js](https://nextjs.org/) solves but I've been using it more recently and personally prefer it over Next which is why I chose it for this project.

## Local development.

1. Install dependencies with `npm install` in both `back/` and `front/`.
2. Run `npm run dev` in one terminal inside `back/` to run the development version of the back-end of the application.
3. Run `npm run dev` in one terminal inside `front/` to run the development version of the front-end of the application.
