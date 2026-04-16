import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  const response = await client.responses.create({
    model: "gpt-5.4-mini",
    input: "Tell me a joke"
  });

  console.log(response.output[0].content[0].text);
}

test();
