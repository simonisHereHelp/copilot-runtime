// Import necessary modules
import express from "express";
import cors from "cors";
import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNodeHttpEndpoint } from "@copilotkit/runtime";
import OpenAI from "openai";
import { config } from "dotenv";
import { handleLangChainRequest } from './index-llm.js';

// Load environment variables from .env file
config();

// Initialize Express app
const app = express();
app.use(express.json()); // Parse JSON bodies

// Initialize OpenAI
const key = process.env.OPENAI_API_KEY;
if (!key) {
    console.error('ERROR: OPENAI_API_KEY is not set!');
    process.exit(1); // Exit if the API key is not set
}

const openai = new OpenAI({
    apiKey: key
});

// Enable CORS
app.use(cors({
    origin: (origin, callback) => {
        if (origin?.match(/^https:\/\/copilot.*\.vercel\.app$/) || origin?.match(/^https:\/\/docu.*\.vercel\.app$/) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,x-copilotkit-runtime-client-gql-version',
    credentials: true,
}));

// Add a simple route to respond with "hello!"
app.get("/", (req, res) => {
    res.send("hello!");
});

// Handle /copilotkit endpoint for CopilotKit functionality
app.use("/copilotkit", (req, res, next) => {
    if (req.method === "GET" && Object.keys(req.query).length === 0 && !req.body) {
        res.send("hello runtime!");
    } else {
        const serviceAdapter = new OpenAIAdapter({ openai });
        const runtime = new CopilotRuntime();
        const handler = copilotRuntimeNodeHttpEndpoint({
            endpoint: "/copilotkit",
            runtime,
            serviceAdapter,
        });

        return handler(req, res, next);
    }
});

// Add route to handle LLM queries
app.post('/openai', async (req, res) => {
    const messageContent = req.body.message;
    if (!messageContent) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        console.log('Message Content:', messageContent);
        const responseText = await handleLangChainRequest(messageContent);
        console.log('Response:', responseText);
        res.json({ text: responseText });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/copilotkit`);
    console.log(`Listening at http://localhost:${PORT}/openai`);
});
