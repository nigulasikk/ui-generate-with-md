import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const markdownDirectory = path.join(process.cwd(), 'public/markdown');

/**
 * Get all markdown files from the markdown directory
 */
export function getMarkdownFiles(): string[] {
  try {
    return fs.readdirSync(markdownDirectory)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
  } catch (error) {
    console.error('Error reading markdown directory:', error);
    return [];
  }
}

/**
 * Get the content of a markdown file
 */
export function getMarkdownContent(filename: string): string {
  try {
    const fullPath = path.join(markdownDirectory, `${filename}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { content } = matter(fileContents);
    return content;
  } catch (error) {
    console.error(`Error reading markdown file ${filename}:`, error);
    return '';
  }
}

/**
 * Get all markdown files with their content
 */
export function getAllMarkdownContent(): Record<string, string> {
  const files = getMarkdownFiles();
  const contents: Record<string, string> = {};
  
  for (const file of files) {
    contents[file] = getMarkdownContent(file);
  }
  
  return contents;
}
