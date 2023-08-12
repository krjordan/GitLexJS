"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveApiKeyToConfig = exports.getApiKeyFromConfig = void 0;
const fs = require("fs");
const CONFIG_FILE = '.gitlex_config.json';
function getApiKeyFromConfig() {
    try {
        // Check if the config file exists
        if (fs.existsSync(CONFIG_FILE)) {
            // Try to read the config file
            const content = fs.readFileSync(CONFIG_FILE, 'utf8');
            // Parse the content of the file
            const config = JSON.parse(content);
            // Return the API key or null if it doesn't exist
            return config.OPENAI_API_KEY || null;
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error reading or parsing the config file ${CONFIG_FILE}:`, error.message);
        }
        else {
            // If it's not an instance of Error, we log it as-is (might be beneficial in rare cases)
            console.error(`Error reading or parsing the config file ${CONFIG_FILE}:`, error);
        }
    }
    return null;
}
exports.getApiKeyFromConfig = getApiKeyFromConfig;
function saveApiKeyToConfig(apiKey) {
    try {
        // Convert the API key to a JSON string
        const jsonString = JSON.stringify({ OPENAI_API_KEY: apiKey });
        // Attempt to write the JSON string to the config file
        fs.writeFileSync(CONFIG_FILE, jsonString);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error writing the API key to the config file ${CONFIG_FILE}:`, error.message);
        }
        else {
            // If it's not an instance of Error, we log it as-is (might be beneficial in rare cases)
            console.error(`Error writing the API key to the config file ${CONFIG_FILE}:`, error);
        }
        throw error;
    }
}
exports.saveApiKeyToConfig = saveApiKeyToConfig;
