// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  supabaseUrl: 'https://zueatwlwfifukorzqter.supabase.co',
  supabaseKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1ZWF0d2x3ZmlmdWtvcnpxdGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNDU5MTgsImV4cCI6MjA2MzcyMTkxOH0.nqVYwLvrkWJdPRj35g2HgcNwpXjCoi6mTjuqL1C08nM',

  firebaseConfig: {
    apiKey: 'AIzaSyAjfrCFGnBYumfpq-OMf0Z2xaZfcUYJA5Q',
    authDomain: 'videocall-61b90.firebaseapp.com',
    projectId: 'videocall-61b90',
    storageBucket: 'videocall-61b90.firebasestorage.app',
    messagingSenderId: '619943688581',
    appId: '1:619943688581:web:a17fc569e45faad9d66cec',
    measurementId: 'G-3YYHN3GWBD',
  },

  ravish: 'https://ravishing-courtesy-production.up.railway.app/',
  user: {
    email: '',
    password: '',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
