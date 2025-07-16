import React from 'react';
import ReactDOM from 'react-dom/client'; // ✅ use 'react-dom/client' instead of 'react-dom'
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container); // ✅ use createRoot API
root.render(<App />);

// Optional: use register() if you want offline support
serviceWorker.unregister();
