// Ilya Zeldner
import React, { useState, useContext, createContext, useRef, useEffect } from 'react';

// CONFIGURATION
//
// In a real project, these would be in a .env file
// and not hardcoded for security reasons.
const STORAGE_KEY = import.meta.env.VITE_DB_KEY || 'college_backup_db';
const FACULTY_PASS = import.meta.env.VITE_FACULTY_PASS;

// AUTH CONTEXT
//
// Provides authentication state and methods to the app.
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
      if (password === FACULTY_PASS) {
        setCurrentUser({ studentID: "ADMIN", fullName: "Senior Lecturer", role: "Faculty" });
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

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, getAllStudents, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. UI COMPONENTS (TAILWIND STYLED)
//
// Login Panel
// Registration Panel
// Dashboard (Student & Faculty Views)
// Portal Controller (Switches between Login/Register/Dashboard)

function LoginPanel({ onSwitchToRegister }) {
  const { login, loading, error } = useContext(AuthContext);
  const [studentID, setStudentID] = useState('');
  const [password, setPassword] = useState('');
  const idRef = useRef(null);
  
  useEffect(() => { if(idRef.current) idRef.current.focus(); }, []);
  
  const handleSubmit = (e) => { e.preventDefault(); login(studentID, password); };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 animate-fade-in">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
        Student Portal Login
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block mb-1 font-semibold text-gray-600">Student ID:</label>
            <input 
              ref={idRef} 
              type="text" 
              value={studentID} 
              onChange={e => setStudentID(e.target.value)} 
              required 
              placeholder="e.g. 305123456"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            />
        </div>
        <div>
            <label className="block mb-1 font-semibold text-gray-600">Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            />
        </div>
        {error && <p className="bg-red-100 text-red-700 p-2 rounded text-center text-sm">{error}</p>}
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full p-3 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Verifying..." : "Enter Portal"}
        </button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-500">
        Not registered? <span onClick={onSwitchToRegister} className="text-blue-600 cursor-pointer font-bold hover:underline">Open Account</span>
      </p>
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

  // Validation
  const isPasswordShort = password.length > 0 && password.length < 6;
  const isIdInvalid = studentID.length > 0 && studentID.length !== 9;
  const isValid = !isPasswordShort && !isIdInvalid && fullName.length > 0 && studentID.length > 0 && password.length > 0;

  const handleSubmit = (e) => { 
    e.preventDefault(); 
    if(isValid) register(studentID, fullName, password); 
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg text-gray-800 animate-fade-in">
      <h3 className="text-2xl font-bold text-center text-gray-800 mb-6 border-b-2 border-blue-500 pb-2">
        New Registration
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block mb-1 font-semibold text-gray-600">Full Name:</label>
            <input 
              ref={nameRef} 
              type="text" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required 
              placeholder="Israel Israeli"
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
            />
        </div>
        
        <div>
            <label className="block mb-1 font-semibold text-gray-600">Student ID:</label>
            <input 
                type="text" 
                value={studentID} 
                onChange={e => setStudentID(e.target.value)} 
                required 
                placeholder="e.g. 305123456"
                className={`w-full p-3 border rounded outline-none bg-white text-gray-900 ${isIdInvalid ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {isIdInvalid && <p className="text-red-500 text-xs mt-1">ID must be 9 digits</p>}
        </div>
        
        <div>
            <label className="block mb-1 font-semibold text-gray-600">Password:</label>
            <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className={`w-full p-3 border rounded outline-none bg-white text-gray-900 ${isPasswordShort ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`}
            />
            {isPasswordShort && <p className="text-red-500 text-xs mt-1">Must be at least 6 characters</p>}
        </div>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded text-center text-sm">{error}</p>}

        <button 
            type="submit" 
            disabled={loading || !isValid}
            className={`w-full p-3 font-bold rounded text-white transition duration-200 ${!isValid || loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
            {loading ? "Registering..." : "Create Account"}
        </button>
      </form>
      
      <p className="text-center mt-6 text-sm text-gray-500">
        Registered? <span onClick={onSwitchToLogin} className="text-blue-600 cursor-pointer font-bold hover:underline">Login Here</span>
      </p>
    </div>
  );
}

function Dashboard() {
  const { currentUser, logout, getAllStudents } = useContext(AuthContext);
  const isFaculty = currentUser.role === "Faculty";
  // Compute the list directly instead of setting state inside an effect to avoid cascading renders
  const studentList = isFaculty ? getAllStudents() : [];

  return (
    <div className={`bg-white p-8 rounded-lg shadow-lg text-gray-800 animate-fade-in border-t-8 ${isFaculty ? 'border-red-500' : 'border-blue-500'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${isFaculty ? 'text-red-600' : 'text-blue-600'}`}>
            {isFaculty ? "Faculty Admin" : "Student Portal"}
        </h2>
        <span className={`px-3 py-1 rounded-full text-white text-sm ${isFaculty ? 'bg-red-600' : 'bg-blue-600'}`}>
            {currentUser.fullName}
        </span>
      </div>

      <div className="bg-gray-100 p-4 rounded mb-6 text-left">
        {isFaculty ? (
            <div>
                <h4 className="text-lg font-bold text-gray-700 border-b border-gray-300 pb-2 mb-2">
                    Registered Students ({studentList.length})
                </h4>
                {studentList.length === 0 ? <p className="text-gray-500">No students registered yet.</p> : (
                    <div className="max-h-60 overflow-y-auto">
                        <table className="w-full mt-2 border-collapse">
                            <thead className="bg-gray-200 text-gray-600 text-sm">
                                <tr>
                                    <th className="p-2 text-left">ID</th>
                                    <th className="p-2 text-left">Name</th>
                                    <th className="p-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentList.map(student => (
                                    <tr key={student.studentID} className="border-b border-gray-300">
                                        <td className="p-2 text-sm text-gray-800">{student.studentID}</td>
                                        <td className="p-2 text-sm font-bold text-gray-800">{student.fullName}</td>
                                        <td className="p-2 text-center">
                                            <button 
                                                onClick={() => alert(`Edit grades for ${student.fullName}? (Feature coming soon)`)} 
                                                className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
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
            <div>
                <h4 className="text-lg font-bold text-gray-700 border-b border-gray-300 pb-2 mb-2">
                    Semester Grades
                </h4>
                <ul className="space-y-2">
                  {currentUser.grades && currentUser.grades.map((grade, index) => (
                    <li key={index} className="flex justify-between items-center border-b border-gray-300 pb-2">
                        <span className="text-gray-800">{grade.course}</span>
                        <span className={`font-bold px-2 py-1 rounded text-sm ${grade.score >= 90 ? 'bg-green-100 text-green-700' : (grade.score < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-200 text-gray-800')}`}>
                            {grade.score}
                        </span>
                    </li>
                  ))}
                </ul>
            </div>
        )}
      </div>
      <button 
        onClick={logout} 
        className="w-full p-3 bg-gray-500 text-white font-bold rounded hover:bg-gray-600 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
}

function PortalController() {
  const { currentUser } = useContext(AuthContext);
  const [isLoginView, setIsLoginView] = useState(true);
  if (currentUser) return <Dashboard />;
  return (
    <div className="max-w-md mx-auto">
      {isLoginView ? <LoginPanel onSwitchToRegister={() => setIsLoginView(false)} /> : <RegisterPanel onSwitchToLogin={() => setIsLoginView(true)} />}
    </div>
  );
}

// MAIN EXPORT
function AcademicPortal() {
  return (
    // Outer container: sets font, light background to contrast with main app dark mode
    <div className="bg-gray-200 min-h-[600px] p-10 font-sans text-gray-900">
        <AuthProvider>
            <PortalController />
        </AuthProvider>
    </div>
  );
}

export default AcademicPortal;