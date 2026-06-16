import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './components/common/Toast'
import ProtectedRoute from './components/common/ProtectedRoute'
import Layout from './components/layout/Layout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import HomePage from './pages/user/HomePage'
import PetDetailPage from './pages/user/PetDetailPage'
import MyAdoptionsPage from './pages/user/MyAdoptionsPage'
import NotificationsPage from './pages/user/NotificationsPage'
import ProfilePage from './pages/user/ProfilePage'
import EditorDashboard from './pages/editor/EditorDashboard'
import PetFormPage from './pages/editor/PetFormPage'
import AdoptionMgmtPage from './pages/editor/AdoptionMgmtPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserMgmtPage from './pages/admin/UserMgmtPage'
import ActiveUsersPage from './pages/admin/ActiveUsersPage'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/pets" replace />} />
            <Route path="pets" element={<HomePage />} />
            <Route path="pets/:id" element={<PetDetailPage />} />
            <Route path="profile" element={<ProfilePage />} />

            {/* User only */}
            <Route path="adoptions" element={
              <ProtectedRoute allowedRoles={['user']}>
                <MyAdoptionsPage />
              </ProtectedRoute>
            } />
            <Route path="notifications" element={
              <ProtectedRoute allowedRoles={['user']}>
                <NotificationsPage />
              </ProtectedRoute>
            } />

            {/* Editor + Admin */}
            <Route path="editor" element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <EditorDashboard />
              </ProtectedRoute>
            } />
            <Route path="editor/pets/new" element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <PetFormPage />
              </ProtectedRoute>
            } />
            <Route path="editor/pets/:id/edit" element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <PetFormPage />
              </ProtectedRoute>
            } />
            <Route path="editor/adoptions" element={
              <ProtectedRoute allowedRoles={['editor', 'admin']}>
                <AdoptionMgmtPage />
              </ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserMgmtPage />
              </ProtectedRoute>
            } />
            <Route path="admin/active-users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ActiveUsersPage />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
