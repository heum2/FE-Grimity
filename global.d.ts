interface AppleIDSignInOnSuccess {
  authorization: {
    code: string;
    id_token: string;
    state?: string;
  };
  user?: {
    email: string;
    name: {
      firstName: string;
      lastName: string;
    };
  };
}

interface AppleIDSignInOnFailure {
  error: string;
}

interface AppleIDAuth {
  init: (config: {
    clientId: string;
    scope: string;
    redirectURI: string;
    usePopup?: boolean;
  }) => void;
  signIn: () => Promise<AppleIDSignInOnSuccess>;
}

declare global {
  interface Window {
    Kakao: any;
    google: any;
    tinymce: any;
    gtag: (type: string, action: string, params?: Record<string, any>) => void;
    adsbygoogle?: Record<string, unknown>[];
    AppleID: {
      auth: AppleIDAuth;
    };
  }
}

export {};
