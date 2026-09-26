import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Workouts from './pages/Workouts'
import Progress from './pages/Progress'
import CustomWorkout from './pages/CustomWorkout'

const App = () => {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />} />
      <Route
        path="/home"
        element={(
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/workouts"
        element={(
          <ProtectedRoute>
            <Workouts />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/progress"
        element={(
          <ProtectedRoute>
            <Progress />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/custom-workout"
        element={(
          <ProtectedRoute>
            <CustomWorkout />
          </ProtectedRoute>
        )}
      />
      <Route path="/pr" element={<Navigate to="/progress" replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
    </Routes>
  )
}

export default App
