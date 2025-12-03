// Ilya Zeldner
import React, { useState, useContext, createContext, useRef, useEffect } from 'react';

// CONFIGURATION
//
// This Academic Portal allows students to register, login, and view their grades.
// Faculty can login with a special password to view all registered students.
// Data is stored in sessionStorage for simplicity.
const STORAGE_KEY = import.meta.env.VITE_DB_KEY || 'college_backup_db';
const FACULTY_PASS = import.meta.env.VITE_FACULTY_PASS;

// AUTH CONTEXT
//
// We use React Context to manage authentication state across the app.
// This includes current user info, login, registration, and logout functions.
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getUsersFromStorage = () => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  const getAllStudents = () => {
    const users = getUsersFromStorage();
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

      // Generate Random Grades
      // For simplicity, we assign random grades upon registration
      // In a real app, grades would be managed separately
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
      // FACULTY LOGIN
      // Special case for faculty access
      // Faculty does not have a studentID, only a password
      if (password === FACULTY_PASS) {
        setCurrentUser({ studentID: "ADMIN", fullName: "Senior Lecturer", role: "Faculty" });
        setLoading(false);
        return; 
      }

      // STUDENT LOGIN
      // Check credentials against stored users
      // If found, set as current user
      // If not, show error
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

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, getAllStudents, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}


// UI COMPONENTS
//
// We have LoginPanel, RegisterPanel, Dashboard, and PortalController components
// to manage the user interface and interactions.

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

// REGISTER PANEL (With Validation Logic)
//
// This component allows new students to register.
// It includes validation for password length and student ID format.
// It disables the submit button until all fields are valid.
// It also includes a link to switch back to the login panel.
function RegisterPanel({ onSwitchToLogin }) {
  const { register, loading, error } = useContext(AuthContext);
  
  // STATE DEFINITIONS
  const [fullName, setFullName] = useState('');
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  
  const nameRef = useRef(null);
  useEffect(() => { if(nameRef.current) nameRef.current.focus(); }, []);

  // VALIDATION LOGIC
  // 1. Password must be at least 6 characters
  // 2. Student ID must be exactly 9 digits
  // 3. All fields must be filled
  const isPasswordShort = password.length > 0 && password.length < 6;
  const isIdInvalid = studentID.length > 0 && studentID.length !== 9;
  const isValid = !isPasswordShort && !isIdInvalid && fullName.length > 0 && studentID.length > 0 && password.length > 0;

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if(isValid) register(studentID, fullName, password); 
  };

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
            <input 
                type="text" 
                value={studentID} 
                onChange={e => setStudentID(e.target.value)} 
                required 
                placeholder="e.g. 305123456"
                style={{ borderColor: isIdInvalid ? 'red' : '#ced4da' }}
            />
            {isIdInvalid && <small style={{color: '#dc3545'}}>ID must be 9 digits</small>}
        </div>
        
        <div className="form-group">
            <label>Password:</label>
            <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{ borderColor: isPasswordShort ? 'red' : '#ced4da' }}
            />
            {isPasswordShort && <small style={{color: '#dc3545'}}>Must be at least 6 characters</small>}
        </div>

        {error && <p className="error-msg">{error}</p>}

        {
        /*
          BUTTON DISABLE LOGIC
          - Disabled if loading or form is invalid
          - Opacity and cursor change to indicate disabled state
          */
        }
        <button 
            type="submit" 
            disabled={loading || !isValid}
            style={{ opacity: !isValid ? 0.6 : 1, cursor: !isValid ? 'not-allowed' : 'pointer' }}
        >
            {loading ? "Registering..." : "Create Account"}
        </button>
      </form>
      
      {
      /* 
      LINK BACK TO LOGIN
      - Simple text link to switch back to login panel
      */
      }
      <p className="switch-link">Registered? <span onClick={onSwitchToLogin}>Login Here</span></p>
    </div>
  );
}

function Dashboard() {
  const { currentUser, logout, getAllStudents } = useContext(AuthContext);
  const isFaculty = currentUser.role === "Faculty";
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
            <div>
                <h4 style={{color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px'}}>Registered Students ({studentList.length})</h4>
                {studentList.length === 0 ? <p style={{color: '#777'}}>No students registered yet.</p> : (
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
                                            <button onClick={() => alert(`Edit grades for ${student.fullName}? (Feature coming soon)`)} style={{padding: '4px 8px', fontSize: '0.75rem', width: 'auto', background: '#28a745'}}>Edit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        ) : (
            <div>
                <h4 style={{color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '5px'}}>Semester Grades</h4>
                <ul style={{listStyle: 'none', padding: 0, color: '#333'}}>
                  {currentUser.grades && currentUser.grades.map((grade, index) => (
                    <li key={index} style={{borderBottom: '1px solid #ddd', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <span style={{fontSize: '1rem'}}>{grade.course}</span>
                        <span style={{fontWeight: 'bold', color: grade.score >= 90 ? '#28a745' : (grade.score < 60 ? '#dc3545' : '#333'), background: '#e9ecef', padding: '2px 8px', borderRadius: '4px'}}>
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
// inline styles and CSS classes for simplicity.
// In a real app, we using CSS modules or styled-components for better scalability.
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