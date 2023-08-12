#!/usr/bin/env node
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
const config_handler_1 = require("./config/config-handler");
const git_handler_1 = require("./git/git-handler");
const openai_handler_1 = require("./openai/openai-handler");
const readline = require("readline");
const CONFIG_FILE = '.gitlex_config.json';
function checkApiKey() {
    try {
        if ((0, config_handler_1.getApiKeyFromConfig)()) {
            console.log(`An OpenAI API key is stored in the ${CONFIG_FILE} file.`);
        }
        else {
            console.log('No OpenAI API key is stored in the config file.');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error checking for OpenAI API key:', error.message);
        }
        else {
            console.error('Error checking for OpenAI API key:', error);
        }
    }
}
function main() {
    try {
        const args = process.argv.slice(2); // First two args are 'node' and the script name
        if (args.includes('--check-api-key')) {
            checkApiKey();
            return;
        }
        const repoPath = args.includes('--path')
            ? args[args.indexOf('--path') + 1]
            : '.';
        let apiKey = (0, config_handler_1.getApiKeyFromConfig)();
        if (!apiKey) {
            console.log('The OpenAI API key is not set. Please enter it below.\n' +
                'For instructions on obtaining an API key, please check the README.md file.\n');
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Enter your OpenAI API key: ', (inputKey) => {
                try {
                    if (!inputKey) {
                        throw new Error('API key cannot be empty.');
                    }
                    (0, config_handler_1.saveApiKeyToConfig)(inputKey);
                    rl.close();
                    apiKey = inputKey;
                    void proceedWithGitLogic(repoPath, apiKey);
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.error('Error:', error.message);
                    }
                    else {
                        console.error('Error:', error);
                    }
                    rl.close();
                }
            });
        }
        else {
            void proceedWithGitLogic(repoPath, apiKey);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        }
        else {
            console.error('Error:', error);
        }
    }
}
function proceedWithGitLogic(repoPath, apiKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const diff = yield (0, git_handler_1.getGitChanges)(repoPath);
            if (diff) {
                const truncatedDiff = (0, git_handler_1.truncateDiff)(diff);
                const commitMessage = yield (0, openai_handler_1.generateCommitMessage)(truncatedDiff, apiKey);
                console.log(`${commitMessage}`);
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error:', error.message);
            }
            else {
                console.error('Error:', error);
            }
        }
    });
}
// If running as a script
if (require.main === module) {
    main();
}
