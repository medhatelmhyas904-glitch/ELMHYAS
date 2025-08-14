// src/App.tsx
import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPortal from './components/Auth/LoginPortal';
import StudentSignup from './components/Auth/StudentSignup';
import TeacherSignup from './components/Auth/TeacherSignup';
import { UserRole } from './lib/types'; 

// إنشاء component جديد لتضمين منطق التطبيق
const AppContent = () => {
  const navigate = useNavigate();

  const handleLogin = (roles: UserRole[], username: string) => {
    console.log(`User logged in with roles: ${roles.join(', ')}, username: ${username}`);
    if (roles.includes('student')) {
      navigate('/student-dashboard');
    } else if (roles.includes('teacher')) {
      navigate('/teacher-dashboard');
    }
  };

  const handleBackToLogin = () => {
    navigate('/');
  };

  const handleNavigateToSignup = () => {
    navigate('/student-signup');
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LoginPortal onLogin={handleLogin} onNavigateToSignup={handleNavigateToSignup} />} />
        <Route path="/student-signup" element={<StudentSignup onBackToLogin={handleBackToLogin} />} />
        <Route path="/teacher-signup" element={<TeacherSignup onBackToLogin={handleBackToLogin} />} />
      </Routes>
    </AuthProvider>
  );
};

// الدالة App الرئيسية التي تحتوي على Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;