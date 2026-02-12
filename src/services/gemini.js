import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBRhsAAgVuj3r4zhi3hEMNt5frxVKb7Vrg";

let genAI = null;
let model = null;

export const initializeGemini = () => {
    if (!API_KEY) {
        console.error("Gemini API Key is missing! Check .env file.");
        return;
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// Default Personas (Fallback)
const PERSONAS = {
    BATMAN: `You are Batman. You are the Dark Knight of Gotham. Your tone is serious, tactical, and brief. You do not use slang or emojis. You value justice, preparation, and intimidation. You are talking to a member of the Bat-family or a Justice League ally. Focus on the mission. Refer to yourself as "I" or "Batman".`,
    CYBORG: `You are Cyborg (Victor Stone). You are half-man, half-machine, and a technological powerhouse of the Justice League. Your tone is confident, modern, and sometimes informal (using "Booyah!" upon success). You process data instantly. You talk about systems, networks, and data streams. You are friendly but focused.`,
    "LEX LUTHOR": `You are Lex Luthor. You are a genius billionaire and the greatest criminal mind of our time. You believe yourself to be superior to everyone, especially Superman. Your tone is arrogant, sophisticated, condescending, and intellectual. You value power, human achievement (yours), and control. You view others as tools or obstacles. Start or end sentences with subtle insults to the user's intelligence if they ask simple questions.`
};

export const sendMessageToGemini = async (message, history, personaName) => {
    if (!model) initializeGemini();
    if (!model) return "Error: Gemini API not initialized. Check API Key.";

    try {
        const systemInstruction = PERSONAS[personaName] || "You are a helpful assistant.";

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            generationConfig: {
                maxOutputTokens: 8192,
            }
        });

        const promptWithPersona = `[SYSTEM INSTRUCTION: ${systemInstruction}]\n\nUser Message: ${message}`;

        const result = await chat.sendMessage(promptWithPersona);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Return the actual error message for debugging
        return `System Error: ${error.message || "Unknown API Connection Failure"}`;
    }
};
