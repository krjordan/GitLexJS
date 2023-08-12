import { Configuration, OpenAIApi } from 'openai'

export async function generateCommitMessage(diff: string, apiKey: string): Promise<string> {
  const configuration = new Configuration({ apiKey });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          "role": "system",
          "content": "You are an assistant that suggests descriptive git commit messages based on provided code changes or descriptions. Your suggestions should be concise, relevant, and clearly convey the intent of the changes."
        },
        {
          "role": "user",
          "content": "Suggest a commit message for the following changes:\n" + diff
        }
      ],
      max_tokens: 50,
    });

    // Check if there's a valid message in the response.
    if (completion.data.choices && completion.data.choices[0] && completion.data.choices[0].message?.content) {
      return completion.data.choices[0].message.content;
    } else {
      throw new Error("OpenAI response does not contain a valid commit message.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error generating commit message:", error.message);
    } else {
      console.error("An unknown error occurred while generating the commit message.");
    }
    return ''; // Return an empty string as fallback.
  }
}
