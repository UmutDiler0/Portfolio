import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import type { TabType } from './Navbar';
import './Hero.css';

interface HeroProps {
  setActiveTab: (tab: TabType) => void;
}

export const Hero: React.FC<HeroProps> = ({ setActiveTab }) => {
  const { t, language } = useLanguage();
  const { profile } = useData();

  // Dynamic overrides with local fallbacks
  const greeting = profile ? (language === 'tr' ? profile.greeting_tr : profile.greeting_en) : t.hero.greeting;
  const title = profile ? (language === 'tr' ? profile.title_tr : profile.title_en) : t.hero.title;
  const subtitle = profile ? (language === 'tr' ? profile.subtitle_tr : profile.subtitle_en) : t.hero.subtitle;

  return (
    <section className="hero-section container animate-slide-up">
      {/* Introduction Columns */}
      <div className="hero-content">
        <span className="hero-greeting">{greeting}</span>
        <h1 className="hero-name">Umut Diler</h1>
        <h2 className="hero-title">{title}</h2>
        <p className="hero-subtitle">{subtitle}</p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button
            onClick={() => setActiveTab('connections')}
            className="btn btn-primary"
            aria-label="Connect with me"
          >
            {t.hero.ctaPrimary}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <button
            onClick={() => setActiveTab('projects')}
            className="btn btn-secondary"
            aria-label="View projects"
          >
            {t.hero.ctaSecondary}
          </button>
        </div>
      </div>
    </section>
  );
};
export default Hero;
