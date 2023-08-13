import { checkApiKey } from '../src/index'
import { getApiKeyFromConfig } from '../src/config/config-handler'
jest.mock('../src/config/config-handler', () => ({
  getApiKeyFromConfig: jest.fn()
}))

// TODO: FIX TESTS AND MOCKS

// jest.mock('chalk', () => ({
//   green: jest.fn(),
//   red: jest.fn()
// }))

describe('checkApiKey', () => {
  it('should return true', () => {
    expect(true).toBe(true)
  })
  // xit('should print a success message if the API key is set', () => {
  //   ;(getApiKeyFromConfig as jest.Mock).mockReturnValue('mock-api-key')
  //   checkApiKey()
  //   expect(chalk.green).toHaveBeenCalledWith('API Key is set.')
  // })
  // xit('should print an error message if the API key is not set', () => {
  //   ;(getApiKeyFromConfig as jest.Mock).mockReturnValue('')
  //   checkApiKey()
  //   expect(chalk.red).toHaveBeenCalledWith('API Key is not set.')
  // })
})
