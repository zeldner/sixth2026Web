// Ilya Zeldner
import React, { useState, useContext, createContext, useRef, useEffect } from 'react';

// CONFIGURATION
// Use environment variables for sensitive data and configuration
// Fallback to default key if env variable is not set
const STORAGE_KEY = import.meta.env.VITE_DB_KEY || 'college_backup_db';
const FACULTY_PASS = import.meta.env.VITE_FACULTY_PASS;

// AUTH CONTEXT (Logic)
// This context manages authentication state and provides
// functions for login, registration, and logout.
// It also includes a function for Admins to view all students.
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUsersFromStorage = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  //  FUNCTION FOR ADMIN TO SEE EVERYONE
  // This function is exposed to the context so that
  // the Dashboard component can use it to list all students.
  // It filters out only users with the 'Student' role.
  // This keeps Admins from seeing other Admins (if any).
  const getAllStudents = () => {
    const users = getUsersFromStorage();
    // Filter to show only Students 
    return users.filter(u => u.role === 'Student');
  };

  const register = (studentID, fullName, password) => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = getUsersFromStorage();
      if (users.find(u => u.studentID === studentID)) {
        setError("Error: Student ID already exists.");
        setLoading(false);
        return;
      }

      // Generate Random Grades for the Demo
      const mockGrades = [
        { course: "Linear Algebra", score: Math.floor(Math.random() * (100 - 60) + 60) },
        { course: "Web Development", score: Math.floor(Math.random() * (100 - 80) + 80) },
        { course: "Algorithms", score: Math.floor(Math.random() * (100 - 55) + 55) }
      ];

      const newUser = { 
        studentID, 
        fullName, 
        password, 
        role: 'Student',
        grades: mockGrades 
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...users, newUser]));
      setCurrentUser(newUser);
      setLoading(false);
    }, 800);
  };

  const login = (studentID, password) => {
    setLoading(true);
    setError('');

    setTimeout(() => {
      // 1. FACULTY LOGIN (ENV VARIABLE)
      if (password === FACULTY_PASS) {
        setCurrentUser({ 
            studentID: "ADMIN", 
            fullName: "Senior Lecturer", 
            role: "Faculty" 
        });
        setLoading(false);
        return; 
      }

      // STUDENT LOGIN
      const users = getUsersFromStorage();
      const foundUser = users.find(u => u.studentID === studentID && u.password === password);

      if (foundUser) {
        setCurrentUser(foundUser);
      } else {
        setError("Login Failed: Incorrect ID or Password.");
      }
      setLoading(false);
    }, 800);
  };

  const logout = () => setCurrentUser(null);

  // Expose 'getAllStudents' to the context so Dashboard can use it
  // along with other auth functions and state.
  // This keeps all auth-related logic encapsulated here.
  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, getAllStudents, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// UI COMPONENTS

// LOGIN & REGISTER PANELS
function LoginPanel({ onSwitchToRegister }) {
  const { login, loading, error } = useContext(AuthContext);
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const idRef = useRef(null);
  useEffect(() => { if(idRef.current) idRef.current.focus(); }, []);
  const handleSubmit = (e) => { e.preventDefault(); login(studentID, password); };

  return (
    <div className="card fade-in">
      <h3 className="card-title">Student Portal Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Student ID:</label>
            <input ref={idRef} type="text" value={studentID} onChange={e => setStudentID(e.target.value)} required placeholder="e.g. 305123456" />
        </div>
        <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Enter Portal"}</button>
      </form>
      <p className="switch-link">Not registered? <span onClick={onSwitchToRegister}>Open Account</span></p>
    </div>
  );
}

function RegisterPanel({ onSwitchToLogin }) {
  const { register, loading, error } = useContext(AuthContext);
  const [fullName, setFullName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const nameRef = useRef(null);
  useEffect(() => { if(nameRef.current) nameRef.current.focus(); }, []);
  const handleSubmit = (e) => { e.preventDefault(); register(studentID, fullName, password); };

  return (
    <div className="card fade-in">
      <h3 className="card-title">New Registration</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Full Name:</label>
            <input ref={nameRef} type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Israel Israeli" />
        </div>
        <div className="form-group">
            <label>Student ID:</label>
            <input type="text" value={studentID} onChange={e => setStudentID(e.target.value)} required placeholder="e.g. 305123456" />
        </div>
        <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Registering..." : "Create Account"}</button>
      </form>
      <p className="switch-link">Registered? <span onClick={onSwitchToLogin}>Login Here</span></p>
    </div>
  );
}

// DASHBOARD
// Shows different views for Faculty (Admin) and Students
// Faculty can see the list of all students
// Students can see their own grades
function Dashboard() {
  const { currentUser, logout, getAllStudents } = useContext(AuthContext);
  const isFaculty = currentUser.role === "Faculty";
  
  // Derive student list directly instead of storing in state
  const studentList = isFaculty ? getAllStudents() : [];

  return (
    <div className="card fade-in" style={{textAlign: 'center', borderTop: isFaculty ? '5px solid #dc3545' : '5px solid #0056b3'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2 style={{color: isFaculty ? '#dc3545' : '#0056b3', margin: 0}}>
            {isFaculty ? "Faculty Admin" : "Student Portal"}
        </h2>
        <span style={{background: isFaculty ? '#dc3545' : '#0056b3', color: 'white', padding: '5px 10px', borderRadius: '15px', fontSize: '0.8rem'}}>
            {currentUser.fullName}
        </span>
      </div>

      <div style={{textAlign: 'left', background: '#f8f9fa', padding: '15px', borderRadius: '5px', margin: '20px 0'}}>
        
        {isFaculty ? (
            // FACULTY (THE LIST)
            <div>
                <h4 style={{color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px'}}>Registered Students ({studentList.length})</h4>
                
                {studentList.length === 0 ? (
                    <p style={{color: '#777'}}>No students registered yet.</p>
                ) : (
                    <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '10px'}}>
                            <thead>
                                <tr style={{background: '#e9ecef', color: '#495057', fontSize: '0.9rem'}}>
                                    <th style={{padding: '8px', textAlign: 'left'}}>ID</th>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Name</th>
                                    <th style={{padding: '8px', textAlign: 'center'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.map(student => (
                                    <tr key={student.studentID} style={{borderBottom: '1px solid #ddd'}}>
                                        <td style={{padding: '8px', fontSize: '0.9rem', color: '#333'}}>{student.studentID}</td>
                                        <td style={{padding: '8px', fontSize: '0.9rem', fontWeight: 'bold', color: '#333'}}>{student.fullName}</td>
                                        <td style={{padding: '8px', textAlign: 'center'}}>
                                            <button 
                                                onClick={() => alert(`Edit grades for ${student.fullName}? (Feature coming soon)`)}
                                                style={{padding: '4px 8px', fontSize: '0.75rem', width: 'auto', background: '#28a745'}}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        ) : (
            // STUDENT (THE GRADES)
            // Show student's own grades
            // If no grades, show a message
            // Assume grades is an array of { course, score }
            <div>
                <h4 style={{color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px'}}>Semester Grades</h4>
                <ul style={{listStyle: 'none', padding: 0, color: '#333'}}>
                  {currentUser.grades && currentUser.grades.map((grade, index) => (
                    <li key={index} style={{borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{fontSize: '1rem'}}>{grade.course}</span>
                        <span style={{
                            fontWeight: 'bold', 
                            color: grade.score >= 90 ? '#28a745' : (grade.score < 60 ? '#dc3545' : '#333'),
                            background: '#e9ecef',
                            padding: '2px 8px',
                            borderRadius: '4px'
                        }}>
                            {grade.score}
                        </span>
                    </li>
                  ))}
                </ul>
            </div>
        )}
      </div>

      <button onClick={logout} style={{background: '#6c757d', border: 'none'}}>Logout</button>
    </div>
  );
}

// PORTAL CONTROLLER
// Decides which view to show based on auth state
// If logged in, show Dashboard
// If not, show Login or Register panels
// with ability to switch between them
function PortalController() {
  const { currentUser } = useContext(AuthContext);
  const [isLoginView, setIsLoginView] = useState(true);
  if (currentUser) return <Dashboard />;
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      {isLoginView ? <LoginPanel onSwitchToRegister={() => setIsLoginView(false)} /> : <RegisterPanel onSwitchToLogin={() => setIsLoginView(true)} />}
    </div>
  );
}

// STYLES
// Main Academic Portal Component
// Applies overall styles and wraps everything in AuthProvider
// to provide auth context to all components
function AcademicPortal() {
  return (
    <div style={{background: '#e9ecef', minHeight: '600px', padding: '40px', fontFamily: '"Segoe UI", sans-serif', color: '#333'}}>
        <style>{`
            .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); color: #333 !important; }
            .card-title { color: #343a40 !important; text-align: center; margin-bottom: 25px; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            .form-group { margin-bottom: 20px; }
            .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #495057 !important; }
            .form-group input { width: 90%; padding: 12px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; color: #333 !important; background: #fff !important; }
            .form-group input:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
            button { width: 100%; padding: 12px; background: #007bff; color: white !important; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
            button:hover { background: #0056b3; }
            .error-msg { background: #f8d7da; color: #721c24 !important; padding: 10px; borderRadius: 4px; marginBottom: 20px; textAlign: center; }
            .switch-link { text-align: center; margin-top: 20px; font-size: 0.9rem; color: #6c757d !important; }
            .switch-link span { color: #007bff !important; cursor: pointer; font-weight: 600; }
            .switch-link span:hover { text-decoration: underline; }
            .fade-in { animation: fadeIn 0.5s ease-in-out; }
            @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        
        <AuthProvider>
            <PortalController />
        </AuthProvider>
    </div>
  );
}

export default AcademicPortal;