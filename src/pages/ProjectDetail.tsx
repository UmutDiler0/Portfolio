import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import './ProjectDetail.css';

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ projectId, onBack }) => {
  const { language } = useLanguage();
  const { projects } = useData();
  const [activeSlide, setActiveSlide] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Find project in the database list
  let proj = projects.find(p => p.id === projectId);

  // Fallback to static portfolio project if it matches ID or if list is empty and matching ID
  if (!proj && (projectId === 'p-static-1' || projects.length === 0)) {
    proj = {
      id: 'p-static-1',
      name: 'Umut.dev Portfolio',
      tech: 'React, TypeScript, Firebase, CSS Grid',
      imageUrl: '',
      githubUrl: 'https://github.com/UmutDiler0',
      liveUrl: 'https://personalwebsite-711b9.firebaseapp.com',
      description_en: 'This very personal portfolio website, designed from the ground up to support high-contrast minimal aesthetics, dark mode switching, real-time message forms, and an integrated management panel.',
      description_tr: 'Yüksek kontrastlı minimal estetik, karanlık mod geçişi, gerçek zamanlı mesaj formları ve entegre bir yönetim panelini desteklemek için sıfırdan tasarlanmış bu kişisel portföy web sitesi.',
      order: 1
    };
  }

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSlide(0); // Reset slide on project change
  }, [projectId]);

  if (!proj) {
    return (
      <section className="project-detail-section container animate-slide-up">
        <div className="detail-error-card glass-panel">
          <span className="error-icon">🔍</span>
          <h2>{language === 'tr' ? 'Proje Bulunamadı' : 'Project Not Found'}</h2>
          <p>
            {language === 'tr' 
              ? 'Aradığınız proje mevcut değil veya yüklenirken bir sorun oluştu.' 
              : 'The project you are looking for does not exist or there was a problem loading it.'}
          </p>
          <button onClick={onBack} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            {language === 'tr' ? 'Geri Dön' : 'Go Back'}
          </button>
        </div>
      </section>
    );
  }

  const desc = language === 'tr' ? proj.description_tr : proj.description_en;
  const techList = proj.tech.split(',').map(tag => tag.trim());
  
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

  // Deduce platform from links
  const isMobile = !!proj.playstoreUrl;
  const hostingPlatform = proj.liveUrl 
    ? (proj.liveUrl.includes('firebaseapp') || proj.liveUrl.includes('web.app') ? 'Firebase Hosting' : 'Vercel')
    : 'GitHub Pages';

  return (
    <section className="project-detail-section container animate-slide-up">
      {/* Back Button Action Bar */}
      <div className="detail-navigation">
        <button onClick={onBack} className="back-btn-link" aria-label="Go Back to Projects">
          <svg className="back-arrow-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span>{language === 'tr' ? 'Projelere Geri Dön' : 'Back to Projects'}</span>
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="project-detail-grid">
        
        {/* Left Column: Media Slideshow & Content */}
        <div className="detail-main-col">
          <div className="detail-media-card glass-panel">
            {slides.length > 0 ? (
              <div className="detail-slideshow">
                <div className="detail-slide-wrapper" onClick={() => setLightboxOpen(true)}>
                  <img 
                    src={slides[activeSlide]} 
                    alt={`${proj.name} Detail view ${activeSlide + 1}`} 
                    className="detail-slide-img" 
                  />
                  <div className="slide-zoom-hint">
                    <span>🔍 {language === 'tr' ? 'Büyütmek için Tıklayın' : 'Click to Zoom'}</span>
                  </div>
                </div>

                {slides.length > 1 && (
                  <>
                    <button onClick={prevSlide} className="slide-arrow prev" aria-label="Previous">◀</button>
                    <button onClick={nextSlide} className="slide-arrow next" aria-label="Next">▶</button>
                    
                    <div className="slide-indicators">
                      {slides.map((_, idx) => (
                        <span 
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setActiveSlide(idx); }}
                          className={`slide-dot ${idx === activeSlide ? 'active' : ''}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="detail-img-placeholder">
                <span>{proj.name.substring(0, 2).toUpperCase()}</span>
              </div>
            )}
          </div>

          {/* Project Narrative/Description */}
          <div className="detail-content-card glass-panel">
            <h1 className="project-detail-title">{proj.name}</h1>
            
            <div className="project-detail-description">
              <h3 className="section-subtitle">{language === 'tr' ? 'Proje Hakkında' : 'About the Project'}</h3>
              {desc.split('\n').map((paragraph, index) => (
                <p key={index} className="narrative-p">{paragraph}</p>
              ))}
            </div>

            {/* CTA action buttons */}
            <div className="project-detail-actions">
              {proj.githubUrl && (
                <a 
                  href={proj.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary"
                >
                  <svg className="cta-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  <span>GitHub Repository</span>
                </a>
              )}
              {proj.playstoreUrl && (
                <a 
                  href={proj.playstoreUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>📱 Google Play Store</span>
                </a>
              )}
              {proj.liveUrl && (
                <a 
                  href={proj.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                >
                  <span>🌐 Live Project Demo</span>
                  <svg className="cta-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Metadata Details Panel */}
        <div className="detail-side-col">
          <div className="metadata-card glass-panel">
            <h3 className="side-card-title">{language === 'tr' ? 'Teknik Detaylar' : 'Technical Details'}</h3>
            
            {/* Tech Stack List */}
            <div className="meta-section">
              <h4 className="meta-subtitle">{language === 'tr' ? 'Kullanılan Teknolojiler' : 'Technologies Used'}</h4>
              <div className="tech-details-grid">
                {techList.map((tech, idx) => (
                  <span key={idx} className="tech-badge-glow">{tech}</span>
                ))}
              </div>
            </div>

            {/* Spec Matrix */}
            <div className="meta-section spec-matrix">
              <div className="spec-row">
                <span className="spec-label">{language === 'tr' ? 'Platform:' : 'Platform:'}</span>
                <span className="spec-value">{isMobile ? (language === 'tr' ? 'Mobil (Android)' : 'Mobile (Android)') : (language === 'tr' ? 'Web Uygulaması' : 'Web Application')}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{language === 'tr' ? 'Barındırma:' : 'Hosting:'}</span>
                <span className="spec-value">{hostingPlatform}</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{language === 'tr' ? 'Veri Kaynağı:' : 'Data Source:'}</span>
                <span className="spec-value">Firestore Realtime DB</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">{language === 'tr' ? 'Durum:' : 'Status:'}</span>
                <span className="spec-value status-completed">● {language === 'tr' ? 'Tamamlandı' : 'Completed'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Full-Screen Lightbox Modal for Screenshots */}
      {lightboxOpen && slides.length > 0 && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close Lightbox">
            &times;
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={slides[activeSlide]} 
              alt={`${proj.name} Fullscreen Screenshot ${activeSlide + 1}`} 
              className="lightbox-img" 
            />
            {slides.length > 1 && (
              <>
                <button 
                  onClick={prevSlide} 
                  className="lightbox-arrow prev" 
                  aria-label="Previous image"
                >
                  ◀
                </button>
                <button 
                  onClick={nextSlide} 
                  className="lightbox-arrow next" 
                  aria-label="Next image"
                >
                  ▶
                </button>
                <div className="lightbox-counter">
                  {activeSlide + 1} / {slides.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectDetail;
