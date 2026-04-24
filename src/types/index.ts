export interface MarkdownFile {
    name: string;
    content: string;
    type: 'markdown' | 'html';
    size: number;
    lastModified: number;
}
  
export interface PdfSettings {
    pageFormat: 'A4' | 'Letter' | 'Legal';
    orientation: 'portrait' | 'landscape';
    exportMode: 'image' | 'text';
    margins: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
    fontSize: {
      body: number;
      headings: number;
      code: number;
    };
    fonts: {
      body: string;
      headings: string;
      code: string;
    };
    includeTableOfContents: boolean;
    tocTitle?: string;
    includeCoverPage: boolean;
    includePageNumbers: boolean;
    pageNumberStyle?: 'simple' | 'total' | 'accent';
    pageNumberPosition?: 'bottom-right' | 'bottom-center' | 'top-right';
    headerText: string;
    footerText: string;
}
  
export interface AppTheme {
    mode: 'light' | 'dark';
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
    };
}
  
export interface ProcessingState {
    isProcessing: boolean;
    progress: number;
    stage: string;
}