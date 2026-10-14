import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom'; // Added NavLink
import './App.css';

import HomePage from './pages/HomePage';
import SubmissionPage from './pages/SubmissionPage';
import ProcessingPage from './pages/ProcessingPage';
import EmailSuccessPage from './pages/EmailSuccessPage';
import AnalyzePage from './pages/AnalyzePage';

export default function App() {
  return (
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
          <NavLink to="/submission" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            📄 Submission
          </NavLink>
          <NavLink to="/analyze" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            🔍 Analyze
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="main-header">
          <h1>DGAT Workflow System</h1>
          <p>React Simulation of the Document Analysis Flowcharts</p>
        </header>

        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submission" element={<SubmissionPage />} />
            <Route path="/processing" element={<ProcessingPage />} />
            <Route path="/success" element={<EmailSuccessPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}