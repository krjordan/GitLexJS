import axios, { AxiosError } from 'axios';

export async function generateCommitMessage(diff: string, apiKey: string): Promise<string> {
  try {
    const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
      prompt: `Suggest a commit message for the following changes:\n${diff}`,
      max_tokens: 50
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (response.data && response.data.choices && response.data.choices[0] && response.data.choices[0].text) {
      return response.data.choices[0].text.trim();
    } else {
      throw new Error("Unexpected response structure from OpenAI API.");
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.data === 'object' && axiosError.response.data !== null) {
        const errorMessage = (axiosError.response.data as any).error || axiosError.message;
        throw new Error(`OpenAI API Error: ${errorMessage}`);
      }
    }
    if (error instanceof Error) {
      throw new Error(`OpenAI API Error: ${error.message}`);
    }
    throw new Error(`OpenAI API Error: ${error}`);
  }
}
