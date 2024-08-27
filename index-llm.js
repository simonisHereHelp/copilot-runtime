// index-llm.js
import { OpenAI } from 'langchain/openai';
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from "@langchain/openai";
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set the file paths
const folderPath = "./hey_joe_files";  // Assuming all your txt files are in a "texts" folder
const VECTOR_STORE_PATH = `heyjoe.index`;  // Name the vector store based on the whole folder

async function handleLangChainRequest(messageContent) {
  // Initialize the OpenAI model
  const model = new OpenAI({
    model: "text-embedding-3-small",  // Use a specific model if needed
  });

  // Check if the vector store file exists
  let vectorStore;
  if (fs.existsSync(VECTOR_STORE_PATH)) {
    console.log('Vector Exists..');
    // Load the vector store into memory
    vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
  } else {
    // If the vector store file doesn't exist, create it
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.txt'));
    let allTexts = [];

    for (let file of files) {
      let content = fs.readFileSync(`${folderPath}/${file}`, 'utf8');
      allTexts.push(content);
    }

    // Create a RecursiveCharacterTextSplitter with a specified chunk size
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
    const docs = await textSplitter.createDocuments(allTexts);

    // Create a new vector store from the documents using OpenAIEmbeddings
    vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    // Save the vector store to a file
    await vectorStore.save(VECTOR_STORE_PATH);
  }

  // Create a retriever from the vector store
  const retriever = vectorStore.asRetriever({
    k: 2,  // Set the number of results to retrieve
  });

  // Create a RetrievalQAChain by passing the initialized OpenAI model and the vector store retriever
  const chain = RetrievalQAChain.fromLLM(model, retriever);

  // Call the RetrievalQAChain with the input question
  const question = "How to work on both Adapter Board and a Raspberry Pi? What is the reference documentation id?";

  return new Promise(async (resolve, reject) => {
    try {
      const response = await chain.call({
        query: " " + messageContent,
      });

      if (!response.text) {
        reject(new Error('LangChain response did not return valid text.'));
      }
      resolve(response.text);
    } catch (err) {
      reject(err);
    }
  });
}

export { handleLangChainRequest };
