interface FirebaseConfig {
    apiKey: string | undefined;
    authDomain: string | undefined;
    projectId: string | undefined;
    storageBucket: string | undefined;
    messagingSenderId: string | undefined;
    appId: string | undefined;
    databaseURL: string | undefined;
  }

  interface IFormLogin {
    email: string
    password: string
  }

  export type {
    FirebaseConfig,
    IFormLogin,
    
  }  