import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { AuthProvider } from './context/AuthContext'
import { ProgramProvider } from './context/ProgramContext'
import '../css/app.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ProgramProvider>
                    <App />
                </ProgramProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)