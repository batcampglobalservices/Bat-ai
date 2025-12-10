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
  } catch (error: unknown) {
    // Log full error server-side for debugging
    console.error("Error generating image:", error);

    // Prefer a useful message from the upstream API when available so the
    // client can display a helpful error. Fall back to a generic message.
    const err = error as Record<string, unknown>;
    const message =
      (err?.data as Record<string, unknown>)?.error?.message ||
      (err?.responseBody && typeof err.responseBody === 'string' && (() => {
        try {
          const parsed = JSON.parse(err.responseBody);
          return parsed?.error?.message;
        } catch {
          return undefined;
        }
      })()) ||
      (err?.message as string) ||
      "Failed to generate image";

    const status = (err?.statusCode as number) || 500;

    return Response.json({ error: message }, { status });
  }
}