# github-repo-explorer

React application which integrates with github.com API and allows user to search users with a username similar to the value entered in text input.

### Demo App:

**[GitHub repo explorer](https://github-repo-explorer-q.netlify.app)**

### Features:

- Search user by username.
- User repository list.
- Repository details.
- Responsive design.
- Toggle light or dark color scheme.
- Search by voice using **[SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)**, the interface of the **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**.
- Speech content in repository detail page using **[Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)**.

## Getting Started

Clone or download this repo.

First is important copy or rename file **.env.example** to **.env** and configuration your **[GitHub access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)**.

Then install dependencies:

```bash
npm install
```

## Available Scripts

### Running the development server.

```bash
    npm run dev
```

### Building for production.

```bash
    npm run build
```

### Running the production server.

```bash
    npm run start
```

## Learn More

To learn more about **Refine**, please check out the [Documentation](https://refine.dev/docs)

- **REST Data Provider** [Docs](https://refine.dev/docs/core/providers/data-provider/#overview)
- **Ant Design** [Docs](https://refine.dev/docs/ui-frameworks/antd/tutorial/)
- **React Router** [Docs](https://refine.dev/docs/core/providers/router-provider/)

## License

MIT
