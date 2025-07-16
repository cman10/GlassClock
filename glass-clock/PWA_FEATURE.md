# PWA (Progressive Web App) Features

This document outlines the PWA features implemented in the Glass Clock application.

## 1. Installability

The application can be installed on various devices, providing a native-like experience.

- **Desktop**: Users can install the app from the browser's address bar (e.g., using the install icon in Chrome).
- **Mobile**: On mobile devices, the app can be added to the home screen.

## 2. Offline Support

Thanks to the use of a service worker, the application is fully functional even without an internet connection. The service worker caches all necessary assets, ensuring a seamless offline experience.

## 3. Native App Experience

- **Standalone Window**: When launched, the app opens in a standalone window, without the browser's UI, providing a more immersive experience.
- **Custom Splash Screen**: A custom splash screen is displayed while the app is loading.
- **App Icon**: The application has a custom icon that appears on the home screen or desktop.

## 4. Service Worker

The service worker is responsible for:

- **Caching Strategy**: Implementing a cache-first strategy for all static assets.
- **Background Sync**: Enabling background data synchronization when the network is available.
- **Push Notifications**: (Future enhancement) Allowing for push notifications to be sent to the user. 