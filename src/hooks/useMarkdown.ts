import { useState, useCallback } from 'react';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

export const useMarkdown = () => {
  const [processedHtml, setProcessedHtml] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processMarkdown = useCallback(async (content: string, type: 'markdown' | 'html') => {
    setIsProcessing(true);
    
    try {
      if (type === 'html') {
        setProcessedHtml(content);
        return;
      }

      const processor = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkEmoji)
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeKatex)
        .use(rehypeHighlight)
        .use(rehypeStringify, { allowDangerousHtml: true });

      const result = await processor.process(content);
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