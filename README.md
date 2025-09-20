# WrestlerAPI

A comprehensive full-stack web application that aggregates and displays professional wrestling championship data from multiple promotions. The application scrapes championship information from various sources (primarily Wikipedia) and provides both an API and a modern web interface to explore wrestling history.

## 🏆 Features

- **Multi-Promotion Coverage**: Fetches championship data from WWE, AEW, TNA, ECW, WCW, NXT, and more
- **Smart Name Matching**: Handles wrestlers who competed under different gimmicks or ring names (e.g., "Stone Cold Steve Austin" vs "Steve Austin", "Mankind" vs "Mick Foley")
- **Data Aggregation**: Combines championship reigns across all promotions for comprehensive wrestler statistics
- **Modern Web Interface**: Interactive, sortable, and filterable data table with expandable details
- **RESTful API**: Clean API endpoints for accessing wrestling championship data
- **Real-time Data**: Fresh data fetched from live sources

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js** - REST API server
- **JSDOM** - HTML parsing for web scraping
- **node-fetch** - HTTP client for data fetching
- **CORS** - Cross-origin resource sharing support

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Query (TanStack)** - Server state management
- **React Data Table Component** - Interactive data tables
- **Framer Motion** - Smooth animations
- **Styled Components** - CSS-in-JS styling
- **Bootstrap** - UI component framework

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/trapperwetzel/WrestlerAPI.git
   cd WrestlerAPI
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend API server (port 5000) and frontend development server concurrently.

4. **Open your browser**
   - Frontend: http://localhost:5173 (or the port shown in terminal)
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
WrestlerAPI/
├── backend/                 # Express.js API server
│   ├── fetches/            # Data fetching modules
│   │   ├── fetchWWEChampions.js
│   │   ├── fetchAEWChampions.js
│   │   ├── mergeChampionsData.js
│   │   └── ...             # Other championship fetchers
│   ├── helpers/            # Utility functions
│   │   └── duplicates/     # Name matching and deduplication
│   ├── routes/             # API route handlers
│   ├── scripts/            # Data processing scripts
│   └── server.js           # Main server file
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Application entry point
│   └── index.html          # HTML template
└── package.json            # Root package with scripts
```

## 🔌 API Endpoints

### GET `/api/wrestlers`

Returns aggregated championship data for all wrestlers.

**Response Format:**
```json
[
  {
    "name": "John Cena",
    "totalReignsAll": 25,
    "totalDaysAll": 3942,
    "championships": [
      {
        "championshipName": "WWE Championship",
        "totalReigns": 13,
        "totalDaysHeld": 1254
      },
      {
        "championshipName": "World Heavyweight Championship",
        "totalReigns": 3,
        "totalDaysHeld": 280
      }
    ]
  }
]
```

## 🎯 Key Components

### Data Fetching System
The application uses modular fetchers for different championships:
- `fetchWWEChampions.js` - WWE Championship data
- `fetchUSChampions.js` - WWE United States Championship
- `fetchAEWChampions.js` - AEW World Championship
- And many more...

### Name Deduplication
The `wrestlerVariations.js` file maintains mappings of wrestler name variations:
```javascript
"Mick Foley": ["Mick Foley", "Mankind", "Cactus Jack", "Dude Love"]
"Steve Austin": ["Steve Austin", "Stone Cold Steve Austin", "Stunning Steve Austin"]
```

### Frontend Features
- **WrestlerTable Component**: Main data display with sorting and filtering
- **Expandable Rows**: Click to see detailed championship breakdown
- **Loading States**: Smooth loading animations
- **Responsive Design**: Works on desktop and mobile

## 🔄 Development Workflow

### Available Scripts

**Root Level:**
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server

**Backend:**
- `npm run start` - Start backend with nodemon (auto-reload)
- `npm run builddata` - Run data processing scripts
- `npm test` - Run backend tests

**Frontend:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

This project is in active development. Feel free to:
- Report bugs
- Suggest new features
- Add support for additional wrestling promotions
- Improve data accuracy and wrestler name matching

## 📝 License

ISC License

---

*This project aggregates publicly available wrestling championship data for educational and entertainment purposes.*