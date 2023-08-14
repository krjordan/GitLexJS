import * as fs from 'fs'
import path from 'path'

const CONFIG_FILE = '.gitlex_config.json'
const CONFIG_PATH = path.join(process.cwd(), CONFIG_FILE)

export function getApiKeyFromConfig(): string | null {
  try {
    // Check if the config file exists
    if (fs.existsSync(CONFIG_FILE)) {
      // Try to read the config file
      const content = fs.readFileSync(CONFIG_FILE, 'utf8')

      // Parse the content of the file
      const config = JSON.parse(content)

      // Return the API key or null if it doesn't exist
      return config.OPENAI_API_KEY || null
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error reading or parsing the config file ${CONFIG_FILE}:`,
        error.message
      )
    } else {
      // If it's not an instance of Error, we log it as-is (might be beneficial in rare cases)
      console.error(
        `Error reading or parsing the config file ${CONFIG_FILE}:`,
        error
      )
    }
  }

  return null
}

export function saveApiKeyToConfig(apiKey: string): void {
  try {
    // Convert the API key to a JSON string
    const jsonString = JSON.stringify({ OPENAI_API_KEY: apiKey })

    // Attempt to write the JSON string to the config file
    fs.writeFileSync(CONFIG_FILE, jsonString)
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error writing the API key to the config file ${CONFIG_FILE}:`,
        error.message
      )
    } else {
      // If it's not an instance of Error, we log it as-is (might be beneficial in rare cases)
      console.error(
        `Error writing the API key to the config file ${CONFIG_FILE}:`,
        error
      )
    }
    throw error
  }
}

export function deleteApiKeyFromConfig(): void {
  // Check if the config file exists
  if (!fs.existsSync(CONFIG_FILE)) {
    console.error('Config file does not exist.')
    return
  }

  // Read the file
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'))

  // Check and delete the apiKey property
  if (config.OPENAI_API_KEY) {
    delete config.OPENAI_API_KEY
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2))
    console.log('API key removed from config file.')
  } else {
    console.log('No API key found in config file.')
  }
}
