import { checkApiKey } from './index'
import { getApiKeyFromConfig } from './config/config-handler'

jest.mock('./config/config-handler', () => {
  return {
    getApiKeyFromConfig: jest.fn()
  }
})

describe('checkApiKey', () => {
  // Suppress console.error for all tests in this describe
  jest.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    jest.resetAllMocks()
    console.log = jest.fn()
    console.error = jest.fn()
  })

  it('should log a message if an API key is stored', () => {
    ;(getApiKeyFromConfig as jest.Mock).mockReturnValue('TEST_API_KEY')

    checkApiKey()

    expect(console.log).toHaveBeenCalledWith(
      'An OpenAI API key is stored in the .gitlex_config.json file.'
    )
    expect(console.error).not.toHaveBeenCalled()
  })

  test('should log a message if no API key is stored', () => {
    ;(getApiKeyFromConfig as jest.Mock).mockReturnValue(null)

    checkApiKey()

    expect(console.log).toHaveBeenCalledWith(
      'No OpenAI API key is stored in the config file.'
    )
    expect(console.error).not.toHaveBeenCalled()
  })

  test('should log an error if there is an exception', () => {
    const errorMessage = 'Some error'
    ;(getApiKeyFromConfig as jest.Mock).mockImplementation(() => {
      throw new Error(errorMessage)
    })

    checkApiKey()
    expect(console.error).toHaveBeenCalledWith(
      'Error checking for OpenAI API key:',
      errorMessage
    )
  })
})
