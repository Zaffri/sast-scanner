import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import App from './App.tsx'
import ProjectList from './views/ProjectList.tsx'
import ProjectNew from './views/ProjectNew.tsx'
import ProjectView from './views/ProjectView.tsx'
import './index.css'
import Login from './views/Login.tsx'
import Auth from './Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<ProjectList />} />
          <Route path="/project/new" element={<ProjectNew />} />
          <Route path="/project/:id" element={<ProjectView />} />
        </Route>

        <Route path="/login" element={<Auth />}>
          <Route index element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
