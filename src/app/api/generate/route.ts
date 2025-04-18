import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { messages, markdownContent } = await request.json();

    if (!messages || !markdownContent) {
      return NextResponse.json(
        { error: 'Messages and markdown content are required' },
        { status: 400 }
      );
    }

    const apiMessages = [
      {
        role: 'system',
        content: `You are a helpful assistant that generates UI components based on documentation. 
        Use the following markdown documentation as context for generating code:
        
        ${markdownContent}
        
        When asked to generate a component, provide the code in a code block with the appropriate language tag.
        Focus on creating clean, functional code that follows best practices.`
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedContent = response.choices[0].message.content;

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
