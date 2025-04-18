import { getMarkdownContent } from '../../../../lib/markdown';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    const content = getMarkdownContent(filename);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Markdown file not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markdown content' },
      { status: 500 }
    );
  }
}
