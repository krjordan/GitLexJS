"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommitMessage = void 0;
const openai_1 = require("openai");
function generateCommitMessage(diff, apiKey) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const configuration = new openai_1.Configuration({ apiKey });
        const openai = new openai_1.OpenAIApi(configuration);
        try {
            const completion = yield openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an assistant that suggests descriptive git commit messages based on provided code changes or descriptions. Your suggestions should be concise, relevant, and clearly convey the intent of the changes.'
                    },
                    {
                        role: 'user',
                        content: 'Suggest a commit message for the following changes:\n' + diff
                    }
                ],
                max_tokens: 50
            });
            // Check if there's a valid message in the response.
            if ((_c = (_b = (_a = completion.data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content) {
                return completion.data.choices[0].message.content;
            }
            else {
                throw new Error('OpenAI response does not contain a valid commit message.');
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error generating commit message:', error.message);
            }
            else {
                console.error('An unknown error occurred while generating the commit message.');
            }
            return ''; // Return an empty string as fallback.
        }
    });
}
exports.generateCommitMessage = generateCommitMessage;
