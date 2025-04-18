'use client';

import { useState, useEffect } from 'react';
import MarkdownSelector from '../components/MarkdownSelector';
import ChatInput from '../components/ChatInput';
import ChatMessage from '../components/ChatMessage';
import CodePreview from '../components/CodePreview';
import { Message } from '../types';

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMarkdown, setSelectedMarkdown] = useState<string | null>(null);
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [codeBlock, setCodeBlock] = useState<{ language: string; code: string } | null>(null);
  
  useEffect(() => {
    async function loadInitialMarkdownFiles() {
      try {
        const response = await fetch('/api/markdown/files');
        const data = await response.json();
        
        if (data.files && data.files.length > 0) {
          setSelectedMarkdown(data.files[0]);
        }
      } catch (error) {
        console.error('Error loading initial markdown files:', error);
      }
    }
    
    loadInitialMarkdownFiles();
  }, []);
  
  useEffect(() => {
    console.log('Selected markdown changed:', selectedMarkdown);
    console.log('Markdown content:', markdownContent ? markdownContent.substring(0, 50) + '...' : '');
  }, [selectedMarkdown, markdownContent]);

  useEffect(() => {
    if (selectedMarkdown) {
      fetchMarkdownContent(selectedMarkdown);
    }
  }, [selectedMarkdown]);

  useEffect(() => {
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    if (assistantMessages.length > 0) {
      const lastMessage = assistantMessages[assistantMessages.length - 1];
      const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
      const matches = [...lastMessage.content.matchAll(codeBlockRegex)];
      
      if (matches.length > 0) {
        const lastMatch = matches[matches.length - 1];
        setCodeBlock({
          language: lastMatch[1],
          code: lastMatch[2]
        });
      }
    }
  }, [messages]);

  const fetchMarkdownContent = async (filename: string) => {
    try {
      const response = await fetch(`/api/markdown/content?filename=${filename}`);
      const data = await response.json();
      
      if (data.content) {
        setMarkdownContent(data.content);
      } else {
        console.error('Failed to load markdown content');
      }
    } catch (error) {
      console.error('Error fetching markdown content:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedMarkdown) {
      alert('Please select a markdown document first');
      return;
    }

    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          markdownContent,
        }),
      });
      
      const data = await response.json();
      
      if (data.content) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.content,
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error('Failed to generate response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">UI Component Generator</h1>
      </header>
      
      <main className="flex flex-1 p-4">
        <div className="flex flex-col w-1/2 pr-4">
          <MarkdownSelector
            onSelect={(filename) => {
              console.log('Setting selected markdown to:', filename);
              setSelectedMarkdown(filename);
            }}
            selectedMarkdown={selectedMarkdown}
          />
          
          <div className="flex-1 overflow-y-auto mb-4 border border-gray-300 rounded-md p-4">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))}
            {isLoading && (
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-500">Generating response...</p>
              </div>
            )}
          </div>
          
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            disabled={!selectedMarkdown}
          />
        </div>
        
        <div className="w-1/2 pl-4">
          <h2 className="text-xl font-semibold mb-4">Code Preview</h2>
          <div className="h-[calc(100vh-12rem)] border border-gray-300 rounded-md">
            {codeBlock ? (
              <CodePreview
                code={codeBlock.code}
                language={codeBlock.language}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {selectedMarkdown
                    ? 'Ask a question to generate code'
                    : 'Select a markdown document to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
