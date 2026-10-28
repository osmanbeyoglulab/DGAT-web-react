// src/App.jsx
import React, { useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import SubmissionPage from './pages/SubmissionPage';
import ProcessingPage from './pages/ProcessingPage';
import EmailSuccessPage from './pages/EmailSuccessPage';
import AnalyzePage from './pages/AnalyzePage';
// Import the new pages
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import ExploreModelPage from './pages/ExploreModelPage';

export default function App() {
  const [showBanner, setShowBanner] = useState(() => {
    const saved = localStorage.getItem('hideDgatBanner');
    return saved !== 'true';
  });

  const handleDismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('hideDgatBanner', 'true');
  };

  return (
    <div className="app-wrapper">
      <div className="app-layout">
        {/* Constant Left Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>DGAT System</h2>
          </div>
          <nav className="sidebar-nav">
            <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              🏠 Home
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              🧠 Explore Model
            </NavLink>
            <NavLink to="/submission" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              📄 Predict Proteins
            </NavLink>
            <NavLink to="/analyze" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              🔍 Analyze
            </NavLink>
            <NavLink to="/help" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              ❓ Help
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              ℹ️ About
            </NavLink>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          <header className="main-header">
            <h1>DGAT Workflow System</h1>
            <p>Deep learning prediction of protein abundance using expression data</p>
          </header>

          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/submission" element={<SubmissionPage />} />
              <Route path="/processing" element={<ProcessingPage />} />
              <Route path="/success" element={<EmailSuccessPage />} />
              <Route path="/analyze" element={<AnalyzePage />} />
              {/* New Routes */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/explore" element={<ExploreModelPage />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Persistent Bottom Banner */}
      {showBanner && (
        <div className="bottom-banner">
          <p>
            This web tool is free and open to all users; no login is required. It is intended for Research Use Only. By accessing this site, you agree to our <a href="#privacy">Privacy Policy</a>.
          </p>
          <button className="banner-close-btn" onClick={handleDismissBanner}>
            Got It!
          </button>
        </div>
      )}
    </div>
  );
}