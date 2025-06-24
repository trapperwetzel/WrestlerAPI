import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"

const queryClient = new QueryClient();
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <QueryClientProvider client={queryClient}>
    <StrictMode>
      <App />
    </StrictMode>
    </QueryClientProvider>
  );
} else {
  console.error("❌ No element with ID 'root' found in index.html.");
}
