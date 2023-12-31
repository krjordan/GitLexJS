[![npm version](https://badge.fury.io/js/gitlexjs.svg)](https://www.npmjs.com/package/gitlexjs)

# GitLexJS 🚀✨

GitLexJS is a command-line tool that uses the power of AI to generate meaningful commit messages for your Git changes. Leveraging OpenAI's GPT models, GitLexJS analyzes your code diffs and crafts commit messages that accurately reflect the changes you've made. Say goodbye to the struggle of coming up with commit messages and let GitLexJS do the work for you! 🎉

## Table of Contents

- [Installation](#installation-📦)
- [Prerequisites](#prerequisites)
- [Usage](#usage-🚀)
- [API Key Configuration](#api-key-configuration-🔑)
- [Roadmap](#roadmap-🗺️✨)
- [Development Workflow](#development-workflow-🛠)
- [Contributing](#contributing-🤝)
- [License](#license-📄)

### Prerequisites

Ensure you have Node.js and npm installed. If not, download and install them from [Node.js's official site](https://nodejs.org/).

**Important**: You will also need an OpenAI API key. See [API Key Configuration](#api-key-configuration-🔑) below.

## Installation 📦

Install GitLexJS globally:

```bash
npm install -g gitlexjs
```

## Usage 🚀

GitLexJS uses an interactive menu for user input.

To start the tool, simply run:

```bash
gitlex
```

You will be presented with a list of options:

- Generate a commit message
- Set API Key
- Replace API Key
- Delete my API Key
- Check if API key is set
- Select OpenAI model
- Show version
- Exit

Select the option you want by using the arrow keys and pressing Enter.

**Note:** The tool will prompt you for the OpenAI API key if it's not found in the configuration file. Your API key will be stored locally in the `.gitlex-config.json` file.

## API Key Configuration 🔑

For `GitLexJS` to work, you'll need an OpenAI API key:

1. [Sign up](https://beta.openai.com/signup/) for an API key with OpenAI.
2. Run `GitLexJS` and select the appropriate option from the interactive menu to set, replace, or delete your API key. The key is then stored locally and securely in `.gitlex_config.json`.

> ⚠️ **Note:** Never share your API key or commit it directly to your codebase.

## Roadmap 🗺️✨

Join us in refining your commit messages. Look into our future plans in the `ROADMAP.md` file. Feedback, contributions, and suggestions are always welcome!

### Development Workflow 🛠

For contributors, we follow the gitflow workflow:

- **Develop**: Our main development branch.
- **Release**: For final testing before a release.
- **Main**: Stable releases are merged here.

#### Local Development Setup:

1. Clone the repository:

```bash
git clone https://github.com/krjordan/GitLexJS.git
cd GitLexJS
```

2. Install dependencies:

```bash
npm install
```

#### Running the Application:

To run the application locally, use the following command:

```bash
npm start
```

#### Building the Application:

To build the application, use the following command:

```bash
npm run build
```

#### Linting:

To run the linter, use the following command:

```bash
npm run lint
```

#### Testing:

To run tests, use the following command:

```bash
npm run test
```

## Contributing 🤝

Your contributions are eagerly awaited! From bug reports, feature requests to new ideas – share them all. Dive into the `CONTRIBUTING.md` file for guidance.

1. Fork the repository.
2. Create a new branch for your changes.
3. Raise a pull request detailing your additions.

## License 📄

GitLexJS is open-sourced under the MIT License. Dive into the `LICENSE.md` for all the specifics.
