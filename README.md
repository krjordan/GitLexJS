
# GitLexJS 🚀✨

Generate intelligent commit messages for your Git changes using AI. GitLexJS uses OpenAI's GPT models to craft meaningful commit messages based on your code diffs.

## Table of Contents

- [Installation](#installation)
- [Prerequisites](#prerequisites)
- [Usage](#usage)
- [API Key Configuration](#api-key-configuration)
- [Roadmap](#roadmap-🗺️✨)
- [Development Workflow](#development-workflow)
- [Contributing](#contributing)
- [License](#license)

### Prerequisites

Ensure you have Node.js and npm installed. If not, download and install them from Node.js's official site.

## Installation 📦

1. Clone the repository:

```bash
git clone https://github.com/krjordan/GitLexJS.git
cd GitLexJS
```

2. Install the required dependencies:

```bash
npm install
```

## Usage 🚀

To generate an AI-based commit message based on your git diff:

```bash
node main.js --path /path/to/your/repo
```

#### Arguments:

`--path` (optional): Path to git repository. Default is the current directory.
If you want to check if your OpenAI API key is already stored and know where it is stored:

```bash
node main.js --check-api-key
```

**Note:** The tool will prompt you for the OpenAI API key if it's not found in the configuration file. Your API key will be stored locally in the `.gitlex-config.json` file.

## API Key Configuration 🔑

For `GitLexJS` to work, you'll need an OpenAI API key. 

1. [Sign up](https://beta.openai.com/signup/) for an API key with OpenAI.
2. Once you've obtained your key, run `GitLexJS` for the first time, and it will prompt you to enter it. Your key will be stored locally and securely in `.gitlex-config.json` for future use. 

> ⚠️ **Note:** Never share your API key or commit it directly to your codebase.

## Roadmap 🗺️✨

Let's make your commit messages smarter and your Git workflow smoother. Here's a look into what we're planning for the future. Feedback, contributions, and suggestions are always welcome! Take a look at the `ROADMAP` file for the deets!

## Development Workflow 🛠

We follow the gitflow workflow. Here's a quick breakdown:

- **Develop**: This is the main development branch where all the changes are merged into.
- **Release**: When `develop` is stable and ready for a release, it's branched to `release` for final testing.
- **Main**: Once testing is complete and everything is stable, `release` is merged into `main`.

## Contributing 🤝

Contributions are welcome! Whether it's bug reports, feature requests, or new integrations, we'd love to see what you can come up with. Check out the `CONTRIBUTING` file for more details.

1. Fork the repository.
2. Make your changes on a new branch.
3. Submit a pull request and describe your changes.

## License 📄

`GitLexJS` is open-source software licensed under the MIT License. See the `LICENSE` file for more details.