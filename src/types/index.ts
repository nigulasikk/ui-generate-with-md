export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface MarkdownContext {
  filename: string;
  content: string;
}

export interface CodeBlock {
  language: string;
  code: string;
}

export interface ChatState {
  messages: Message[];
  selectedMarkdown: string | null;
  isLoading: boolean;
}
