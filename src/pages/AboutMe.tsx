import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import githubIcon from '../assets/github.jpg';
import linkedinIcon from '../assets/linkedin.jpg';
import './AboutMe.css';

export const AboutMe: React.FC = () => {
  const { t, language } = useLanguage();
  const { profile, experiences } = useData();

  // Dynamic overrides with local fallbacks
  const heading = profile ? (language === 'tr' ? profile.heading_tr : profile.heading_en) : t.about.heading;
  const p1 = profile ? (language === 'tr' ? profile.p1_tr : profile.p1_en) : t.about.p1;
  const p2 = profile ? (language === 'tr' ? profile.p2_tr : profile.p2_en) : t.about.p2;
  const p3 = profile ? (language === 'tr' ? profile.p3_tr : profile.p3_en) : t.about.p3;

  const phone = profile?.phone || '+90 534 062 20 26';
  const email = profile?.email || 'umutdilerr0@gmail.com';
  const github = profile?.github || 'https://github.com/UmutDiler0';
  const linkedin = profile?.linkedin || 'https://www.linkedin.com/in/umut-dilerr/';

  // Use experiences from DB or default timeline
  const timelineItems = experiences.length > 0 ? experiences : [
    {
      id: 'm1',
      company: t.about.timeline.item1.company,
      year_en: t.about.timeline.item1.year,
      year_tr: t.about.timeline.item1.year,
      title_en: t.about.timeline.item1.title,
      title_tr: t.about.timeline.item1.title,
      desc_en: t.about.timeline.item1.desc,
      desc_tr: t.about.timeline.item1.desc
    },
    {
      id: 'm2',
      company: t.about.timeline.item2.company,
      year_en: t.about.timeline.item2.year,
      year_tr: t.about.timeline.item2.year,
      title_en: t.about.timeline.item2.title,
      title_tr: t.about.timeline.item2.title,
      desc_en: t.about.timeline.item2.desc,
      desc_tr: t.about.timeline.item2.desc
    },
    {
      id: 'm3',
      company: t.about.timeline.item3.company,
      year_en: t.about.timeline.item3.year,
      year_tr: t.about.timeline.item3.year,
      title_en: t.about.timeline.item3.title,
      title_tr: t.about.timeline.item3.title,
      desc_en: t.about.timeline.item3.desc,
      desc_tr: t.about.timeline.item3.desc
    }
  ];

  return (
    <div className="aboutme-page container animate-slide-up">
      {/* 2-Column Split: Text & Contact Socials Card */}
      <div className="aboutme-grid">
        <div className="aboutme-text">
          <span className="aboutme-title">{t.about.title}</span>
          <h2 className="aboutme-heading">{heading}</h2>
          <p className="aboutme-p">{p1}</p>
          {p2 && <p className="aboutme-p">{p2}</p>}
          {p3 && <p className="aboutme-p">{p3}</p>}
        </div>

        {/* Minimal Connect & Contact Column */}
        <div className="stats-container">
          <h3 className="contact-section-title">{t.about.contact.title}</h3>
          
          {/* Email Card */}
          <div className="stat-card glass-panel">
            <div className="stat-icon">✉️</div>
            <div className="stat-info">
              <span className="stat-label">{t.about.contact.email}</span>
              <a href={`mailto:${email}`} className="stat-value contact-link">
                {email}
              </a>
            </div>
          </div>

          {/* Phone Card */}
          <div className="stat-card glass-panel">
            <div className="stat-icon">📞</div>
            <div className="stat-info">
              <span className="stat-label">{t.about.contact.phone}</span>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="stat-value contact-link">
                {phone}
              </a>
            </div>
          </div>

          {/* GitHub Card */}
          <div className="stat-card glass-panel">
            <div className="stat-icon">
              <img
                src={githubIcon}
                alt="GitHub"
                className="contact-icon-img"
                width="20"
                height="20"
              />
            </div>
            <div className="stat-info">
              <span className="stat-label">{t.about.contact.github}</span>
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="stat-value contact-link"
              >
                {github.replace('https://www.', '').replace('https://', '')}
              </a>
            </div>
          </div>

          {/* LinkedIn Card */}
          <div className="stat-card glass-panel">
            <div className="stat-icon">
              <img
                src={linkedinIcon}
                alt="LinkedIn"
                className="contact-icon-img"
                width="20"
                height="20"
              />
            </div>
            <div className="stat-info">
              <span className="stat-label">{t.about.contact.linkedin}</span>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="stat-value contact-link"
              >
                {linkedin.replace('https://www.', '').replace('https://', '')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Journey Milestone Timeline */}
      <div className="timeline-section">
        <h3 className="timeline-header">{t.about.timeline.title}</h3>
        
        <div className="timeline-container">
          {timelineItems.map((exp) => {
            const year = language === 'tr' ? exp.year_tr : exp.year_en;
            const title = language === 'tr' ? exp.title_tr : exp.title_en;
            const desc = language === 'tr' ? exp.desc_tr : exp.desc_en;

            return (
              <div key={exp.id} className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-card glass-panel">
                  <span className="timeline-year">{year}</span>
                  <h4 className="timeline-jobtitle">{title}</h4>
                  <span className="timeline-company">{exp.company}</span>
                  <p className="timeline-desc">{desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default AboutMe;
