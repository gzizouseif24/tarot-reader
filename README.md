# 🌙 Celestial Tarot

A mystical tarot reading application built with React, TypeScript, and Vite. Seek guidance from the void with an interactive digital tarot deck featuring all 78 Rider-Waite cards.

## ✨ Features

- **Complete 78-Card Deck**: Full Rider-Waite tarot deck including 22 Major Arcana and 56 Minor Arcana cards
- **Interactive Card Drawing**: Shuffle and draw cards with smooth animations powered by Framer Motion
- **Intention-Based Readings**: Enter your question or intention before drawing cards
- **Card Orientations**: Support for upright and reversed card meanings
- **Responsive Design**: Beautiful, mystical UI styled with Tailwind CSS
- **Type-Safe**: Fully typed with TypeScript for robust development

## 🎴 Deck Structure

The application includes:
- 22 Major Arcana cards (The Fool through The World)
- 56 Minor Arcana cards across four suits:
  - Wands (Fire element)
  - Cups (Water element)
  - Swords (Air element)
  - Pentacles (Earth element)

Each card contains:
- Card name and number
- Arcana type and suit
- Keywords
- Upright and reversed meanings
- Associated imagery

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **Tailwind CSS** - Styling
- **ESLint** - Code linting

## 📁 Project Structure

```
src/
├── components/       # React components
│   ├── Card/        # Card display component
│   └── Deck/        # Deck visualization component
├── data/            # Tarot card data
│   ├── majorArcana.ts
│   ├── minorArcana.ts
│   ├── types.ts
│   └── index.ts
├── hooks/           # Custom React hooks
│   └── useDeck.ts   # Deck management logic
├── utils/           # Utility functions
├── App.tsx          # Main application component
└── main.tsx         # Application entry point
```

## 🎯 Usage

1. Enter your question or intention in the input field
2. Click "Shuffle" to shuffle the deck (optional)
3. Click "Reveal Destiny" to draw a card
4. View your card with its meaning and interpretation
5. Click "New Reading" to start over

## 🔮 Future Enhancements

Potential features for future development:
- Multiple spread types (Three-Card, Celtic Cross)
- Reading history and saved readings
- Custom card interpretations
- Dark/light theme toggle
- Card animation improvements

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Rider-Waite Tarot deck imagery and interpretations
- Built with modern web technologies for a seamless mystical experience
