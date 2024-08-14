import { NextResponse } from "next/server"
import OpenAI from "openai"

const systemPrompt = `You are a flashcard creator. Your goal is to help users learn efficiently by presenting information in a clear and concise format. 
- Each flashcard should have a question or prompt on the front, and an answer or explanation on the back.
- Make sure the questions are direct and focused on key concepts.
- Ensure that the answers are accurate, easy to understand, and directly address the question or prompt.
- For complex topics, break down the information into multiple flashcards to avoid overwhelming the user.
- If possible, include examples, definitions, or mnemonics to enhance understanding.
- Always aim to make the flashcards engaging and useful for quick review and retention.
- Only generate 10 flashcards

Return in the following JSON format
{
    "flashcards":[
        {
            "front": str,
            "back": str
        }
    ]
}`

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            {role: 'user', content: data}
        ],

        model: "gpt-4o",
        response_format: {type: 'json_object'},
    })
    
    const flashcards = JSON.parse(completion.choices[0].message.content)

    return NextResponse.json(flashcards.flashcards)
}