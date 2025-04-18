import { NextResponse } from 'next/server';

const apiKey = process.env.openrouter_sk;
const apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

export async function POST(request: Request) {
  try {
    if (!apiKey) {
      console.error('API key is not set');
      return NextResponse.json(
        { error: 'API key is not configured' },
        { status: 500 }
      );
    }

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
        
        When asked to generate a component, provide the code in a code block with the appropriate language tag (jsx or tsx).
        Focus on creating clean, functional React code that follows best practices.
        Always include imports at the top of your code.
        Make sure the component is well-commented and easy to understand.
        If the user asks for a specific feature mentioned in the documentation, implement it according to the API described in the docs.`
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    console.log('Sending request to LLM API with context length:', markdownContent.length);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'UI Component Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API error:', errorData);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    const generatedContent = data.choices[0].message.content;
    console.log('Received response from LLM API');

    return NextResponse.json({ content: generatedContent });
  } catch (error) {
    console.error('Error generating code:', error);
    return NextResponse.json(
      { error: 'Failed to generate code' },
      { status: 500 }
    );
  }
}
