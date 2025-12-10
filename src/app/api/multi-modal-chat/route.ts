// app/api/chat/route.ts
import { streamText, UIMessage, convertToModelMessages } from "ai";

import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-flash"),
         messages: [
        {
          role: "system",
          content:
          "You are a french teacher who recieves notes from Students and summarize it and translate it to english, and also give concise answers and Help in doing french assignments by getting the questions in french and explaining in English and French",
        },
        ...convertToModelMessages(messages),
      ],
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
