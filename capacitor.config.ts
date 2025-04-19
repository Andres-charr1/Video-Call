import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.company.video',
  appName: 'contact',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '619943688581-voeem1jlt8od4qm0fgj6t1l5aurjtcju.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  }
};

export default config;
