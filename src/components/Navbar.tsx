import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import './Navbar.css';

export type TabType = 'about' | 'experiences' | 'projects' | 'connections' | 'admin';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { profile } = useData();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const logoClicksRef = useRef(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleTabClick = (tab: TabType) => {
    window.location.hash = tab;
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    logoClicksRef.current = 0; // Reset clicks when navigating elsewhere
  };

  const handleLogoClick = () => {
    logoClicksRef.current += 1;
    if (logoClicksRef.current >= 10) {
      logoClicksRef.current = 0;
      const pw = prompt(language === 'tr' ? 'Yönetici Şifresi:' : 'Admin Password:');
      if (pw === '1234') {
        setActiveTab('admin');
      } else {
        alert(language === 'tr' ? 'Hatalı Şifre!' : 'Invalid Password!');
      }
    } else {
      handleTabClick('about');
    }
  };

  const selectLanguage = (lang: 'en' | 'tr') => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  const handleDownloadCv = (e: React.MouseEvent) => {
    e.preventDefault();
    if (profile?.cvUrl) {
      window.open(profile.cvUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert(language === 'tr' ? 'CV indirme alanı (Daha sonra yapılandırılacaktır).' : 'CV Download placeholder (Will be configured later).');
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        {/* Brand Logo */}
        <div className="logo" onClick={handleLogoClick}>
          <span className="logo-accent">&lt;</span>
          Umut
          <span className="logo-accent">.dev /&gt;</span>
        </div>

        {/* Desktop Navigation Menu */}
        <ul className="nav-menu">
          <li className="nav-item">
            <span
              className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabClick('about')}
            >
              {t.nav.about}
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => handleTabClick('experiences')}
            >
              {t.nav.experiences}
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => handleTabClick('projects')}
            >
              {t.nav.projects}
            </span>
          </li>
          <li className="nav-item">
            <span
              className={`nav-link ${activeTab === 'connections' ? 'active' : ''}`}
              onClick={() => handleTabClick('connections')}
            >
              {t.nav.connections}
            </span>
          </li>
          <li className="nav-item">
            <span
              className="nav-link"
              onClick={handleDownloadCv}
              style={{
                cursor: 'pointer',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--accent-glow)',
                color: 'var(--accent)',
                fontWeight: 600
              }}
            >
              {t.nav.downloadCv}
            </span>
          </li>
        </ul>

        {/* Controls Hub: Theme & Language */}
        <div className="nav-controls">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? (
              // Moon Icon (next: dark)
              <svg className="theme-icon" viewBox="0 0 24 24">
                <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-9 8.3-9.8.4-.1.8.1.9.5.1.4-.1.8-.5.9-3.8.7-6.7 4.1-6.7 8.4 0 4.4 3.6 8 8 8 .5 0 .9 0 1.4-.1.4-.1.8.1.9.5.1.4-.1.8-.5.9-.4.1-.8.2-1.2.2zm4.3-2.6c-.2-.4-.1-.9.3-1.1 2.3-1.5 3.6-4 3.6-6.7 0-4.4-3.6-8-8-8-.3 0-.7 0-1 .1-.4.1-.8-.2-.9-.6-.1-.4.2-.8.6-.9 4.9-.7 9.3 2.7 9.3 7.9 0 3.2-1.6 6.2-4.4 8-.4.2-.9.1-1.1-.3z" />
              </svg>
            ) : theme === 'dark' ? (
              // Torii Gate Icon (next: samurai)
              <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 5c2-1 6-1.5 10-1.5s8 .5 10 1.5" />
                <path d="M3 6.8h18" />
                <path d="M5 9h14" />
                <path d="M7 9v12" />
                <path d="M17 9v12" />
                <path d="M12 5v4" />
              </svg>
            ) : (
              // Sun Icon (next: light)
              <svg className="theme-icon" viewBox="0 0 24 24">
                <path d="M12 7c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-10c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1s-1.4.4-1 1v1c0 .6.4 1 1 1zm0 14c-.6 0-1 .4-1 1v1c0 .6.4 1 1 1s1-.4 1-1v-1c0-.6-.4-1-1-1zm8.5-7.5h-1c-.6 0-1 .4-1 1s.4 1 1 1h1c.6 0 1-.4 1-1s-.4-1-1-1zM5.5 12c0-.6-.4-1-1-1h-1c-.6 0-1 .4-1 1s.4 1 1 1h1c.6 0 1-.4 1-1zm12.3-6.3c-.4-.4-1-.4-1.4 0l-.7.7c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l.7-.7c.4-.4.4-1 0-1.4zM7.6 16.4l-.7.7c-.4.4-.4 1 0 1.4.2.2.5.3.7.3s.5-.1.7-.3l.7-.7c.4-.4.4-1 0-1.4s-1-.4-1.4 0zm10.2.7c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l.7.7c.2.2.5.3.7.3s.5-.1.7-.3c.4-.4.4-1 0-1.4l-.7-.7zM6.9 7.6c.4.4 1 .4 1.4 0s.4-1 0-1.4l-.7-.7c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l.7.7z" />
              </svg>
            )}
          </button>

          {/* Language Selector */}
          <div className="lang-selector" ref={langRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="lang-btn"
              aria-label="Change Language"
            >
              <span>{language.toUpperCase()}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isLangDropdownOpen && (
              <ul className="lang-dropdown">
                <li
                  className={`lang-option ${language === 'en' ? 'active' : ''}`}
                  onClick={() => selectLanguage('en')}
                >
                  English
                </li>
                <li
                  className={`lang-option ${language === 'tr' ? 'active' : ''}`}
                  onClick={() => selectLanguage('tr')}
                >
                  Türkçe
                </li>
              </ul>
            )}
          </div>

          {/* Mobile Drawer Toggle Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-nav-toggle"
            aria-label="Open Navigation Menu"
          >
            <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer Overlay */}
      <div className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-menu">
          <li>
            <span
              className={`mobile-link ${activeTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabClick('about')}
            >
              {t.nav.about}
            </span>
          </li>
          <li>
            <span
              className={`mobile-link ${activeTab === 'experiences' ? 'active' : ''}`}
              onClick={() => handleTabClick('experiences')}
            >
              {t.nav.experiences}
            </span>
          </li>
          <li>
            <span
              className={`mobile-link ${activeTab === 'projects' ? 'active' : ''}`}
              onClick={() => handleTabClick('projects')}
            >
              {t.nav.projects}
            </span>
          </li>
          <li>
            <span
              className={`mobile-link ${activeTab === 'connections' ? 'active' : ''}`}
              onClick={() => handleTabClick('connections')}
            >
              {t.nav.connections}
            </span>
          </li>
          <li>
            <span
              className="mobile-link"
              onClick={handleDownloadCv}
              style={{
                border: '1.5px dashed var(--accent)',
                color: 'var(--accent)',
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              {t.nav.downloadCv}
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
