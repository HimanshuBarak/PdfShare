
import './App.css';
import React, { useEffect, useState } from 'react';
import { auth } from './components/firebase/setup';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navigation/Navbar';
import LoginPage from './components/authentication/LoginPage';
import UploadFile from './components/dashboard/UploadFile';
import Home from './components/Home';
import SignupPage from './components/authentication/SignupPage';
import ViewPdf from './components/dashboard/ViewPdf';
import DisplayFiles from './components/dashboard/DisplayFiles';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">
       
    <Router>
     {user && <NavBar />} 
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<DisplayFiles />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/upload" element={<UploadFile />} />  
          <Route path="/view" element={<ViewPdf />} />
       </Routes>
    </Router>
    </div>
   
  );
}

export default App;
