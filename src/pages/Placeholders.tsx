import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import type { ProjectData } from '../context/DataContext';
import { db } from '../firebaseconfig';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import './Placeholders.css';

// -------------------------------------------------------------
// 1. Experiences Dynamic Component
// -------------------------------------------------------------
export const ExperiencesPlaceholder: React.FC = () => {
  const { t, language } = useLanguage();
  const { experiences } = useData();

  // Custom order sorting
  const displayExperiences = experiences.length > 0 ? experiences : [
    {
      id: 'static-1',
      company: t.about.timeline.item1.company,
      year_en: t.about.timeline.item1.year,
      year_tr: t.about.timeline.item1.year,
      title_en: t.about.timeline.item1.title,
      title_tr: t.about.timeline.item1.title,
      desc_en: t.about.timeline.item1.desc,
      desc_tr: t.about.timeline.item1.desc,
      order: 1
    },
    {
      id: 'static-2',
      company: t.about.timeline.item2.company,
      year_en: t.about.timeline.item2.year,
      year_tr: t.about.timeline.item2.year,
      title_en: t.about.timeline.item2.title,
      title_tr: t.about.timeline.item2.title,
      desc_en: t.about.timeline.item2.desc,
      desc_tr: t.about.timeline.item2.desc,
      order: 2
    },
    {
      id: 'static-3',
      company: t.about.timeline.item3.company,
      year_en: t.about.timeline.item3.year,
      year_tr: t.about.timeline.item3.year,
      title_en: t.about.timeline.item3.title,
      title_tr: t.about.timeline.item3.title,
      desc_en: t.about.timeline.item3.desc,
      desc_tr: t.about.timeline.item3.desc,
      order: 3
    }
  ];

  return (
    <section className="placeholder-section container animate-slide-up">
      <div className="placeholder-icon">💼</div>
      <h2 className="placeholder-title">{t.placeholders.experiences.title}</h2>
      <span className="placeholder-subtitle" style={{ marginBottom: '3rem', display: 'block' }}>
        {t.placeholders.experiences.subtitle}
      </span>
      
      <div className="dynamic-timeline">
        {displayExperiences.map((exp, idx) => {
          const year = language === 'tr' ? exp.year_tr : exp.year_en;
          const title = language === 'tr' ? exp.title_tr : exp.title_en;
          const desc = language === 'tr' ? exp.desc_tr : exp.desc_en;

          return (
            <div key={exp.id} className="timeline-card-wrapper">
              <div className="timeline-card-marker">
                <span className="marker-dot"></span>
                {idx < displayExperiences.length - 1 && <span className="marker-line"></span>}
              </div>
              <div className="timeline-detail-card glass-panel">
                <div className="timeline-card-head">
                  <span className="exp-year-badge">{year}</span>
                  <h3 className="exp-job-title">{title}</h3>
                  <span className="exp-company-label">{exp.company}</span>
                </div>
                <p className="exp-desc-p">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 2. Projects Dynamic Component
// -------------------------------------------------------------
// Standalone stateful card component to support screenshot slides and Play Store links
const ProjectCard: React.FC<{ 
  proj: ProjectData; 
  language: string; 
  onSelect: (id: string) => void; 
}> = ({ proj, language, onSelect }) => {
  const desc = language === 'tr' ? proj.description_tr : proj.description_en;
  const techList = proj.tech.split(',').map(tag => tag.trim());
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = proj.screenshots && proj.screenshots.length > 0 
    ? proj.screenshots 
    : (proj.imageUrl ? [proj.imageUrl] : []);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(prev => (prev + 1) % slides.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="project-grid-card glass-panel" onClick={() => onSelect(proj.id)}>
      {/* Slider / Image Showcase */}
      {slides.length > 0 ? (
        <div className="proj-card-img-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
          <img 
            src={slides[activeSlide]} 
            alt={`${proj.name} Screenshot ${activeSlide + 1}`} 
            className="proj-card-img" 
            style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
          />

          {slides.length > 1 && (
            <>
              <button 
                onClick={prevSlide} 
                className="slider-arrow prev" 
                aria-label="Previous screenshot"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  zIndex: 2,
                  transition: 'background 0.2s'
                }}
              >
                ◀
              </button>
              <button 
                onClick={nextSlide} 
                className="slider-arrow next" 
                aria-label="Next screenshot"
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  zIndex: 2,
                  transition: 'background 0.2s'
                }}
              >
                ▶
              </button>

              {/* Slide dots */}
              <div className="slider-dots" style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '6px',
                zIndex: 2
              }}>
                {slides.map((_, idx) => (
                  <span 
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: idx === activeSlide ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="proj-card-img-placeholder">
          <span>{proj.name.substring(0, 2).toUpperCase()}</span>
        </div>
      )}

      <div className="proj-card-body">
        <h3 className="proj-card-title">{proj.name}</h3>
        
        {/* Tech Pills */}
        <div className="proj-card-tech-grid">
          {techList.map((tech, idx) => (
            <span key={idx} className="tech-pill-badge">{tech}</span>
          ))}
        </div>

        <p className="proj-card-desc">{desc}</p>
        
        {/* Actions grid */}
        <div className="proj-card-actions">
          {proj.githubUrl && (
            <a 
              href={proj.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary btn-small"
              onClick={(e) => e.stopPropagation()}
            >
              GitHub Repo
            </a>
          )}
          {proj.playstoreUrl && (
            <a 
              href={proj.playstoreUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-secondary btn-small"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              onClick={(e) => e.stopPropagation()}
            >
              📱 Google Play
            </a>
          )}
          {proj.liveUrl && (
            <a 
              href={proj.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary btn-small"
              onClick={(e) => e.stopPropagation()}
            >
              Live Demo 🌐
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Projects Dynamic Component
// -------------------------------------------------------------
interface ProjectsPlaceholderProps {
  onSelectProject: (id: string) => void;
}

export const ProjectsPlaceholder: React.FC<ProjectsPlaceholderProps> = ({ onSelectProject }) => {
  const { t, language } = useLanguage();
  const { projects } = useData();

  // Fallback if no projects exist in database
  const displayProjects = projects.length > 0 ? projects : [
    {
      id: 'p-static-1',
      name: 'Umut.dev Portfolio',
      tech: 'React, TypeScript, Firebase, CSS Grid',
      imageUrl: '',
      githubUrl: 'https://github.com/UmutDiler0',
      liveUrl: 'https://personalwebsite-711b9.firebaseapp.com',
      description_en: 'This very personal portfolio website, designed from the ground up to support high-contrast minimal aesthetics, dark mode switching, real-time message forms, and an integrated management panel.',
      description_tr: 'Yüksek kontrastlı minimal estetik, karanlık mod geçişi, gerçek zamanlı mesaj formları ve entegre bir yönetim panelini desteklemek için sıfırdan tasarlanmış bu kişisel portföy web sitesi.',
      order: 1
    }
  ];

  return (
    <section className="placeholder-section container animate-slide-up">
      <div className="placeholder-icon">🚀</div>
      <h2 className="placeholder-title">{t.placeholders.projects.title}</h2>
      <span className="placeholder-subtitle" style={{ marginBottom: '3rem', display: 'block' }}>
        {t.placeholders.projects.subtitle}
      </span>

      <div className="projects-grid">
        {displayProjects.map((proj) => (
          <ProjectCard key={proj.id} proj={proj} language={language} onSelect={onSelectProject} />
        ))}
      </div>
    </section>
  );
};

// -------------------------------------------------------------
// 3. Connections - Firebase-Integrated Form & Counter
// -------------------------------------------------------------
export const Connections: React.FC = () => {
  const { t } = useLanguage();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [totalInteractions, setTotalInteractions] = useState<number | null>(null);

  // Fetch total message interactions from Firebase on load
  const fetchInteractions = async () => {
    try {
      const messagesCol = collection(db, 'messages');
      const snapshot = await getDocs(messagesCol);
      setTotalInteractions(snapshot.size);
    } catch (error) {
      console.error("Error reading from Firebase:", error);
    }
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      // Reference to the messages collection in firestore
      const messagesRef = collection(db, 'messages');
      
      // Save data
      await addDoc(messagesRef, {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        timestamp: serverTimestamp()
      });

      // Clear input fields
      setName('');
      setEmail('');
      setMessage('');

      // Show positive response feedback
      setFeedback({
        type: 'success',
        text: t.placeholders.connections.formSuccess
      });

      // Refresh interactions total count
      fetchInteractions();
    } catch (error: any) {
      console.error("Firebase submit error:", error);
      setFeedback({
        type: 'error',
        text: error?.message || 'Error occurred while connecting to Firebase. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="placeholder-section container animate-slide-up">
      <div className="placeholder-icon">📬</div>
      <h2 className="placeholder-title">{t.placeholders.connections.title}</h2>
      <p className="placeholder-desc" style={{ textAlign: 'center', margin: '0 auto 4rem' }}>
        {t.placeholders.connections.desc}
      </p>

      <div className="connections-container">
        {/* Connection details / stats info */}
        <div className="connections-info">
          <div className="contact-card glass-panel">
            <h3 className="contact-card-title">Firebase Cloud Integration</h3>
            <p className="aboutme-p" style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Messages submitted on this portal sync automatically with standard Firestore database rules in real-time.
            </p>
            
            {/* Live Service Status Badge */}
            <div className="firebase-status-badge">
              <span className="firebase-badge-dot"></span>
              <span>Firebase Service: Online</span>
            </div>

            {/* Total interactions counter from Firebase */}
            {totalInteractions !== null && (
              <div className="firebase-counter">
                <span>📊</span>
                <span>
                  {t.placeholders.connections.visitCount}: <strong>{totalInteractions}</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="contact-form glass-panel">
          {feedback && (
            <div className={`form-feedback ${feedback.type}`}>
              {feedback.text}
            </div>
          )}

          {/* Name */}
          <div className="form-group">
            <label htmlFor="form-name" className="form-label">
              {t.placeholders.connections.formName}
            </label>
            <input
              id="form-name"
              type="text"
              required
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="form-email" className="form-label">
              {t.placeholders.connections.formEmail}
            </label>
            <input
              id="form-email"
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="form-message" className="form-label">
              {t.placeholders.connections.formMessage}
            </label>
            <textarea
              id="form-message"
              required
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="form-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span>⏳</span>
                <span>{t.placeholders.connections.formSending}</span>
              </>
            ) : (
              <>
                <span>✉️</span>
                <span>{t.placeholders.connections.formSubmit}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
