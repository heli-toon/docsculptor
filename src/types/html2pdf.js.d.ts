declare module 'html2pdf.js' {
  const html2pdf: (element: HTMLElement | string, options?: object) => Promise<void>;
  export default html2pdf;
}
