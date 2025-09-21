# vendartai
VendArt AI

AI-Powered Marketplace Assistant for Local Artisans

Overview

VendArt AI is a frontend prototype that demonstrates an AI-powered vending machine marketplace for local artisans.
It allows artists to upload their artworks, generate AI-enhanced descriptions, create QR codes, and display their work in a vending machine–style interface where buyers can discover, listen to the story, and purchase art.

This prototype is built using React, TypeScript, Tailwind, and Vite, with simulated AI processing for demonstration purposes.

Features

Artist Panel: Upload artwork and add a short story.

AI Enhancement: Generates descriptive story (simulated with mock AI).

Translations: Shows multilingual versions (English, Hindi, Telugu - demo).

QR Code Generator: Creates QR codes linked to artworks.

Vending Machine UI: Displays artworks in an interactive vending-style interface.

Buyer Interaction: Buyers can view, listen, and simulate purchase.

Frontend-Only Prototype: All AI and backend integrations are mocked.

Tech Stack

Frontend: React, TypeScript, Vite

Styling: TailwindCSS, custom CSS

Icons: Lucide React

QR Codes: qrcode.react

Hosting: Netlify

Project Structure
project/
│── src/
│   ├── components/        # React components (ArtisanPanel, VendingPanel, etc.)
│   ├── App.tsx            # Main App layout
│   ├── main.tsx           # Entry point
│   ├── index.css          # Global styles
│── package.json           # Dependencies & scripts
│── tsconfig.json          # TypeScript config
│── tailwind.config.js     # Tailwind setup
│── postcss.config.js      # PostCSS setup
│── index.html             # Root HTML file

Getting Started
1. Clone the Repository
git clone https://github.com/jhadekartik/vendartai.git
cd vendartai/project

2. Install Dependencies
npm install

3. Run Development Server
npm run dev



4. Build for Production
npm run build

5. Deploy to Netlify
netlify deploy --prod





Future Enhancements

Integrate Google Cloud Vertex AI for real AI-powered story generation.

Add Cloud Text-to-Speech for narration in multiple languages.

Use Google Cloud Storage and Firestore for storing artwork and metadata.

Hardware integration with IoT-enabled vending machines for physical art distribution.

Team

Team Name: Kundon

Presenter: Jhade Kartik
