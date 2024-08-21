import express from "express";
import cors from "cors";
import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNodeHttpEndpoint } from "@copilotkit/runtime";
import OpenAI from "openai";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const key = process.env.OPENAI_API_KEY;
console.log('key:', key);

const app = express();
const openai = new OpenAI({
    apiKey: key
});

// Enable CORS
app.use(cors());

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

app.listen(4000, () => {
    console.log("Listening at http://localhost:4000/copilotkit");
  });
// Export the app for Vercel
export default app;
