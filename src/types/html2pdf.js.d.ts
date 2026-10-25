declare module 'html2pdf.js' {
  interface Html2PdfDocument {
    internal: {
      pageSize: {
        getWidth(): number;
        getHeight(): number;
      };
      getNumberOfPages(): number;
    };
    getNumberOfPages(): number;
    link(
      x: number,
      y: number,
      width: number,
      height: number,
      options: PdfLinkOptions
    ): void;
    setPage(page: number): Html2PdfDocument;
    setFontSize(size: number): Html2PdfDocument;
    setTextColor(
      red: number,
      green: number,
      blue: number
    ): Html2PdfDocument;
    getTextWidth(text: string): number;
    text(text: string, x: number, y: number): Html2PdfDocument;
  }

  interface Html2PdfOptions {
    enableLinks?: boolean;
    margin?: number | number[];
    filename?: string;
    image?: {
      type?: string;
      quality?: number;
    };
    html2canvas?: Record<string, unknown>;
    jsPDF?: {
      unit?: string;
      format?: string;
      orientation?: 'portrait' | 'landscape';
    };
    pagebreak?: {
      mode?: string[];
    };
  }

  interface PdfLinkOptions {
    url?: string;
    pageNumber?: number;
    top?: number;
  }

  interface Html2PdfWorker {
    from(element: HTMLElement | string): Html2PdfWorker;
    set(options: Html2PdfOptions): Html2PdfWorker;
    toPdf(): Html2PdfWorker;
    toImg(): Html2PdfWorker;
    toCanvas(): Html2PdfWorker;
    toContainer(): Html2PdfWorker;
    get(name: 'pdf'): Html2PdfWorker;
    get(name: 'container'): Html2PdfWorker;
    then(callback: (pdf: Html2PdfDocument) => void): Html2PdfWorker;
    then(callback: (container: HTMLElement) => void): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    output(type: string, options?: Record<string, unknown>): unknown;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Html2PdfWorker;

  export default html2pdf;
}
