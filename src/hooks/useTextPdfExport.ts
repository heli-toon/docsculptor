import jsPDF from 'jspdf';
import type { PdfSettings } from '../types';
import { sanitizeHtml } from '../utils/sanitizeHtml';

export const useTextPdfExport = () => {
  const exportTextToPdf = async (
    htmlContent: string,
    fileName: string,
    settings: PdfSettings
  ) => {
    // Create a temporary element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = sanitizeHtml(htmlContent);
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    try {
      const pdf = new jsPDF({
        orientation: settings.orientation,
        unit: 'mm',
        format: {
          A4: 'a4',
          Letter: 'letter',
          Legal: 'legal'
        }[settings.pageFormat]
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = settings.margins.left;
      const maxWidth = pageWidth - settings.margins.left - settings.margins.right;
      
      let yPosition = settings.margins.top;
      const lineHeight = settings.fontSize.body * 0.35;
      const contentBottom = pageHeight - settings.margins.bottom;

      const checkPageBreak = (neededHeight: number) => {
        if (yPosition > settings.margins.top && yPosition + neededHeight > contentBottom) {
          pdf.addPage();
          yPosition = settings.margins.top;
        }
      };

      const renderLines = (
        lines: string[],
        x: number,
        lineSpacing: number,
        fontSize = settings.fontSize.body
      ) => {
        const renderedLineHeight = fontSize * 0.35 * lineSpacing;
        for (const line of lines) {
          checkPageBreak(renderedLineHeight);
          pdf.text(line, x, yPosition);
          yPosition += renderedLineHeight;
        }
      };

      // Clean text function
      const cleanText = (text: string, preserveSpacing = false): string => {
        let cleaned = text
          // Remove all emojis more aggressively - multiple passes
          .replace(/[\u{1F000}-\u{1F9FF}]/gu, '') // All emoji blocks
          .replace(/[\u{2600}-\u{27FF}]/gu, '') // Miscellaneous symbols
          .replace(/[\u{FE00}-\u{FE0F}]/gu, '') // Variation selectors
          .replace(/[\u{E000}-\u{F8FF}]/gu, '') // Private use area
          .replace(/[\u{1F900}-\u{1FAFF}]/gu, '') // Extended symbols and pictographs
          .replace(/[\u{2000}-\u{206F}]/gu, '') // General punctuation that might contain emoji modifiers
          // Remove specific problematic characters
          .replace(/[✨🎨💻🚀📱⚡🔥💡🎯📊🌟]/gu, '')
          .replace(/\uFE0F/gu, '')
          // Remove any remaining emoji-like characters
          .replace(/[\u{1F100}-\u{1F1FF}]/gu, '') // Enclosed alphanumeric supplement
          .replace(/[\u{1F200}-\u{1F2FF}]/gu, '') // Enclosed ideographic supplement
          .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Miscellaneous symbols and pictographs
          .replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
          .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and map symbols
          .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical symbols
          .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric shapes extended
          .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental arrows-C
          // Replace arrows and special characters
          .replace(/→/g, '->')
          .replace(/←/g, '<-')
          .replace(/↑/g, '^')
          .replace(/↓/g, 'v')
          .replace(/…/g, '...')
          // Replace smart quotes
          .replace(/[""]/g, '"')
          .replace(/['']/g, "'")
          // Remove zero-width characters
          .replace(/[\u{200B}-\u{200D}]/gu, '')
          .replace(/[\u{FEFF}]/gu, '');

        if (preserveSpacing) {
          // For code blocks, preserve spacing but still normalize line breaks
          cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        } else {
          // For regular text, normalize whitespace
          cleaned = cleaned
            .replace(/\s+/g, ' ')
            .replace(/^[^\w\s<>]+/, '') // Remove non-word, non-space chars at start (keep < >)
            .replace(/[^\w\s.!?;:,\-()<>]+$/, ''); // Remove non-word chars at end (keep punctuation and < >)
        }
        
        return cleaned.trim();
      };

      // Get clean text content while preserving HTML entities
      const getCleanTextContent = (element: Element, preserveSpacing = false): string => {
        // Create a temporary div to decode HTML entities properly
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = element.innerHTML;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        return cleanText(textContent, preserveSpacing);
      };

      type PdfPosition = {
        page: number;
        top: number;
      };

      type PendingPdfLink = {
        page: number;
        x: number;
        y: number;
        width: number;
        height: number;
        targetId: string;
      };

      const headingPositions = new Map<string, PdfPosition>();
      const pendingPdfLinks: PendingPdfLink[] = [];

      // Process inline elements within a container
      const processInlineText = (element: Element): void => {
        const fullText = getCleanTextContent(element, false);
        
        if (fullText.trim()) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(settings.fontSize.body);
          const lines = pdf.splitTextToSize(fullText, maxWidth);
          renderLines(lines, margin, 1.2, settings.fontSize.body);
        }
      };

      // Process elements with proper hierarchy
      const processNode = (node: Node): void => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const element = node as Element;
        const tagName = element.tagName.toLowerCase();

        // Skip if this element was already processed as part of a parent
        if (element.closest('pre') && tagName !== 'pre') return;
        
        // Skip KaTeX elements entirely - don't try to extract text from them
        if (element.classList.contains('katex') || 
            element.classList.contains('katex-display') ||
            element.classList.contains('katex-html') ||
            element.closest('.katex')) {
          return;
        }

        switch (tagName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6': {
            const level = parseInt(tagName[1]);
            const fontSize = Math.max(settings.fontSize.headings - (level - 1) * 3, settings.fontSize.body + 2);
            const text = getCleanTextContent(element, false);
            
            if (text.trim()) {
              yPosition += 5; // Reduced from 8
              pdf.setFont('helvetica', 'bold');
              pdf.setFontSize(fontSize);
              
              const lines = pdf.splitTextToSize(text, maxWidth);
              checkPageBreak(lines.length * fontSize * 0.35 * 1.3);
              const headingId = element.getAttribute('id');
              if (headingId) {
                headingPositions.set(headingId, {
                  page: pdf.getNumberOfPages(),
                  top: yPosition
                });
              }
              renderLines(lines, margin, 1.3, fontSize);
              yPosition += 4; // Reduced spacing after heading
            }
            break;
          }

          case 'p': {
            // Minimal spacing before paragraph, especially after headings
            yPosition += 1; // Reduced from 3
            processInlineText(element);
            yPosition += 2; // Reduced from 4
            break;
          }

          case 'pre': {
            const text = getCleanTextContent(element, true); // Preserve spacing for code
            
            if (text.trim()) {
              yPosition += 5; // Reduced from 8
              pdf.setFont('courier', 'normal');
              pdf.setFontSize(Math.max(settings.fontSize.code, 8));
              
              // Split by actual line breaks and process each line
              const lines = text.split('\n');
              for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                // Preserve empty lines in code blocks
                if (line.length === 0) {
                  checkPageBreak(lineHeight * 1.1);
                  yPosition += lineHeight * 1.1;
                } else {
                  // Handle long lines by wrapping them
                  const wrappedLines = pdf.splitTextToSize(line, maxWidth - 10);
                  renderLines(wrappedLines, margin + 5, 1.1, Math.max(settings.fontSize.code, 8));
                }
              }
              yPosition += 5; // Reduced from 8
            }
            break;
          }

          case 'hr': {
            checkPageBreak(10); // Reduced from 15
            yPosition += 6; // Reduced from 10
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPosition, pageWidth - settings.margins.right, yPosition);
            yPosition += 6; // Reduced from 10
            break;
          }

          case 'ul':
          case 'ol': {
            const renderList = (list: Element, depth = 0): void => {
              const isOrdered = list.tagName.toLowerCase() === 'ol';
              // Only process this list's immediate items. Descendant items belong to
              // nested lists and are rendered recursively below.
              const listItems = Array.from(list.children).filter(
                (child): child is HTMLLIElement => child.tagName.toLowerCase() === 'li'
              );
              let itemNumber = isOrdered ? Number(list.getAttribute('start') || 1) : 0;

              listItems.forEach((li) => {
                if (isOrdered && li.hasAttribute('value')) {
                  itemNumber = Number(li.getAttribute('value'));
                }

                // Exclude nested lists from the item's own text; their content is
                // rendered separately so it is neither flattened nor duplicated.
                const itemContent = li.cloneNode(true) as Element;
                itemContent.querySelectorAll('ul, ol').forEach(nestedList => nestedList.remove());
                const text = getCleanTextContent(itemContent, false);
                const bullet = isOrdered ? `${itemNumber}. ` : '• ';
                const listX = margin + 5 + (depth * 5);
                const availableWidth = pageWidth - settings.margins.right - listX;

                if (text.trim()) {
                  pdf.setFont('helvetica', 'normal');
                  pdf.setFontSize(settings.fontSize.body);

                  const bulletWidth = pdf.getTextWidth(bullet);
                  const lines = pdf.splitTextToSize(text, Math.max(10, availableWidth - bulletWidth));
                  if (lines.length > 0) {
                    const anchor = li.querySelector('a');
                    const href = anchor?.getAttribute('href');
                    if (href?.startsWith('#')) {
                      checkPageBreak(lineHeight * 1.2);
                      pendingPdfLinks.push({
                        page: pdf.getNumberOfPages(),
                        x: listX + bulletWidth,
                        y: yPosition - lineHeight * 1.2,
                        width: Math.min(pdf.getTextWidth(text), availableWidth - bulletWidth),
                        height: lineHeight * 1.2,
                        targetId: href.slice(1)
                      });
                    }
                    renderLines([bullet + lines[0]], listX, 1.2, settings.fontSize.body);
                    renderLines(lines.slice(1), listX + bulletWidth, 1.2, settings.fontSize.body);
                  }
                  yPosition += 1; // Reduced spacing
                }

                const nestedLists = Array.from(li.children).filter(child => {
                  const childTag = child.tagName.toLowerCase();
                  return childTag === 'ul' || childTag === 'ol';
                });
                nestedLists.forEach(nestedList => renderList(nestedList, depth + 1));

                if (isOrdered) itemNumber += 1;
              });
            };

            yPosition += 3; // Reduced from 5
            renderList(element);
            yPosition += 3; // Reduced from 5
            break;
          }

          case 'table': {
            yPosition += 5;
            
            // Get table data
            const rows: string[][] = [];
            const headerRows = element.querySelectorAll('thead tr');
            const bodyRows = element.querySelectorAll('tbody tr');
            
            // Process header rows
            headerRows.forEach(row => {
              const cells: string[] = [];
              row.querySelectorAll('th, td').forEach(cell => {
                cells.push(getCleanTextContent(cell, false));
              });
              if (cells.some(c => c.trim())) rows.push(cells);
            });
            
            // Process body rows
            bodyRows.forEach(row => {
              const cells: string[] = [];
              row.querySelectorAll('td').forEach(cell => {
                cells.push(getCleanTextContent(cell, false));
              });
              if (cells.some(c => c.trim())) rows.push(cells);
            });
            
            if (rows.length > 0) {
              const numCols = Math.max(...rows.map(r => r.length));
              const colWidth = (maxWidth - 10) / numCols;
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(settings.fontSize.body - 1);
              pdf.setLineWidth(0.2);
              
              rows.forEach((row, rowIndex) => {
                const isHeader = rowIndex === 0 && headerRows.length > 0;
                const startX = margin + 5;
                const cellLines = row.map((cell) => pdf.splitTextToSize(cell, colWidth - 4));
                const rowHeight = Math.max(
                  lineHeight * 2.5,
                  ...cellLines.map((lines) => lines.length * lineHeight * 1.1 + 4)
                );

                checkPageBreak(rowHeight);
                const startY = yPosition + rowHeight - 2;
                
                // Draw cell backgrounds for header
                if (isHeader) {
                  pdf.setFillColor(245, 245, 245); // Light gray for header
                  pdf.rect(startX, startY - rowHeight, maxWidth - 10, rowHeight, 'F');
                }
                
                // Draw cell borders and text
                row.forEach((_cell, colIndex) => {
                  const x = startX + (colIndex * colWidth);
                  const y = startY;
                  
                  // Draw cell border
                  pdf.setDrawColor(200, 200, 200);
                  pdf.rect(x, y - rowHeight, colWidth, rowHeight);
                  
                  // Draw text
                  if (isHeader) {
                    pdf.setFont('helvetica', 'bold');
                  } else {
                    pdf.setFont('helvetica', 'normal');
                  }
                  
                  const lines = cellLines[colIndex];
                  const textY = y - rowHeight + 2 + (rowHeight / 2) - ((lines.length * lineHeight * 1.1) / 2) + lineHeight;
                  pdf.text(lines, x + 2, textY);
                });
                
                yPosition += rowHeight;
              });
              
              yPosition += 5;
            }
            break;
          }

          case 'div': {
            // Handle KaTeX display math (block equations)
            if (element.classList.contains('math-display') || 
                element.querySelector('.katex-display')) {
              checkPageBreak(lineHeight * 3);
              yPosition += 3;
              
              pdf.setFont('helvetica', 'italic');
              pdf.setFontSize(settings.fontSize.body - 1);
              pdf.setTextColor(80, 80, 80);
              
              // Center the placeholder
              const placeholderText = '[Mathematical Equation - View in Image PDF mode]';
              const textWidth = pdf.getTextWidth(placeholderText);
              const centerX = (pageWidth - textWidth) / 2;
              
              pdf.text(placeholderText, centerX, yPosition);
              pdf.setTextColor(0, 0, 0);
              
              yPosition += lineHeight * 2;
              break;
            }
            
            // For other divs, process children
            for (const child of Array.from(element.childNodes)) {
              processNode(child);
            }
            break;
          }

          case 'span': {
            // Handle KaTeX inline math - skip it
            if (element.classList.contains('math') ||
                element.querySelector('.katex')) {
              // Don't render anything for inline math
              break;
            }
            
            // For other spans, process children
            for (const child of Array.from(element.childNodes)) {
              processNode(child);
            }
            break;
          }

          default: {
            for (const child of Array.from(element.childNodes)) {
              processNode(child);
            }
            break;
          }
        }
      };

      // Start processing from the root
      for (const child of Array.from(tempDiv.childNodes)) {
        processNode(child);
      }

      for (const link of pendingPdfLinks) {
        const target = headingPositions.get(link.targetId);
        if (!target) continue;

        pdf.setPage(link.page);
        pdf.link(link.x, link.y, link.width, link.height, {
          pageNumber: target.page,
          top: target.top
        });
      }

      // Add Page Numbers
      if (settings.includePageNumbers) {
        const totalPages = pdf.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          
          let pageText = '';
          if (settings.pageNumberStyle === 'total') {
            pageText = `${i} / ${totalPages}`;
          } else if (settings.pageNumberStyle === 'accent') {
            pageText = `— ${i} —`;
          } else {
            pageText = `${i}`;
          }
          
          const textWidth = pdf.getTextWidth(pageText);
          let x = pageWidth - settings.margins.right - textWidth;
          let y = pageHeight - (settings.margins.bottom / 2);
          
          if (settings.pageNumberPosition === 'bottom-center') {
            x = (pageWidth - textWidth) / 2;
          } else if (settings.pageNumberPosition === 'top-right') {
            x = pageWidth - settings.margins.right - textWidth;
            y = settings.margins.top / 2;
          }
          
          pdf.text(pageText, x, y);
        }
      }

      // Save the PDF
      pdf.save(`${fileName}.pdf`);

    } finally {
      // Clean up
      document.body.removeChild(tempDiv);
    }
  };

  return { exportTextToPdf };
};
