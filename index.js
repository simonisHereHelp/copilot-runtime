import express from "express";
import cors from "cors";
import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNodeHttpEndpoint } from "@copilotkit/runtime";
import OpenAI from "openai";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const key = process.env.OPENAI_API_KEY;
if (!key) {
    console.error('ERROR: OPENAI_API_KEY is not set!');
    process.exit(1); // Exit if the API key is not set
}

const app = express();
const openai = new OpenAI({
    apiKey: key
});

// Enable CORS
app.use(cors({
    origin: 'https://copilot-reactpage.vercel.app',  // Replace with your Vercel frontend URL
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization,x-copilotkit-runtime-client-gql-version',
    credentials: true,
}));
// Add a simple route to respond with "hello!"
app.get("/", (req, res) => {
    res.send("hello!");
});

// Handle /api-copilot-runtime endpoint
app.use("/copilotkit", (req, res, next) => {
    // Respond with "hello runtime!" if no specific query is provided
    if (req.method === "GET" && Object.keys(req.query).length === 0 && !req.body) {
        res.send("hello runtime!");
    } else {
        // Proceed with the CopilotRuntime functionality if there's other data
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Listening at http://localhost:${PORT}/copilotkit`);
});