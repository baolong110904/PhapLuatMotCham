import axios from "axios";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function handleRequest(userInput: string): Promise<string> {
  try {
    const response = await axios.post(
      OPENROUTER_URL,
      {
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [{ role: "user", content: userInput }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );
    
    return response.data?.choices?.[0]?.message?.content ?? "No response";
  } catch (err: any) {
    console.error("API error:", err.response?.data || err.message);
    return `Error: ${err.response?.status ?? ""} ${
      err.response?.data?.error?.message ?? err.message
    }`;
  }
}
