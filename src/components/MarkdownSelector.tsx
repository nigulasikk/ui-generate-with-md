'use client';

import { useState, useEffect } from 'react';
import { getMarkdownFiles } from '../lib/markdown';

interface MarkdownSelectorProps {
  onSelect: (filename: string) => void;
  selectedMarkdown: string | null;
}

export default function MarkdownSelector({ onSelect, selectedMarkdown }: MarkdownSelectorProps) {
  const [markdownFiles, setMarkdownFiles] = useState<string[]>([]);

  useEffect(() => {
    async function loadMarkdownFiles() {
      try {
        const files = await fetch('/api/markdown/files')
          .then(res => res.json())
          .then(data => data.files);
        setMarkdownFiles(files);
      } catch (error) {
        console.error('Error loading markdown files:', error);
        setMarkdownFiles([]);
      }
    }

    loadMarkdownFiles();
  }, []);

  return (
    <div className="w-full mb-4">
      <label htmlFor="markdown-select" className="block text-sm font-medium mb-2">
        Select Markdown Document
      </label>
      <select
        id="markdown-select"
        className="w-full p-2 border border-gray-300 rounded-md bg-white"
        value={selectedMarkdown || ''}
        onChange={(e) => {
          console.log('Markdown selected:', e.target.value);
          onSelect(e.target.value);
        }}
      >
        <option value="" disabled>
          Select a markdown file
        </option>
        {markdownFiles.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>
    </div>
  );
}
