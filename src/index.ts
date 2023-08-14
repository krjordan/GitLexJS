#!/usr/bin/env node
import chalk from 'chalk'
import inquirer from 'inquirer'

import {
  getApiKeyFromConfig,
  saveApiKeyToConfig,
  deleteApiKeyFromConfig,
  getModelFromConfig,
  saveModelToConfig
} from './config/config-handler'
import { getGitChanges, truncateDiff } from './git/git-handler'
import {
  generateCommitMessage,
  getAvailableModels
} from './openai/openai-handler'

async function main(): Promise<void> {
  console.log(chalk.blueBright('🚀 Welcome to Gitlex! 🚀'))

  const apiKeyExists = !!getApiKeyFromConfig()

  let models: string[] = []
  if (apiKeyExists) {
    const apiKey = getApiKeyFromConfig()
    if (apiKey) {
      models = await getAvailableModels(apiKey)
    }
  }

  const { action, model } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: 'Generate a commit message', value: 'generate' },
        !apiKeyExists && { name: 'Set API Key', value: 'set' },
        apiKeyExists && { name: 'Replace Api Key', value: 'replace' },
        apiKeyExists && { name: 'Delete my API Key', value: 'delete' },
        { name: 'Check if API key is set', value: 'check' },
        { name: 'Select OpenAI model', value: 'model' },
        { name: 'Exit', value: 'exit' }
      ].filter(Boolean)
    },
    {
      type: 'list',
      name: 'model',
      message: 'Select an OpenAI model:',
      choices: models,
      when: (answers) => answers.action === 'model'
    }
  ])

  switch (action) {
    case 'generate':
      await handleGenerateCommitMessage(model)
      break
    case 'set':
      await handleSetApiKey()
      break
    case 'replace':
      await handleReplaceApiKey()
      break
    case 'delete':
      deleteApiKeyFromConfig()
      console.log(chalk.green('API key deleted successfully!'))
      break
    case 'check':
      checkApiKey()
      break
    case 'model':
      saveModelToConfig(model)
      console.log(chalk.green(`Model set to ${model as string} successfully!`))
      break
    case 'exit':
      console.log(chalk.yellowBright('👋 Goodbye!'))
      break
  }
}

export function checkApiKey(): void {
  const apiKeyExists = !!getApiKeyFromConfig()
  if (apiKeyExists) {
    console.log(chalk.green('API Key is set.'))
  } else {
    console.log(chalk.red('API Key is not set.'))
  }
}

export async function handleSetApiKey(): Promise<void> {
  const { inputKey } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputKey',
      message: 'Enter your OpenAI API key:',
      validate: (value: any) =>
        value ? true : chalk.red('API key cannot be empty.')
    }
  ])

  if (inputKey) {
    saveApiKeyToConfig(inputKey)
    console.log(chalk.greenBright('API key saved to config file.'))
  } else {
    console.log(chalk.red('Failed to set the API key.'))
  }
}

export async function handleReplaceApiKey(): Promise<void> {
  const { inputKey } = await inquirer.prompt([
    {
      type: 'input',
      name: 'inputKey',
      message: 'Enter your new OpenAI API key:',
      validate: (value: any) =>
        value ? true : chalk.red('API key cannot be empty.')
    }
  ])

  if (inputKey) {
    saveApiKeyToConfig(inputKey)
    console.log(chalk.greenBright('API key replaced successfully.'))
  } else {
    console.log(chalk.red('Failed to replace the API key.'))
  }
}

async function handleGenerateCommitMessage(model: string): Promise<void> {
  const repoPath = '.'

  let apiKey = getApiKeyFromConfig()
  if (!apiKey) {
    const { inputKey } = await inquirer.prompt([
      {
        type: 'input',
        name: 'inputKey',
        message: chalk.yellow('Enter your OpenAI API key:'),
        validate: (value: string) => (value ? true : 'API key cannot be empty.')
      }
    ])

    if (inputKey) {
      saveApiKeyToConfig(inputKey)
      apiKey = inputKey
    }
  }

  if (apiKey) {
    await proceedWithGitLogic(repoPath, apiKey)
  } else {
    console.log(chalk.red('API Key was not provided. Exiting...'))
  }
}

async function proceedWithGitLogic(
  repoPath: string,
  apiKey: string
): Promise<void> {
  try {
    const diff = await getGitChanges(repoPath)
    if (diff) {
      const truncatedDiff = truncateDiff(diff)
      const model = getModelFromConfig()
      const commitMessage = model
        ? await generateCommitMessage(truncatedDiff, apiKey, model)
        : await generateCommitMessage(truncatedDiff, apiKey, 'text-davinci-002')
      console.log(
        chalk.greenBright(`Suggested Commit Message: ${commitMessage}`)
      )
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error)
  }
}

if (require.main === module) {
  void main()
}
