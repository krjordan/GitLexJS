import {
  getApiKeyFromConfig,
  saveApiKeyToConfig,
  deleteApiKeyFromConfig,
  getModelFromConfig,
  saveModelToConfig,
  getConfig
} from '../../src/config/config-handler'
import * as fs from 'fs'

const CONFIG_PATH = '.gitlex_config.json'

// Mocking the fs module
jest.mock('fs')

describe('getApitKeyFromConfig', () => {
  beforeEach(() => {
    // Suppress console.error for all tests in this describe
    jest.spyOn(console, 'log').mockImplementation(() => {})
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
    jest.spyOn(console, 'log').mockImplementation(() => {})
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
    jest.spyOn(console, 'log').mockImplementation(() => {})
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

  test('should return false if there is an issue writing to the config file', () => {
    const errorMessage = 'Test write file error'

    // Mock the writeFileSync method to throw an error
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
      throw new Error(errorMessage)
    })

    const apiKey = 'testApiKey'

    // We expect the function to return false when there's an error
    expect(saveApiKeyToConfig(apiKey)).toBe(false)
  })
})

describe('getModelFromConfig', () => {
  test('should return the model from the config file if it exists', () => {
    // Mock the fs.existsSync and fs.readFileSync functions to simulate a config file with a model
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest
      .spyOn(fs, 'readFileSync')
      .mockReturnValue('{"model": "text-davinci-002"}')

    // We expect the function to return the model
    expect(getModelFromConfig()).toBe('text-davinci-002')
  })

  test('should return null if the model does not exist in the config file', () => {
    // Mock the fs.existsSync and fs.readFileSync functions to simulate a config file without a model
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{}')

    // We expect the function to return null
    expect(getModelFromConfig()).toBeNull()
  })
})

describe('saveModelToConfig', () => {
  beforeEach(() => {
    // Suppress console.error for all tests in this describe
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should successfully write the model to the config file', () => {
    // Mock the writeFileSync method to avoid actual file operations
    const writeFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})

    const model = 'text-davinci-002'
    saveModelToConfig(model)

    // Assert that writeFileSync was called with the correct arguments
    // Expect the pretty-printed JSON string
    expect(writeFileSyncMock).toHaveBeenCalledWith(
      '.gitlex_config.json',
      JSON.stringify({ model: model }, null, 2)
    )
  })
})

describe('deleteApiKeyFromConfig', () => {
  beforeEach(() => {
    // Suppress console.error for all tests in this describe
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })
  test('should delete the API key from the config file if it exists', () => {
    // Mock the fs.existsSync and fs.readFileSync functions to simulate a config file with an API key
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"OPENAI_API_KEY": "test"}')

    // Mock the fs.writeFileSync function to avoid actual file operations
    const writeFileSyncMock = jest
      .spyOn(fs, 'writeFileSync')
      .mockImplementation(() => {})

    deleteApiKeyFromConfig()

    // Assert that writeFileSync was called with the correct arguments
    expect(writeFileSyncMock).toHaveBeenCalledWith(CONFIG_PATH, '{}')
  })

  test('should log a message if the config file does not exist', () => {
    // Mock the fs.existsSync function to return false
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    // Mock the console.error function
    const consoleErrorMock = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {})

    deleteApiKeyFromConfig()

    // We expect the console.error function to have been called
    expect(consoleErrorMock).toHaveBeenCalledTimes(1)
  })

  test('should log a message if the API key does not exist in the config file', () => {
    // Mock the fs.existsSync and fs.readFileSync functions to simulate a config file without an API key
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{}')

    // Mock the console.log function
    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {})

    deleteApiKeyFromConfig()

    // We expect the console.log function to have been called
    expect(consoleLogMock).toHaveBeenCalledTimes(2)
  })
})

describe('getConfig', () => {
  beforeEach(() => {
    // Suppress console.error for all tests in this describe
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('should return an empty object if the config file does not exist', () => {
    // Mock the fs.existsSync function to return false
    jest.spyOn(fs, 'existsSync').mockReturnValue(false)

    // We expect the function to return an empty object
    expect(getConfig()).toEqual({})
  })

  test('should return an empty object if the config file exists but is not valid JSON', () => {
    // Mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // Mock the fs.readFileSync function to return an invalid JSON string
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"OPENAI_API_KEY": "test"')

    // We expect the function to return an empty object
    expect(getConfig()).toEqual({})
  })

  test('should return an empty object if the config file exists but cannot be read', () => {
    // Mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // Mock the fs.readFileSync function to throw an error
    jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('test')
    })

    // We expect the function to return an empty object
    expect(getConfig()).toEqual({})
  })

  test('should return the parsed config if the config file exists and is valid JSON', () => {
    // Mock the fs.existsSync function to return true
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    // Mock the fs.readFileSync function to return a valid JSON string
    jest.spyOn(fs, 'readFileSync').mockReturnValue('{"OPENAI_API_KEY": "test"}')

    // We expect the function to return the parsed config
    expect(getConfig()).toEqual({ OPENAI_API_KEY: 'test' })
  })
})
