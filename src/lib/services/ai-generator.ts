import OpenAI from "openai";
import { db } from "@/lib/db";

const groqApiKey = process.env.GROQ_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY;

// Use Groq by default since it is fast and has versatile Llama 3 models
// Fallback to OpenAI if Groq isn't available
const aiClient = groqApiKey
  ? new OpenAI({ apiKey: groqApiKey, baseURL: "https://api.groq.com/openai/v1" })
  : openaiApiKey
  ? new OpenAI({ apiKey: openaiApiKey })
  : null;

const model = groqApiKey ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

async function generateJSON(prompt: string): Promise<any> {
  if (!aiClient) {
    throw new Error("No AI API keys configured (set GROQ_API_KEY or OPENAI_API_KEY).");
  }

  const response = await aiClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: "You are an expert Islamic Finance AI assistant. Always output purely valid JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("AI returned empty response");

  try {
    return JSON.parse(content);
  } catch (e) {
    // Attempt to extract JSON from markdown if necessary
    const match = content.match(/```json\s*([\s\S]*?)\s*```/);
    if (match) return JSON.parse(match[1]);
    throw e;
  }
}

export async function generateScholars() {
  const prompt = `Generate a JSON object containing an array named "scholars" with exactly 3 prominent, real-world Islamic Finance scholars (e.g., Mufti Taqi Usmani, Sheikh Nizam Yaquby, Dr. Monzer Kahf).
Each scholar object must have:
- name (string)
- title (string, e.g. "Chairman of AAOIFI Shariah Board")
- bio (string, detailed biography of their contributions to Islamic finance)
- methodology (string, e.g. "AAOIFI", "OIC Fiqh Academy")
- publications (string, 1-2 major books or papers)
- rating (number, 4.8 to 5.0)

Example response format:
{
  "scholars": [
    {
      "name": "Mufti Muhammad Taqi Usmani",
      "title": "...",
      "bio": "...",
      "methodology": "AAOIFI",
      "publications": "...",
      "rating": 5.0
    }
  ]
}`;

  const data = await generateJSON(prompt);
  if (!data.scholars || !Array.isArray(data.scholars)) throw new Error("Invalid format from AI");

  const results = [];
  for (const scholar of data.scholars) {
    const existing = await db.scholar.findFirst({ where: { name: scholar.name } });
    if (!existing) {
      const created = await db.scholar.create({
        data: {
          name: scholar.name,
          title: scholar.title,
          bio: scholar.bio,
          methodology: scholar.methodology,
          publications: scholar.publications,
          rating: scholar.rating,
        },
      });
      results.push(created);
    }
  }
  return results;
}

export async function generateFatwas() {
  const prompt = `Generate a JSON object containing an array named "fatwas" with exactly 4 realistic, verified Islamic Finance fatwas on modern topics (e.g., Cryptocurrency, Staking, Margin Trading, Sukuk Al-Ijara).
Each fatwa object must have:
- title (string)
- category (string, e.g. "Cryptocurrency", "Trading", "Sukuk")
- summary (string, short summary of the ruling)
- content (string, detailed explanation of the Fiqh reasoning, 2-3 paragraphs)
- scholarName (string, e.g. "Dr. Ali Al-Quradaghi", "Mufti Taqi Usmani")
- date (ISO date string, e.g. "2023-05-10T00:00:00.000Z")

Example response format:
{
  "fatwas": [
    {
      "title": "Ruling on Cryptocurrency Trading",
      "category": "Cryptocurrency",
      "summary": "...",
      "content": "...",
      "scholarName": "Dr. Ali Al-Quradaghi",
      "date": "2023-05-10T00:00:00.000Z"
    }
  ]
}`;

  const data = await generateJSON(prompt);
  if (!data.fatwas || !Array.isArray(data.fatwas)) throw new Error("Invalid format from AI");

  const results = [];
  for (const fatwa of data.fatwas) {
    const existing = await db.fatwa.findFirst({ where: { title: fatwa.title } });
    if (!existing) {
      const created = await db.fatwa.create({
        data: {
          title: fatwa.title,
          category: fatwa.category,
          summary: fatwa.summary,
          content: fatwa.content,
          scholarName: fatwa.scholarName,
          date: new Date(fatwa.date),
        },
      });
      results.push(created);
    }
  }
  return results;
}

export async function generateCourses() {
  const prompt = `Generate a JSON object containing an array named "courses" with exactly 1 complete learning course on Islamic Finance.
The course should be titled "Fundamentals of Islamic Finance".
The course object must have:
- title (string)
- description (string)
- category (string, e.g. "Basics")
- difficulty (string, "Beginner")
- duration (number, total minutes)
- lessons (array of exactly 3 lessons)

Each lesson object must have:
- title (string)
- content (string, detailed markdown content explaining the topic)
- sequenceOrder (number, 1, 2, 3)
- quizzes (array of exactly 1 quiz object)

Each quiz object must have:
- question (string)
- optionsJson (array of 4 string options)
- correctAnswerIndex (number, 0-3)

Example response format:
{
  "courses": [
    {
      "title": "Fundamentals of Islamic Finance",
      "description": "...",
      "category": "Basics",
      "difficulty": "Beginner",
      "duration": 120,
      "lessons": [
        {
          "title": "What is Riba?",
          "content": "...",
          "sequenceOrder": 1,
          "quizzes": [
            {
              "question": "What is the primary definition of Riba?",
              "optionsJson": ["Usury/Interest", "Charity", "Tax", "Profit"],
              "correctAnswerIndex": 0
            }
          ]
        }
      ]
    }
  ]
}`;

  const data = await generateJSON(prompt);
  if (!data.courses || !Array.isArray(data.courses)) throw new Error("Invalid format from AI");

  const results = [];
  for (const course of data.courses) {
    const existing = await db.learningCourse.findFirst({ where: { title: course.title } });
    if (!existing) {
      const created = await db.learningCourse.create({
        data: {
          title: course.title,
          description: course.description,
          category: course.category,
          difficulty: course.difficulty,
          duration: course.duration,
          lessons: {
            create: course.lessons.map((lesson: any) => ({
              title: lesson.title,
              content: lesson.content,
              sequenceOrder: lesson.sequenceOrder,
              quizzes: {
                create: lesson.quizzes.map((quiz: any) => ({
                  question: quiz.question,
                  optionsJson: JSON.stringify(quiz.optionsJson),
                  correctAnswerIndex: quiz.correctAnswerIndex,
                })),
              },
            })),
          },
        },
      });
      results.push(created);
    }
  }
  return results;
}
