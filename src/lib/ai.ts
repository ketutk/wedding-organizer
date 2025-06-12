import { Together } from "together-ai";
const { NEXT_PUBLIC_TOGETHER_API_KEY, NEXT_PUBLIC_TOGETHER_MODEL } = process.env;

const together = new Together({ apiKey: NEXT_PUBLIC_TOGETHER_API_KEY });

export const getAiResponse = async (prompt: string) => {
  try {
    const response = await together.chat.completions.create({
      model: "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    return response?.choices[0]?.message?.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return null;
  }
};

export const responseSentimentSummary = async (currentSummary: string, feedback: string) => {
  const prompt = `
  You are an AI assistant that helps summarize and analyze feedback sentiment. I will give you a summary and feedback, you need to do the following:
  1. Analyze the sentiment of the feedback. Answer with "positive", "negative", or "neutral".
  2. If the sentiment is "positive" or "negative", combine the necessary feedback to the summary.Remove any unnecessary information and exclude negative word.

  The data is as follows:
  Current Summary: ${currentSummary}
  Feedback: ${feedback}

  Give an answer in the following format (json) with no other text addition:
  {
  "sentiment": "positive/negative/neutral",
  "summary": "new summary"
  }
  `;

  return await getAiResponse(prompt);
};
