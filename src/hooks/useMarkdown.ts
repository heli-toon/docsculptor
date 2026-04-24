import { useState, useCallback } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import remarkToc from 'remark-toc';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import type { PdfSettings } from '../types';

export const useMarkdown = () => {
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processMarkdown = useCallback(async (content: string, type: 'markdown' | 'html', settings?: PdfSettings) => {
    setIsProcessing(true);
    
    try {
      if (type === 'html') {
        setProcessedHtml(content);
        return;
      }

      let markdownContent = content;
      if (settings?.includeTableOfContents) {
        const tocTitle = settings.tocTitle || 'Table of Contents';
        // Ensure there's a TOC heading for remark-toc to hook into
        if (!content.toLowerCase().includes(`## ${tocTitle.toLowerCase()}`)) {
          markdownContent = `## ${tocTitle}\n\n${content}`;
        }
      }

      const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkEmoji)
        .use(remarkMath)
        .use(remarkToc, { heading: settings?.tocTitle || 'Table of Contents', tight: true })
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeSlug)
        .use(rehypeKatex)
        .use(rehypeHighlight)
        .use(rehypeStringify, { allowDangerousHtml: true });

      const result = await processor.process(markdownContent);
      setProcessedHtml(String(result));
    } catch (error) {
      console.error('Error processing markdown:', error);
      setProcessedHtml('<p class="text-red-500">Error processing content</p>');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearProcessedHtml = useCallback(() => {
    setProcessedHtml('');
  }, []);

  return {
    processedHtml,
    isProcessing,
    processMarkdown,
    clearProcessedHtml
  };
};