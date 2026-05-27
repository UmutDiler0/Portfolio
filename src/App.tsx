import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import type { TabType } from './components/Navbar';
import Hero from './components/Hero';
import AboutMe from './pages/AboutMe';
import AdminPanel from './pages/AdminPanel';
import ProjectDetail from './pages/ProjectDetail';
import { ExperiencesPlaceholder, ProjectsPlaceholder, Connections } from './pages/Placeholders';
import './App.css';

// -------------------------------------------------------------
// Core Application Layout & Dynamic Page Switcher
// -------------------------------------------------------------
const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        setActiveTab('admin');
        setSelectedProjectId(null);
      } else if (hash.startsWith('#/project/')) {
        const id = hash.replace('#/project/', '');
        setActiveTab('projects');
        setSelectedProjectId(id);
      } else if (hash.startsWith('#/projects/')) {
        const id = hash.replace('#/projects/', '');
        setActiveTab('projects');
        setSelectedProjectId(id);
      } else {
        const tab = hash.replace('#', '') as TabType;
        if (['about', 'experiences', 'projects', 'connections', 'admin'].includes(tab)) {
          setActiveTab(tab as TabType);
          setSelectedProjectId(null);
        }
      }
    };

    handleLocationCheck();

    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('hashchange', handleLocationCheck);
    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('hashchange', handleLocationCheck);
    };
  }, [language]);

  const handleTabChange = (tab: TabType) => {
    window.location.hash = tab;
    setActiveTab(tab);
    setSelectedProjectId(null);
  };

  // Dynamic Routing Logic based on Active Navbar Tab State
  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return (
          <>
            {/* Hero Banner Component */}
            <Hero setActiveTab={handleTabChange} />
            {/* Detailed Professional Profile Section */}
            <AboutMe />
          </>
        );
      case 'experiences':
        return <ExperiencesPlaceholder />;
      case 'projects':
        if (selectedProjectId) {
          return (
            <ProjectDetail
              projectId={selectedProjectId}
              onBack={() => {
                setSelectedProjectId(null);
                window.location.hash = '#projects';
              }}
            />
          );
        }
        return (
          <ProjectsPlaceholder
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              window.location.hash = `#/project/${id}`;
            }}
          />
        );
      case 'connections':
        return <Connections />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Hero setActiveTab={handleTabChange} />;
    }
  };

  return (
    <>
      {theme === 'samurai' && (
        <div className="sakura-container">
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>
        </div>
      )}
      {/* Header Sticky Navigation Panel */}
      <Navbar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* Main Structural Page Wrap */}
      <main style={{ flexGrow: 1, paddingTop: '70px' }}>
        {renderContent()}
      </main>

      {/* Premium Footer Section */}
      <footer>
        <div className="container footer-content">
          <div className="footer-socials">
            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub Profile"
            >
              GitHub
            </a>
            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn Profile"
            >
              LinkedIn
            </a>
            {/* Twitter/X */}
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Twitter X Profile"
            >
              Twitter / X
            </a>
          </div>
          
          <div className="footer-text">
            <p>&copy; {new Date().getFullYear()} Umut Diler. {t.footer.rights}</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>
              {t.footer.madeWith}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

// -------------------------------------------------------------
// Root App Wrap Providing Contexts Globally
// -------------------------------------------------------------
export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <MainAppContent />
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
