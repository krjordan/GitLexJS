#!/usr/bin/env node

import { getApiKeyFromConfig, saveApiKeyToConfig } from "./config/config-handler"
import { getGitChanges, truncateDiff } from "./git/git-handler"
import { generateCommitMessage } from "./openai/openai-handler"
import * as readline from 'readline';

const CONFIG_FILE = '.gitlex_config.json';

function checkApiKey(): void {
  try {
    if (getApiKeyFromConfig()) {
      console.log(`An OpenAI API key is stored in the ${CONFIG_FILE} file.`);
    } else {
      console.log('No OpenAI API key is stored in the config file.');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error checking for OpenAI API key:', error.message);
    } else {
      console.error('Error checking for OpenAI API key:', error);
    }
  }
}


function main() {
  try {
    const args = process.argv.slice(2); // First two args are 'node' and the script name

    if (args.includes('--check-api-key')) {
      checkApiKey();
      return;
    }

    const repoPath = args.includes('--path') ? args[args.indexOf('--path') + 1] : '.';

    let apiKey = getApiKeyFromConfig();
    if (!apiKey) {
      console.log(
        'The OpenAI API key is not set. Please enter it below.\n' +
        'For instructions on obtaining an API key, please check the README.md file.\n'
      );

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Enter your OpenAI API key: ', (inputKey) => {
        try {
          if (!inputKey) {
            throw new Error("API key cannot be empty.");
          }
          saveApiKeyToConfig(inputKey);
          rl.close();
          apiKey = inputKey;
          proceedWithGitLogic(repoPath, apiKey);
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error:', error.message);
          } else {
            console.error('Error:', error);
          }
          rl.close();
        }
      });
    } else {
      proceedWithGitLogic(repoPath, apiKey);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error);
    }
  }
}


async function proceedWithGitLogic(repoPath: string, apiKey: string): Promise<void> {
  try {
    const diff = await getGitChanges(repoPath);
    if (diff) {
      const truncatedDiff = truncateDiff(diff);
      const commitMessage = await generateCommitMessage(truncatedDiff, apiKey);
      console.log(`${commitMessage}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('Error:', error);
    }
  }
}


// If running as a script
if (require.main === module) {
  main();
}
