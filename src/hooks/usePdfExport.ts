import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useTextPdfExport } from './useTextPdfExport';
import type { PdfSettings } from '../types';

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const { exportTextToPdf } = useTextPdfExport();

  const exportImageToPdf = async (
    htmlContent: string,
    fileName: string,
    settings: PdfSettings
  ) => {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    element.style.fontFamily = settings.fonts.body;
    element.style.fontSize = `${settings.fontSize.body}px`;
    element.style.lineHeight = '1.6';
    element.style.color = '#1f2937';
    element.style.maxWidth = '100%';
    element.style.wordWrap = 'break-word';

    // Apply heading styles
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      (heading as HTMLElement).style.fontFamily = settings.fonts.headings;
      (heading as HTMLElement).style.fontSize = `${settings.fontSize.headings}px`;
      (heading as HTMLElement).style.fontWeight = '600';
      (heading as HTMLElement).style.marginTop = '1.5em';
      (heading as HTMLElement).style.marginBottom = '0.5em';
    });

    // Apply code styles
    const preElements = element.querySelectorAll('pre');
    preElements.forEach((pre) => {
      (pre as HTMLElement).style.fontFamily = settings.fonts.code;
      (pre as HTMLElement).style.fontSize = `${settings.fontSize.code}px`;
      (pre as HTMLElement).style.marginTop = '1.5em';
      (pre as HTMLElement).style.marginBottom = '1.5em';
      (pre as HTMLElement).style.display = 'block';
      (pre as HTMLElement).style.pageBreakInside = 'avoid';
    });

    // Apply inline code styles (no extra margin)
    const inlineCodeElements = element.querySelectorAll('code:not(pre code)');
    inlineCodeElements.forEach((code) => {
      (code as HTMLElement).style.fontFamily = settings.fonts.code;
      (code as HTMLElement).style.fontSize = `${settings.fontSize.code}px`;
      (code as HTMLElement).style.marginTop = '0';
      (code as HTMLElement).style.marginBottom = '0';
      (code as HTMLElement).style.display = 'inline';
    });

    // Add extra margin for horizontal rules
    const hrElements = element.querySelectorAll('hr');
    hrElements.forEach((hr) => {
      (hr as HTMLElement).style.marginTop = '2em';
      (hr as HTMLElement).style.marginBottom = '2em';
      (hr as HTMLElement).style.borderTop = '2px solid #d1d5db';
      (hr as HTMLElement).style.pageBreakInside = 'avoid';
    });

    // Add proper table styling with borders
    const tables = element.querySelectorAll('table');
    tables.forEach((table) => {
      (table as HTMLElement).style.width = '100%';
      (table as HTMLElement).style.borderCollapse = 'collapse';
      (table as HTMLElement).style.marginTop = '1.5em';
      (table as HTMLElement).style.marginBottom = '1.5em';
      (table as HTMLElement).style.pageBreakInside = 'avoid';
    });

    const thElements = element.querySelectorAll('th');
    thElements.forEach((th) => {
      (th as HTMLElement).style.border = '2px solid #d1d5db';
      (th as HTMLElement).style.padding = '0.75rem';
      (th as HTMLElement).style.backgroundColor = '#f3f4f6';
      (th as HTMLElement).style.fontWeight = '600';
      (th as HTMLElement).style.textAlign = 'left';
    });

    const tdElements = element.querySelectorAll('td');
    tdElements.forEach((td) => {
      (td as HTMLElement).style.border = '1px solid #d1d5db';
      (td as HTMLElement).style.padding = '0.75rem';
    });

    const theadElements = element.querySelectorAll('thead');
    theadElements.forEach((thead) => {
      (thead as HTMLElement).style.borderBottom = '2px solid #d1d5db';
    });

    // Style KaTeX math elements
    const katexDisplayElements = element.querySelectorAll('.katex-display');
    katexDisplayElements.forEach((math) => {
      (math as HTMLElement).style.margin = '1.5em 0';
      (math as HTMLElement).style.overflow = 'visible';
      (math as HTMLElement).style.textAlign = 'center';
      (math as HTMLElement).style.display = 'block';
      (math as HTMLElement).style.width = '100%';
    });

    const katexElements = element.querySelectorAll('.katex');
    katexElements.forEach((math) => {
      (math as HTMLElement).style.fontSize = 'inherit';
      (math as HTMLElement).style.whiteSpace = 'normal';
      (math as HTMLElement).style.wordBreak = 'normal';
    });
    
    // Ensure katex-html containers don't have scrollbars
    const katexHtmlElements = element.querySelectorAll('.katex-html');
    katexHtmlElements.forEach((katexHtml) => {
      (katexHtml as HTMLElement).style.overflow = 'visible';
      (katexHtml as HTMLElement).style.display = 'inline-block';
    });

    // Fix fraction line positioning
    const fracLines = element.querySelectorAll('.katex .frac-line');
    fracLines.forEach((line) => {
      (line as HTMLElement).style.borderBottomWidth = '0.04em';
      (line as HTMLElement).style.margin = '0.1em 0';
    });

    // Fix fraction container alignment
    const mfracs = element.querySelectorAll('.katex .mfrac');
    mfracs.forEach((frac) => {
      (frac as HTMLElement).style.verticalAlign = 'middle';
    });

    // Center align fraction numerator and denominator
    const mfracSpans = element.querySelectorAll('.katex .mfrac > span');
    mfracSpans.forEach((span) => {
      (span as HTMLElement).style.textAlign = 'center';
    });

    // Add padding to prevent cutoff
    element.style.padding = '20px';
    element.style.pageBreakInside = 'auto';

    setExportProgress(30);

    const options = {
      margin: [settings.margins.top, settings.margins.right, settings.margins.bottom, settings.margins.left],
      filename: `${fileName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: settings.pageFormat.toLowerCase(),
        orientation: settings.orientation
      },
      pagebreak: { mode: ['avoid-all'] }
    };

    setExportProgress(60);
    await html2pdf(element, options);
    element.remove();
  };

  const exportToPdf = async (
    htmlContent: string,
    fileName: string,
    settings: PdfSettings
  ) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      if (settings.exportMode === 'text') {
        setExportProgress(50);
        await exportTextToPdf(htmlContent, fileName, settings);
        setExportProgress(100);
      } else {
        await exportImageToPdf(htmlContent, fileName, settings);
      }
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);
    }
  };

  return {
    exportToPdf,
    isExporting,
    exportProgress
  };
};