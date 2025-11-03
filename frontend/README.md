# SQRS Frontend

React-based dashboard for the Smart Queue Routing System.

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file (optional):
```bash
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## Before Running Frontend

Make sure the Flask API is running:

```bash
# From project root
python api/app.py
```

The API runs on `http://localhost:5000`

## Production Build

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

