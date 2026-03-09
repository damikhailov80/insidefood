# InsideFood

**InsideFood** is a mobile and web application that helps users understand what is inside the food they buy.

By scanning a product barcode or analyzing the ingredients list from a photo, the app evaluates food products based on customizable dietary preferences such as added sugar, allergens, and other nutritional criteria.

The goal of the project is to make food transparency simple and accessible.

---

## Features

### Barcode Scanning

Scan a product barcode to instantly retrieve product information from a global food database.

### Ingredient Analysis with AI

If the product is not found in the database, users can take a photo of the ingredient list.
The application uses AI-powered OCR and text analysis to extract and evaluate the ingredients.

### Dietary Presets

Users can configure personal dietary preferences, for example:

* Avoid added sugar
* Detect allergens
* Vegan / vegetarian filtering
* Low processed foods
* Custom ingredient blacklists

### Product Evaluation

The app analyzes ingredients and provides a simple result:

* ✅ Safe for your preferences
* ⚠️ Contains ingredients you may want to avoid
* ❌ Not recommended

### Local Product Database

The system allows building a local database of products that may not exist in global food datasets (for example many regional products).

---

## Tech Stack

Frontend (Web)

* Next.js
* React
* TypeScript

Mobile

* React Native (Expo)

Backend

* NestJS
* REST API

Database

* PostgreSQL
* Prisma ORM

AI / Image Processing

* OCR for ingredient recognition
* NLP for ingredient parsing

Infrastructure

* Turborepo (monorepo architecture)
* Docker
* GitHub

---

## Monorepo Structure

```
insidefood/
│
├── apps/
│   ├── web        # Next.js web app
│   ├── mobile     # React Native (Expo)
│   └── api        # NestJS backend
│
├── packages/
│   ├── ui         # shared UI components
│   ├── config     # shared configs
│   └── types      # shared types
│
└── README.md
```

---

## How It Works

1. User scans a barcode.
2. The system checks the global product database.
3. If the product exists → ingredients are analyzed.
4. If the product is missing → the user can upload a photo of the ingredient list.
5. OCR extracts the text.
6. NLP processes the ingredient list.
7. The system evaluates the product against the user's dietary preferences.

---

## Future Improvements

* Community-driven product database
* Product rating system
* Improved ingredient recognition
* Health scoring system
* Offline barcode scanning
* Browser extension for online grocery stores

---

## Motivation

Many food products contain ingredients that are difficult for consumers to understand.
InsideFood aims to simplify ingredient analysis and make healthier choices easier.

---

## Disclaimer

InsideFood is an educational project and does not provide medical advice.
Users with allergies or medical conditions should always verify ingredient information independently.

---

## License

MIT
