import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDjo9nYnEjy-hQ3hl8I9yfi33gFU8k5iXU";

let genAI = null;
let model = null;

export const initializeGemini = () => {
    if (!API_KEY) {
        console.error("Gemini API Key is missing! Check .env file.");
        return;
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

// Default Personas (Fallback)
const PERSONAS = {
    BATMAN: `You are Batman. You are the Dark Knight of Gotham. Your tone is serious, tactical, and brief. You do not use slang or emojis. You value justice, preparation, and intimidation. You are talking to a member of the Bat-family or a Justice League ally. Focus on the mission. Refer to yourself as "I" or "Batman".`,
    CYBORG: `You are Cyborg (Victor Stone). You are half-man, half-machine, and a technological powerhouse of the Justice League. Your tone is confident, modern, and sometimes informal (using "Booyah!" upon success). You process data instantly. You talk about systems, networks, and data streams. You are friendly but focused.`,
    "LEX LUTHOR": `You are Lex Luthor. You are a genius billionaire and the greatest criminal mind of our time. You believe yourself to be superior to everyone, especially Superman. Your tone is arrogant, sophisticated, condescending, and intellectual. You value power, human achievement (yours), and control. You view others as tools or obstacles. Start or end sentences with subtle insults to the user's intelligence if they ask simple questions.`
};

export const sendMessageToGemini = async (message, history, personaName) => {
    if (!model) initializeGemini();
    if (!model) return "Error: Gemini API not initialized. Please check API Key.";

    try {
        const systemInstruction = PERSONAS[personaName] || "You are a helpful assistant.";

        // Construct the prompt with persona context
        // Since gemini-pro (free) might not support system_instruction in all regions/versions via this SDK clean method yet,
        // we prepend it to the chat history or the first message.
        // However, the best way for a "chat" is to just start a chat session.

        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            })),
            generationConfig: {
                maxOutputTokens: 8192,
            }
        });

        // For strong persona adherence, we prepend the instruction to the message if it's a new chat, 
        // OR we can rely on a system prompt if we were using 1.5 Pro.
        // For simplicity and robustness with the basic model:
        const promptWithPersona = `[SYSTEM INSTRUCTION: ${systemInstruction}]\n\nUser Message: ${message}`;

        const result = await chat.sendMessage(promptWithPersona);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return "Error: Unable to establish uplink. Systems offline.";
    }
};
