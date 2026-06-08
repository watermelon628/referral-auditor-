/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface MarkdownViewProps {
  content: string;
}

export function MarkdownView({ content }: MarkdownViewProps) {
  if (!content) return null;

  // Normalize newline characters: replace literal "\\n" with actual "\n" characters
  const normalizedContent = content
    .replace(/\\n/g, '\n')
    .replace(/\r\n/g, '\n');

  // Split content by lines and parse basic markdown features
  const lines = normalizedContent.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: { items: string[]; type: 'bullet' | 'ordered' } | null = null;
  let currentTable: { headers: string[]; rows: string[][] } | null = null;
  let inTableSeparator = false;

  const flushList = (key: string) => {
    if (currentList) {
      if (currentList.type === 'bullet') {
        renderedElements.push(
          <ul key={`ul-${key}`} className="list-disc pl-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        );
      } else {
        renderedElements.push(
          <ol key={`ol-${key}`} className="list-decimal pl-6 mb-4 space-y-1 text-gray-700 dark:text-gray-300">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushTable = (key: string) => {
    if (currentTable) {
      renderedElements.push(
        <div key={`table-wrapper-${key}`} className="overflow-x-auto my-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                {currentTable.headers.map((hdr, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 border-r border-gray-100 last:border-r-0 dark:border-gray-800"
                  >
                    {hdr.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-transparent">
              {currentTable.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-r border-gray-100 last:border-r-0 dark:border-gray-800 whitespace-normal"
                    >
                      {cell.trim()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Check for Markdown Table: starting/ending with | or having | in between
    const isTableRow = trimmedLine.startsWith('|') && trimmedLine.endsWith('|');
    if (isTableRow) {
      flushList(`table-flush-${i}`);
      // Parse the row parts
      const cells = trimmedLine
        .split('|')
        .slice(1, -1) // remove empty cells due to starting and ending pipelines
        .map((c) => c.replace(/\*\*/g, '').trim()); // remove simple bolding inside table cells if any

      // Detect separator line e.g. |---|---|
      const isSeparator = cells.every((cell) => cell.startsWith('-') || /^[:-]+$/.test(cell));
      if (isSeparator) {
        inTableSeparator = true;
        continue;
      }

      if (!currentTable) {
        currentTable = { headers: cells, rows: [] };
        inTableSeparator = false;
      } else {
        currentTable.rows.push(cells);
      }
      continue;
    } else {
      // If we were parsing a table and the line is not a table row, flush the table
      if (currentTable) {
        flushTable(`table-flush-${i}`);
      }
    }

    // Unordered lists
    if (trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ')) {
      const itemContent = trimmedLine.substring(2);
      if (!currentList) {
        currentList = { items: [itemContent], type: 'bullet' };
      } else if (currentList.type === 'bullet') {
        currentList.items.push(itemContent);
      } else {
        flushList(`list-switch-${i}`);
        currentList = { items: [itemContent], type: 'bullet' };
      }
      continue;
    }

    // Ordered lists
    const orderedMatch = trimmedLine.match(/^(\d+)\.\s(.*)/);
    if (orderedMatch) {
      const itemContent = orderedMatch[2];
      if (!currentList) {
        currentList = { items: [itemContent], type: 'ordered' };
      } else if (currentList.type === 'ordered') {
        currentList.items.push(itemContent);
      } else {
        flushList(`list-switch-${i}`);
        currentList = { items: [itemContent], type: 'ordered' };
      }
      continue;
    }

    // If we reach here, it's a typical text or title block; flush active lists
    if (currentList) {
      flushList(`list-end-${i}`);
    }

    // Empty lines
    if (trimmedLine === '') {
      renderedElements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Headers
    if (trimmedLine.startsWith('#')) {
      const level = trimmedLine.match(/^#+/)?.[0].length || 1;
      const text = trimmedLine.replace(/^#+\s*/, '');
      const cleanText = text.replace(/\*\*/g, '');

      if (level === 1) {
        renderedElements.push(<h1 key={i} className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3 border-b border-gray-100 pb-1">{cleanText}</h1>);
      } else if (level === 2) {
        renderedElements.push(<h2 key={i} className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-5 mb-2.5">{cleanText}</h2>);
      } else {
        renderedElements.push(<h3 key={i} className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">{cleanText}</h3>);
      }
      continue;
    }

    // Inline bolding converter (**bold text**)
    const parts = [];
    let currentText = trimmedLine;
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match;
    let lastIndex = 0;

    while ((match = boldRegex.exec(trimmedLine)) !== null) {
      // Add plain text before match
      if (match.index > lastIndex) {
        parts.push(trimmedLine.substring(lastIndex, match.index));
      }
      // Add bold text
      parts.push(
        <strong key={`bold-${match.index}`} className="font-semibold text-gray-900 dark:text-white">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < trimmedLine.length) {
      parts.push(trimmedLine.substring(lastIndex));
    }

    // Custom alerts highlighting for Red Flags & warnings
    const isWarning = trimmedLine.toLowerCase().includes('warning') || 
                      trimmedLine.toLowerCase().includes('red flag') ||
                      trimmedLine.toLowerCase().includes('immediately') ||
                      trimmedLine.toLowerCase().includes('danger');

    renderedElements.push(
      <p
        key={i}
        className={`leading-relaxed mb-3 text-sm text-gray-700 dark:text-gray-300 ${
          isWarning
            ? 'p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-950 dark:bg-red-950/20 dark:text-red-200'
            : ''
        }`}
      >
        {parts.length > 0 ? parts : trimmedLine}
      </p>
    );
  }

  // End of file flushes
  if (currentList) {
    flushList('eof-list');
  }
  if (currentTable) {
    flushTable('eof-table');
  }

  return <div className="prose max-w-none text-left tracking-normal space-y-1">{renderedElements}</div>;
}
