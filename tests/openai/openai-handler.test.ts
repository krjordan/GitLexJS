import {
  generateCommitMessage,
  getAvailableModels
} from '../../src/openai/openai-handler'
import { OpenAIApi } from 'openai'

const mockModel = 'text-davinci-002'
jest.mock('openai', () => {
  return {
    Configuration: jest.fn(),
    OpenAIApi: jest.fn().mockImplementation(() => {
      return {
        createChatCompletion: jest.fn((params) => {
          expect(params.model).toBe(mockModel)
          return {
            data: {
              choices: [
                {
                  message: {
                    content: 'Added a new function to handle user input'
                  }
                }
              ]
            }
          }
        }),
        listModels: jest.fn(() => {
          return {
            data: {
              data: [{ id: 'model1' }, { id: 'model2' }, { id: 'model3' }]
            }
          }
        })
      }
    })
  }
})

let openaiMock: any
console.error = jest.fn()

beforeEach(() => {
  openaiMock = new OpenAIApi()

  jest.resetAllMocks()
})

describe('generateCommitMessage', () => {
  const mockDiff = 'Added a new function to handle user input'
  const mockApiKey = 'TEST_API_KEY'

  test('should throw an error when API response does not contain a valid commit message', async () => {
    openaiMock.createChatCompletion.mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: ''
            }
          }
        ]
      }
    })

    const mockModel = 'text-davinci-002'
    const result = await generateCommitMessage(mockDiff, mockApiKey, mockModel)
    expect(result).toBe('')
  })
})

describe('getAvailableModels', () => {
  const mockApiKey = 'TEST_API_KEY'
  let openaiMock: any
  console.error = jest.fn()

  beforeEach(() => {
    openaiMock = new OpenAIApi()
    openaiMock.listModels = jest.fn().mockResolvedValue({
      data: {
        data: [{ id: 'model1' }, { id: 'model2' }, { id: 'model3' }]
      }
    })

    jest.resetAllMocks()
  })

  test('should return an empty array when API call fails', async () => {
    openaiMock.listModels.mockRejectedValue(new Error('API call failed'))
    const result = await getAvailableModels(mockApiKey)
    expect(result).toEqual([])
  })
})
