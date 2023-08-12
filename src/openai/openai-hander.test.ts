import { generateCommitMessage } from './openai-handler'
import { OpenAIApi } from 'openai'

jest.mock('openai', () => {
  return {
    Configuration: jest.fn(),
    OpenAIApi: jest.fn().mockImplementation(() => {
      return {
        createChatCompletion: jest.fn(() => {
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
        })
      }
    })
  }
})

describe('generateCommitMessage', () => {
  const mockDiff = 'Added a new function to handle user input'
  const mockApiKey = 'TEST_API_KEY'

  let openaiMock: any
  console.error = jest.fn()

  beforeEach(() => {
    openaiMock = new OpenAIApi()

    jest.resetAllMocks()
  })

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

    const result = await generateCommitMessage(mockDiff, mockApiKey)
    expect(result).toBe('')
  })
})
