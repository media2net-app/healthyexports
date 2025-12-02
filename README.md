# Healthy Exports - AI-gedreven distributeur zoeken

Een moderne Next.js applicatie voor bedrijven in de health industrie om distributeurs te vinden en te beheren wereldwijd.

## Over Healthy Exports

Healthy Exports ondersteunt bedrijven in de health industrie door:
- 🤖 **AI-profiel generatie**: Automatisch profielen maken op basis van klant data (product PPT of company PPT)
- 🔍 **Slimme distributeur zoek**: Vind tot 20 geschikte distributeurs per markt
- 📧 **Geautomatiseerde benadering**: Automatiseer het contact leggen met potentiële distributeurs
- 📊 **Relatiebeheer**: Beheer en onderhoud distributeur relaties efficiënt

## Features

- ✨ Modern en responsive design
- 🌙 Dark mode ondersteuning
- 🔒 Wachtwoord zichtbaarheid toggle
- 📱 Volledig responsive voor alle apparaten
- ⚡ Snelle en geoptimaliseerde performance
- 🎨 Gebouwd met Tailwind CSS
- 🏥 Health-industrie gerichte branding

## Getting Started

Installeer eerst de dependencies:

```bash
npm install
```

Run de development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in je browser om de login pagina te zien.

## Project Structuur

```
healtyexports/
├── app/
│   ├── globals.css      # Global styles met Tailwind
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Login pagina
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React 18** - UI library

## Aanpassingen

De applicatie kan eenvoudig worden uitgebreid:
- **API integratie**: Voeg echte authenticatie toe in `handleSubmit` functie
- **Dashboard**: Maak een dashboard voor het beheren van distributeurs
- **AI integratie**: Integreer AI services voor profiel generatie en distributeur zoeken
- **Upload functionaliteit**: Voeg mogelijkheid toe om product/company PPTs te uploaden
- **Distributeur database**: Bouw een database voor gevonden en beheerde distributeurs
- **Notificaties**: Voeg notificaties toe voor nieuwe matches en updates

