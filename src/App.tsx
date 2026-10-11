import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/home-page'
import { MobilePage } from '@/pages/mobile-page'
import { PhaseOnePage } from '@/pages/phase-one-page'
import { PortalPage } from '@/pages/portal-page'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* 桌面门户集成入口 */}
        <Route path="/portal" element={<PortalPage />} />
        {/* 一期系统集成入口 */}
        <Route path="/phase-one" element={<PhaseOnePage />} />
        {/* 移动端集成入口 */}
        <Route path="/mobile" element={<MobilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
