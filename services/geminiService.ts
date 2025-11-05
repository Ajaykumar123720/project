import { GoogleGenAI, Type } from "@google/genai";
import { LessonTopic, QuizQuestion, DiscussionPost } from '../types';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY is not set in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async generateJson<T,>(prompt: string, schema: any): Promise<T> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });
      
      const jsonText = response.text.trim();
      return JSON.parse(jsonText) as T;
    } catch (error) {
      console.error("Error generating JSON content:", error);
      throw new Error("Failed to parse response from AI service.");
    }
  }

  async generateLessonTopics(): Promise<LessonTopic[]> {
    const prompt = 'Generate a list of 6 key topics about the Constitution of India, suitable for a general audience. For each topic, provide a short, one-sentence summary.';
    const schema = {
      type: Type.OBJECT,
      properties: {
        topics: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ['title', 'summary'],
          },
        },
      },
      required: ['topics'],
    };
    
    const result = await this.generateJson<{ topics: LessonTopic[] }>(prompt, schema);
    return result.topics;
  }

  async generateLessonContent(topic: string): Promise<string> {
    const prompt = `Provide a detailed yet easy-to-understand explanation of "${topic}" from the Indian Constitution. Use markdown for formatting, including headers, bold text, and bullet points to make it engaging for learners.`;
    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return md.render(response.text);
  }

  async generateQuizQuestions(count: number): Promise<QuizQuestion[]> {
    const prompt = `Create a quiz with ${count} multiple-choice questions about the Indian Constitution. Each question should have 4 options and one correct answer.`;
    const schema = {
      type: Type.OBJECT,
      properties: {
        questions: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
            },
            required: ['question', 'options', 'correctAnswer'],
          },
        },
      },
      required: ['questions'],
    };

    const result = await this.generateJson<{ questions: QuizQuestion[] }>(prompt, schema);
    return result.questions;
  }
  
  async generateDiscussionTopics(): Promise<DiscussionPost[]> {
    const prompt = `Generate 2 thought-provoking opening questions for a discussion forum about the Indian Constitution. Frame them as if posted by users named 'Ravi' and 'Meena'.`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            posts: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        author: { type: Type.STRING },
                        content: { type: Type.STRING },
                    },
                    required: ['author', 'content']
                }
            }
        },
        required: ['posts']
    };
    
    const result = await this.generateJson<{posts: DiscussionPost[]}>(prompt, schema);
    return result.posts;
  }

  async getAiResponse(thread: DiscussionPost[]): Promise<string> {
    const context = thread.map(p => `${p.author}: ${p.content}`).join('\n');
    const prompt = `You are an AI Assistant in a discussion forum about the Indian Constitution. Based on the following conversation, provide a relevant and insightful response to the last comment. Keep it concise and engaging.
    
    Conversation:
    ${context}
    
    Your response:`;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  }
}

export const geminiService = new GeminiService();
