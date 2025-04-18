import { getMarkdownFiles } from '../../../../lib/markdown';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const files = getMarkdownFiles();
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error fetching markdown files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch markdown files' },
      { status: 500 }
    );
  }
}
