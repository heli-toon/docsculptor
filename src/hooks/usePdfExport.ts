import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import type { PdfSettings } from '../types';

export const usePdfExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const exportToPdf = async (
    htmlContent: string,
    fileName: string,
    settings: PdfSettings
  ) => {
    setIsExporting(true);
    setExportProgress(0);

    try {
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
      const codeElements = element.querySelectorAll('code, pre');
      codeElements.forEach((code) => {
        (code as HTMLElement).style.fontFamily = settings.fonts.code;
        (code as HTMLElement).style.fontSize = `${settings.fontSize.code}px`;
      });

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
          scrollY: 0
        },
        jsPDF: { 
          unit: 'mm', 
          format: settings.pageFormat.toLowerCase(),
          orientation: settings.orientation
        }
      };

      setExportProgress(60);

      await html2pdf(element, options);
      
      setExportProgress(100);
      
      // Clean up
      element.remove();
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
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