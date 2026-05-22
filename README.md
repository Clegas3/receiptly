# Receiptly

Receiptly is a receipt scanning and expense tracking experience with two surfaces: a React web app and a React Native mobile app. Both apps share the same AI provider abstraction layer and design language.

## Structure

- `web` – React web app (Vite)
- `mobile` – React Native app (Expo)
- `packages/shared` – shared core logic, AI providers, and theme tokens

## Quick start

Install dependencies from the repo root:

```bash
npm install
```

Run the web app:

```bash
npm run dev:web
```

Run the mobile app:

```bash
npm run dev:mobile
```

## AI providers

Configure the provider, model, and API key in the Settings screen of each app. Credentials are stored locally (localStorage on web, AsyncStorage on mobile).

Receipt images are sent as base64 to the provider and the model is prompted to return raw JSON in this shape:

```json
{ "merchant": "", "date": "", "items": [{ "name": "", "price": 0 }], "subtotal": 0, "tax": 0, "total": 0, "category": "Food" }
```

Valid categories: Food, Travel, Transport, Office, Entertainment, Other.
