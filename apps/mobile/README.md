# InsideFood Mobile App

Mobile application for InsideFood built with React Native and Expo.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI
- For iOS: macOS with Xcode
- For Android: Android Studio with emulator or physical device

## Installation

From the project root:

```bash
npm install
```

Or from the mobile app directory:

```bash
cd apps/mobile
npm install
```

## Running the App

### Start Development Server

```bash
npm run dev
```

Or:

```bash
npm start
```

### Run on Specific Platform

```bash
npm run ios       # iOS simulator
npm run android   # Android emulator
npm run web       # Web browser
```

### Using Expo Go

1. Install Expo Go on your device ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))
2. Run `npm start`
3. Scan the QR code with your device

## Project Structure

```
apps/mobile/
├── app/                    # File-based routing
│   ├── (tabs)/            # Tab navigation screens
│   ├── add-product/       # Add product flow
│   └── product/           # Product details
├── components/            # Reusable components
├── config/                # Configuration files
├── constants/             # App constants
└── assets/                # Images and static files
```

## Tech Stack

- React Native 0.81.5
- Expo ~54.0
- Expo Router for navigation
- React Native Paper for UI components
- Redux Toolkit for state management
- TypeScript

## Available Scripts

- `npm start` - Start Expo development server
- `npm run dev` - Alias for start
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Features

- Barcode scanning with camera
- Product search and details
- Add new products with photo recognition
- Scan history
- Material Design UI with React Native Paper

## Configuration

The app uses Expo Router for file-based routing and React Native Paper for UI components. Configuration can be found in:

- `app.json` - Expo configuration
- `package.json` - Dependencies and scripts

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Paper](https://reactnativepaper.com/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
