import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: openai.imageModel("dall-e-3"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: { style: "vivid", quality: "hd" },
      },
    });

    return Response.json(image.base64);
  } catch (error: any) {
    // Log full error server-side for debugging
    console.error("Error generating image:", error);

    // Prefer a useful message from the upstream API when available so the
    // client can display a helpful error. Fall back to a generic message.
    const message =
      error?.data?.error?.message ||
      error?.responseBody && (() => {
        try {
          const parsed = JSON.parse(error.responseBody);
          return parsed?.error?.message;
        } catch {
          return undefined;
        }
      })() ||
      error?.message ||
      "Failed to generate image";

    const status = error?.statusCode || 500;

    return Response.json({ error: message }, { status });
  }
}