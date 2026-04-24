declare module 'html2pdf.js' {
  interface Html2PdfWorker {
    from(element: HTMLElement | string): Html2PdfWorker;
    set(options: any): Html2PdfWorker;
    toPdf(): Html2PdfWorker;
    toImg(): Html2PdfWorker;
    toCanvas(): Html2PdfWorker;
    toContainer(): Html2PdfWorker;
    get(name: string): any;
    then(callback: (pdf: any) => void): Html2PdfWorker;
    save(filename?: string): Promise<void>;
    output(type: string, options?: any): any;
  }

  function html2pdf(): Html2PdfWorker;
  function html2pdf(element: HTMLElement | string, options?: any): Html2PdfWorker;

  export default html2pdf;
}
