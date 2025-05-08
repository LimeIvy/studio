import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

// Basic Markdown to HTML conversion. For a real app, use a library like 'marked' or 'react-markdown'.
const parseMarkdown = (markdown: string): React.ReactNode[] => {
  const lines = markdown.split('\\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`codeblock-${elements.length}`} className="bg-muted p-4 rounded-md overflow-x-auto my-4">
            <code className={`language-${codeBlockLang}`}>
              {codeLines.join('\\n')}
            </code>
          </pre>
        );
        inCodeBlock = false;
        codeLines = [];
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    
    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl font-bold mt-6 mb-3 border-b pb-2">{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-semibold mt-5 mb-2 border-b pb-1">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold mt-4 mb-1">{line.substring(4)}</h3>);
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      // Simple list item, not handling nested lists here for simplicity
      elements.push(<li key={i} className="ml-6 list-disc">{line.substring(2)}</li>);
    } else if (line.match(/^\[.+\]\(.+\)$/)) { // Basic link: [text](url)
        const match = line.match(/^\[(.+)\]\((.+)\)$/);
        if (match) {
            elements.push(<p key={i} className="my-2 leading-relaxed"><a href={match[2]} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{match[1]}</a></p>);
        }
    } else if (line.trim() === '---') {
        elements.push(<hr key={i} className="my-6" />);
    } else if (line.trim() === '') {
      // elements.push(<br key={i} />); // Could add empty paragraphs for spacing if desired
    }
    else {
      // Apply inline styling for bold, italic, inline code
      let processedLine = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.+?)\*/g, '<em>$1</em>')           // Italic
        .replace(/`(.+?)`/g, '<code class="bg-muted text-sm px-1 py-0.5 rounded">$1</code>'); // Inline code
      
      elements.push(<p key={i} className="my-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />);
    }
  }
  // If file ends with open code block
  if (inCodeBlock && codeLines.length > 0) {
     elements.push(
        <pre key={`codeblock-${elements.length}`} className="bg-muted p-4 rounded-md overflow-x-auto my-4">
          <code className={`language-${codeBlockLang}`}>
            {codeLines.join('\\n')}
          </code>
        </pre>
      );
  }


  return elements;
};


export function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  const htmlContent = parseMarkdown(content);

  return (
    <article className={cn("prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none", className)}>
      {htmlContent}
    </article>
  );
}
