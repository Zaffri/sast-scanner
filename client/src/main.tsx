import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import './index.css'
import App from './App.tsx'
import UploadList from './UploadList.tsx'
import UploadNew from './UploadNew.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<UploadList />} />
          <Route path="/upload" element={<UploadNew />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
