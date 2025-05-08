import React from 'react';
import { cn } from '@/lib/utils';

interface MarkdownDisplayProps {
  content: string;
  className?: string;
}

// Basic Markdown to HTML conversion. For a real app, use a library like 'marked' or 'react-markdown'.
const parseMarkdown = (markdown: string): React.ReactNode[] => {
  const lines = markdown.split('\n'); // Changed from '\\n' to '\n'
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeLines: string[] = [];
  let inList = false; // To handle consecutive list items

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`codeblock-${elements.length}`} className="bg-muted p-4 rounded-md overflow-x-auto my-4">
            <code className={`language-${codeBlockLang}`}>
              {codeLines.join('\n')} {/* Changed from '\\n' to '\n' */}
            </code>
          </pre>
        );
        inCodeBlock = false;
        codeLines = [];
        codeBlockLang = '';
      } else {
        if (inList) { // Close list if a code block starts
          elements.push(<ul key={`ul-end-${elements.length}`} className="list-disc pl-6 my-2">{elements.splice(elements.length - elements.filter(el => (el as React.ReactElement).type === 'li').length)}</ul>);
          inList = false;
        }
        inCodeBlock = true;
        codeBlockLang = line.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }
    
    // Close list if current line is not a list item
    if (inList && !line.match(/^(\s*)- |\* /)) {
        elements.push(<ul key={`ul-end-${elements.length}`} className="list-disc pl-6 my-2">{elements.splice(elements.length - elements.filter(el => (el as React.ReactElement).type === 'li').length)}</ul>);
        inList = false;
    }

    if (line.startsWith('# ')) {
      elements.push(<h1 key={i} className="text-3xl font-bold mt-6 mb-3 border-b pb-2">{line.substring(2)}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i} className="text-2xl font-semibold mt-5 mb-2 border-b pb-1">{line.substring(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={i} className="text-xl font-semibold mt-4 mb-1">{line.substring(4)}</h3>);
    } else if (line.match(/^(\s*)- |\* /)) { // Handles list items, including indented ones (though not nested rendering yet)
      if (!inList) {
        inList = true;
        // Placeholder for ul, will be filled later or wrapped around li elements
      }
      elements.push(<li key={i} className="ml-0">{line.replace(/^(\s*)- |\* /, '')}</li>); // Remove marker for now, ul will add it
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
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>')           // Italic
        .replace(/`(.*?)`/g, '<code class="bg-muted text-sm px-1 py-0.5 rounded">$1</code>'); // Inline code
      
      elements.push(<p key={i} className="my-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: processedLine }} />);
    }
  }

  // If file ends with open code block
  if (inCodeBlock && codeLines.length > 0) {
     elements.push(
        <pre key={`codeblock-${elements.length}`} className="bg-muted p-4 rounded-md overflow-x-auto my-4">
          <code className={`language-${codeBlockLang}`}>
            {codeLines.join('\n')} {/* Changed from '\\n' to '\n' */}
          </code>
        </pre>
      );
  }
  // Close any open list at the end of parsing
  if (inList) {
    const listItems = elements.splice(elements.length - elements.filter(el => (el as React.ReactElement).type === 'li').length);
    elements.push(<ul key={`ul-end-final-${elements.length}`} className="list-disc pl-6 my-2">{listItems}</ul>);
  }

  // Group consecutive li elements into ul
  const finalElements: React.ReactNode[] = [];
  let currentListItems: React.ReactNode[] = [];
  for (const el of elements) {
    if ((el as React.ReactElement).type === 'li') {
      currentListItems.push(el);
    } else {
      if (currentListItems.length > 0) {
        finalElements.push(<ul key={`ul-group-${finalElements.length}`} className="list-disc pl-6 my-3 space-y-1">{currentListItems}</ul>);
        currentListItems = [];
      }
      finalElements.push(el);
    }
  }
  if (currentListItems.length > 0) { // Add any remaining list items
    finalElements.push(<ul key={`ul-group-final-${finalElements.length}`} className="list-disc pl-6 my-3 space-y-1">{currentListItems}</ul>);
  }

  return finalElements;
};


export function MarkdownDisplay({ content, className }: MarkdownDisplayProps) {
  const htmlContent = parseMarkdown(content);

  return (
    <article className={cn("prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none dark:prose-invert", className)}>
      {htmlContent}
    </article>
  );
}
