declare global {
  interface Window {
    Kakao: any;
    google: any;
    tinymce: any;
    gtag: (type: string, action: string, params?: Record<string, any>) => void;
    adsbygoogle?: Record<string, unknown>[];
  }
}

export {};
