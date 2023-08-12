# GitLexJS 🚀✨

Generate intelligent commit messages for your Git changes using AI. GitLexJS leverages OpenAI's GPT models to craft meaningful commit messages based on your code diffs.

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

To generate an AI-based commit message for your git diff:

```bash
gitlexjs --path /path/to/your/repo
```

#### Arguments:

`--path` (optional): Path to git repository. Default is the current directory.
To check if your OpenAI API key is already stored:

```bash
gitlexjs --check-api-key
```

**Note:** The tool will prompt you for the OpenAI API key if it's not found in the configuration file. Your API key will be stored locally in the `.gitlex-config.json` file.

## API Key Configuration 🔑

For `GitLexJS` to work, you'll need an OpenAI API key:

1. [Sign up](https://beta.openai.com/signup/) for an API key with OpenAI.
2. The first time you run `GitLexJS`, it will prompt you to enter the key. It's then stored locally and securely in `.gitlex-config.json`.

> ⚠️ **Note:** Never share your API key or commit it directly to your codebase.

## Roadmap 🗺️✨

Join us in refining your commit messages. Look into our future plans in the `ROADMAP.md` file. Feedback, contributions, and suggestions are always welcome!

## Development Workflow 🛠

For contributors, we follow the gitflow workflow:

- **Develop**: Our main development branch.
- **Release**: For final testing before a release.
- **Main**: Stable releases are merged here.

### Local Development Setup:

1. Clone the repository:

```bash
git clone https://github.com/krjordan/GitLexJS.git
cd GitLexJS
```

2. Install dependencies:

```bash
npm install
```

3. Run locally:

```bash
node dist/index.js
```

## Contributing 🤝

Your contributions are eagerly awaited! From bug reports, feature requests to new ideas – share them all. Dive into the `CONTRIBUTING.md` file for guidance.

1. Fork the repository.
2. Create a new branch for your changes.
3. Raise a pull request detailing your additions.

## License 📄

GitLexJS is open-sourced under the MIT License. Dive into the `LICENSE.md` for all the specifics.
