import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import IssueBook from './components/IssueBook';
import AdminPanel from './components/AdminPanel';
import './styles.css';

const App = () => {
  const { currentUser, logout } = useAuth();
  const [showBookForm, setShowBookForm] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Library Management System</h1>
          <nav>
            {currentUser ? (
              <>
                <span>Welcome, {currentUser.username} ({currentUser.role})</span>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </>
            )}
          </nav>
        </header>

        <main className="app-main">
          <Routes>
            <Route 
              path="/login" 
              element={currentUser ? <Navigate to="/" /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={currentUser ? <Navigate to="/" /> : <Register />} 
            />
            <Route 
              path="/" 
              element={
                currentUser ? (
                  <>
                    <div className="action-bar">
                      {(currentUser.role === 'librarian' || currentUser.role === 'admin') && (
                        <button 
                          onClick={() => setShowBookForm(true)}
                          className="add-book-btn"
                        >
                          Add New Book
                        </button>
                      )}
                    </div>
                    
                    {showBookForm && (
                      <BookForm 
                        onSave={() => {
                          setShowBookForm(false);
                          window.location.reload();
                        }}
                        onCancel={() => setShowBookForm(false)}
                      />
                    )}
                    
                    <BookList />
                    <br></br>
                    {(currentUser.role === 'librarian' || currentUser.role === 'admin') && (
                      <>
                        <IssueBook />
                        {currentUser.role === 'admin' && <AdminPanel />}
                      </>
                    )}
                  </>
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;