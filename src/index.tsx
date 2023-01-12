import { createRoot } from 'react-dom/client';
import { App } from './App';

export const API_BASE_URL = "https://api.mcs-rbg.de/schicht_management/"

createRoot(document.getElementById('root')!).render(<App />)
createRoot(document.getElementById('title')!).render(process.env.REACT_APP_NAME)  
