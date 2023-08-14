import {
  getApiKeyFromConfig,
  saveApiKeyToConfig
} from '../../src/config/config-handler'
import * as fs from 'fs'

// Mocking the fs module
jest.mock('fs')

describe('getApitKeyFromConfig', () => {
  beforeEach(() => {
    // Suppress console.error for all tests in this describe
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should return null if the config file does not exist', () => {
    // We mock the fs.existsSync function to return false
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    // We expect the function to return null
    expect(getApiKeyFromConfig()).toBeNull()
  })

  test('should return null if the config file exists but is empty', () => {
    // We mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // We mock the fs.readFileSync function to return an empty string
    jest.spyOn(fs, 'readFileSync').mockReturnValue('')

    // We expect the function to return null
    expect(getApiKeyFromConfig()).toBeNull()
  })

  test('should return null if the config file exists but is not valid JSON', () => {
    // We mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // We mock the fs.readFileSync function to return an invalid JSON string
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"OPENAI_API_KEY": "test"')

    // We expect the function to return null
    expect(getApiKeyFromConfig()).toBeNull()
  })

  test('should return the API key if the config file exists and is valid JSON', () => {
    // We mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // We mock the fs.readFileSync function to return a valid JSON string
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"OPENAI_API_KEY": "test"}')

    // We expect the function to return the API key
    expect(getApiKeyFromConfig()).toBe('test')
  })

  test('should log an error if the config file exists but cannot be read', () => {
    // We mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // We mock the fs.readFileSync function to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('test')
    })

    // We mock the console.error function
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    // We expect the function to return null
    expect(getApiKeyFromConfig()).toBeNull()

    // We expect the console.error function to have been called
    expect(consoleErrorMock).toHaveBeenCalledTimes(1)
  })

  test('should log an error if the config file exists but cannot be parsed', () => {
    // We mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // We mock the fs.readFileSync function to return an invalid JSON string
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"OPENAI_API_KEY": "test"')

    // We mock the console.error function
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    // We expect the function to return null
    expect(getApiKeyFromConfig()).toBeNull()

    // We expect the console.error function to have been called
    expect(consoleErrorMock).toHaveBeenCalledTimes(1)
  })

  test('should return null if the API key does not exist in the config file', () => {
    // We mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // We mock the fs.readFileSync function to return a valid JSON string
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{}')

    // We expect the function to return null
    expect(getApiKeyFromConfig()).toBeNull()
  })

  test('should log an error and return null if the reading or parsing fails', () => {
    // We mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // We mock the fs.readFileSync function to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('test')
    })

    // We mock the console.error function
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    // We expect the function to return null
    expect(getApiKeyFromConfig()).toBeNull()

    // We expect the console.error function to have been called
    expect(consoleErrorMock).toHaveBeenCalledTimes(1)
  })
})

describe('saveApiKeyToConfig', () => {
  beforeEach(() => {
    // Suppress console.error for all tests in this describe
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should successfully write the API key to the config file', () => {
    // Mock the writeFileSync method to avoid actual file operations
    const writeFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})

    const apiKey = 'testApiKey'
    saveApiKeyToConfig(apiKey)

    // Assert that writeFileSync was called with the correct arguments
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      '.gitlex_config.json',
      JSON.stringify({ OPENAI_API_KEY: apiKey })
    )
  })

  test('should log an error and throw if there is an issue writing to the config file', () => {
    const errorMessage = 'Test write file error'

    // Mock the writeFileSync method to throw an error
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error(errorMessage)
    })

    // Mock the console.error to assert that it was called
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})
    const apiKey = 'testApiKey'

    // We expect an error to be thrown when calling saveApiKeyToConfig
    expect(() => {
      saveApiKeyToConfig(apiKey)
    }).toThrowError(errorMessage)

    // We expect the console.error function to have been called
    expect(consoleErrorMock).toHaveBeenCalledTimes(1)
  })
})
