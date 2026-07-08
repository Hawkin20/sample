import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { HomePage } from '@/pages/HomePage'
import { AboutPage } from '@/pages/AboutPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { LoginPage } from '@/pages/LoginPage'
import { AuthCallbackPage } from '@/pages/AuthCallbackPage'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminProjects } from '@/pages/admin/AdminProjects'
import { AdminJourney } from '@/pages/admin/AdminJourney'
import { AdminRoadmap } from '@/pages/admin/AdminRoadmap'
import { AdminSettings } from '@/pages/admin/AdminSettings'
import { AdminTheme } from '@/pages/admin/AdminTheme'
import { AdminLogs } from '@/pages/admin/AdminLogs'

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="portfolio-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Public */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/projects/:slug" element={<ProjectDetailPage />} />
              <Route path="/roadmap" element={<RoadmapPage />} />
            </Route>

            {/* Admin (protected) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/journey" element={<AdminJourney />} />
                <Route path="/admin/roadmap" element={<AdminRoadmap />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/theme" element={<AdminTheme />} />
                <Route path="/admin/logs" element={<AdminLogs />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="bottom-right" theme="dark" />
      </AuthProvider>
    </ThemeProvider>
  )
}
