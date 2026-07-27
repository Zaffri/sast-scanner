import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.tsx'
import UploadList from './views/UploadList.tsx'
import UploadNew from './views/UploadNew.tsx'
import UploadView from './views/UploadView.tsx'
import './index.css'
import Login from './views/Login.tsx'
import Auth from './Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<UploadList />} />
          <Route path="/upload/new" element={<UploadNew />} />
          <Route path="/upload/:id" element={<UploadView />} />
        </Route>

        <Route path="/login" element={<Auth />}>
          <Route index element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
