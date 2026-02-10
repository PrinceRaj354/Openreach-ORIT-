# OpenReach CloudAI Leaders Connect - Frontend

React + TypeScript + Vite frontend application.

## Setup

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Environment Configuration

Configure API endpoints in `.env`:

```
VITE_ORDER_SERVICE_URL=http://localhost:8000
COMPANY_API_URL=https://company-crv-service.vercel.app
```

## Project Structure

```
frontend/
├── components/          # Reusable UI components
├── pages/              # Page components
├── App.tsx             # Main app component
├── AppContext.tsx      # Global state management
├── constants.tsx       # App constants
├── types.ts            # TypeScript types
├── mockData.ts         # Mock data for development
├── orderState.ts       # Order state management
├── workflow.ts         # Workflow logic
└── index.tsx           # Entry point
```
