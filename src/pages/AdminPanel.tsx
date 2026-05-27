import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import type { ProfileData, ExperienceData, ProjectData } from '../context/DataContext';
import { translations } from '../i18n/translations';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, auth } from '../firebaseconfig';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import './AdminPanel.css';

type AdminTab = 'profile' | 'experiences' | 'projects';

export const AdminPanel: React.FC = () => {
  const { 
    profile, 
    experiences, 
    projects, 
    saveProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addProject,
    updateProject,
    deleteProject
  } = useData();

  const [activeSubTab, setActiveSubTab] = useState<AdminTab>('profile');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'info' | 'success' | 'error'>('info');

  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSigningIn(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      if (errorMsg.includes('auth/invalid-credential') || errorMsg.includes('auth/user-not-found') || errorMsg.includes('auth/wrong-password')) {
        setLoginError('Invalid email or password.');
      } else {
        setLoginError(errorMsg);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error", err);
    }
  };

  // -------------------------------------------------------------
  // 1. PROFILE STATE & INITIALIZATION
  // -------------------------------------------------------------
  const [profileForm, setProfileForm] = useState<ProfileData>({
    phone: '',
    email: '',
    github: '',
    linkedin: '',
    cvUrl: '',
    greeting_en: '',
    greeting_tr: '',
    title_en: '',
    title_tr: '',
    subtitle_en: '',
    subtitle_tr: '',
    heading_en: '',
    heading_tr: '',
    p1_en: '',
    p1_tr: '',
    p2_en: '',
    p2_tr: '',
    p3_en: '',
    p3_tr: '',
  });

  useEffect(() => {
    if (profile) {
      setProfileForm(profile);
    } else {
      // Prefill with local translations
      const en = translations.en;
      const tr = translations.tr;
      setProfileForm({
        phone: '+90 534 062 20 26',
        email: 'umutdilerr0@gmail.com',
        github: 'https://github.com/UmutDiler0',
        linkedin: 'https://www.linkedin.com/in/umut-dilerr/',
        cvUrl: '',
        greeting_en: en.hero.greeting,
        greeting_tr: tr.hero.greeting,
        title_en: en.hero.title,
        title_tr: tr.hero.title,
        subtitle_en: en.hero.subtitle,
        subtitle_tr: tr.hero.subtitle,
        heading_en: en.about.heading,
        heading_tr: tr.about.heading,
        p1_en: en.about.p1,
        p1_tr: tr.about.p1,
        p2_en: en.about.p2,
        p2_tr: tr.about.p2,
        p3_en: en.about.p3,
        p3_tr: tr.about.p3,
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving Profile...');
    setStatusType('info');
    try {
      await saveProfile(profileForm);
      showTemporaryStatus('Profile saved successfully!', 'success');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      showTemporaryStatus(`Failed to save profile: ${errorMsg}`, 'error');
      console.error(err);
    }
  };

  // -------------------------------------------------------------
  // 2. EXPERIENCES STATE & OPERATIONS
  // -------------------------------------------------------------
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<Omit<ExperienceData, 'id'>>({
    company: '',
    order: 0,
    year_en: '',
    year_tr: '',
    title_en: '',
    title_tr: '',
    desc_en: '',
    desc_tr: '',
  });

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'order') {
      setExpForm(prev => ({ ...prev, order: parseInt(value) || 0 }));
    } else {
      setExpForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleExpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus(editingExpId ? 'Updating Experience...' : 'Adding Experience...');
    setStatusType('info');
    try {
      if (editingExpId) {
        await updateExperience(editingExpId, expForm);
        setEditingExpId(null);
        showTemporaryStatus('Experience updated successfully!', 'success');
      } else {
        await addExperience(expForm);
        showTemporaryStatus('Experience added successfully!', 'success');
      }
      resetExpForm();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      showTemporaryStatus(`Operation failed: ${errorMsg}`, 'error');
      console.error(err);
    }
  };

  const startEditExp = (exp: ExperienceData) => {
    setEditingExpId(exp.id);
    setExpForm({
      company: exp.company,
      order: exp.order,
      year_en: exp.year_en,
      year_tr: exp.year_tr,
      title_en: exp.title_en,
      title_tr: exp.title_tr,
      desc_en: exp.desc_en,
      desc_tr: exp.desc_tr,
    });
  };

  const resetExpForm = () => {
    setEditingExpId(null);
    setExpForm({
      company: '',
      order: experiences.length + 1,
      year_en: '',
      year_tr: '',
      title_en: '',
      title_tr: '',
      desc_en: '',
      desc_tr: '',
    });
  };

  const handleDeleteExp = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      setSaveStatus('Deleting...');
      setStatusType('info');
      try {
        await deleteExperience(id);
        showTemporaryStatus('Deleted successfully!', 'success');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        showTemporaryStatus(`Failed to delete: ${errorMsg}`, 'error');
        console.error(err);
      }
    }
  };

  // -------------------------------------------------------------
  // 3. PROJECTS STATE & OPERATIONS
  // -------------------------------------------------------------
  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [projForm, setProjForm] = useState<Omit<ProjectData, 'id'>>({
    name: '',
    tech: '',
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    playstoreUrl: '',
    screenshots: [],
    description_en: '',
    description_tr: '',
    order: 0,
  });

  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [existingScreenshots, setExistingScreenshots] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalCount = existingScreenshots.length + screenshotFiles.length + filesArray.length;
      if (totalCount > 3) {
        alert("Maximum 3 images allowed / En fazla 3 ekran görüntüsü yükleyebilirsiniz.");
        return;
      }
      setScreenshotFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setScreenshotFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const removeExistingScreenshot = (index: number) => {
    setExistingScreenshots(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleProjChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'order') {
      setProjForm(prev => ({ ...prev, order: parseInt(value) || 0 }));
    } else {
      setProjForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleProjSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setSaveStatus('Saving screenshots to Storage...');
    setStatusType('info');
    try {
      const cleanName = projForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Upload new screenshots
      const uploadPromises = screenshotFiles.map(async (file, index) => {
        const fileExt = file.name.split('.').pop() || 'png';
        const uniqueIndex = existingScreenshots.length + index + 1;
        // Storage name example: projects/languageroad/languageroad_1.png
        const storageRef = ref(storage, `projects/${cleanName}/${cleanName}_${uniqueIndex}.${fileExt}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      });

      const newUrls = await Promise.all(uploadPromises);
      const finalScreenshots = [...existingScreenshots, ...newUrls];

      // Automatic main image URL fallback
      let mainImg = projForm.imageUrl;
      if (!mainImg && finalScreenshots.length > 0) {
        mainImg = finalScreenshots[0];
      }

      const submissionData = {
        ...projForm,
        imageUrl: mainImg,
        screenshots: finalScreenshots,
      };

      setSaveStatus(editingProjId ? 'Updating Project...' : 'Adding Project...');
      
      if (editingProjId) {
        await updateProject(editingProjId, submissionData);
        setEditingProjId(null);
        showTemporaryStatus('Project updated successfully!', 'success');
      } else {
        await addProject(submissionData);
        showTemporaryStatus('Project added successfully!', 'success');
      }
      resetProjForm();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      showTemporaryStatus(`Operation failed: ${errorMsg}`, 'error');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const startEditProj = (proj: ProjectData) => {
    setEditingProjId(proj.id);
    setProjForm({
      name: proj.name,
      tech: proj.tech,
      imageUrl: proj.imageUrl,
      githubUrl: proj.githubUrl,
      liveUrl: proj.liveUrl,
      playstoreUrl: proj.playstoreUrl || '',
      screenshots: proj.screenshots || [],
      description_en: proj.description_en,
      description_tr: proj.description_tr,
      order: proj.order,
    });
    setExistingScreenshots(proj.screenshots || []);
    setScreenshotFiles([]);
  };

  const resetProjForm = () => {
    setEditingProjId(null);
    setProjForm({
      name: '',
      tech: '',
      imageUrl: '',
      githubUrl: '',
      liveUrl: '',
      playstoreUrl: '',
      screenshots: [],
      description_en: '',
      description_tr: '',
      order: projects.length + 1,
    });
    setExistingScreenshots([]);
    setScreenshotFiles([]);
  };

  const handleDeleteProj = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setSaveStatus('Deleting...');
      setStatusType('info');
      try {
        await deleteProject(id);
        showTemporaryStatus('Project deleted.', 'success');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        showTemporaryStatus(`Failed to delete project: ${errorMsg}`, 'error');
        console.error(err);
      }
    }
  };

  // Helpers
  const showTemporaryStatus = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setSaveStatus(msg);
    setStatusType(type);
    setTimeout(() => {
      setSaveStatus(null);
    }, 5000);
  };

  if (loadingAuth) {
    return (
      <div className="admin-page container animate-slide-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loading-spinner-container" style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Verifying credentials / Kimlik doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page container animate-slide-up" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '2rem 1.25rem' }}>
        <div className="login-card glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--border-color)', boxShadow: 'var(--card-shadow), 0 20px 40px rgba(0, 0, 0, 0.12)', background: 'var(--card-bg)' }}>
          
          <div className="login-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="login-icon" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</div>
            <h2 className="login-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Admin Portal</h2>
            <p className="login-subtitle" style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Enter your email and password to gain access.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {loginError && (
              <div className="login-error-alert" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: 'var(--border-radius-sm)', padding: '0.75rem 1rem', fontSize: '0.85rem', fontWeight: 500, animation: 'slideUp 0.3s ease-out' }}>
                ⚠️ {loginError}
              </div>
            )}

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
              <input 
                type="email" 
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                disabled={isSigningIn}
                style={{ padding: '0.75rem 0.95rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'var(--transition-smooth)', fontSize: '0.92rem' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="••••••••"
                disabled={isSigningIn}
                style={{ padding: '0.75rem 0.95rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-primary)', color: 'var(--text-primary)', transition: 'var(--transition-smooth)', fontSize: '0.92rem' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSigningIn}
              style={{ padding: '0.8rem 1.5rem', width: '100%', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {isSigningIn ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid transparent', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  Signing In...
                </>
              ) : (
                '🔓 Authenticate'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page container animate-slide-up">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 className="admin-main-title">Yönetim Paneli / Admin Dashboard</h2>
          <p className="admin-subtitle">Manage Profile, Experiences, and Projects stored on Firebase Firestore.</p>
        </div>
        <button onClick={handleSignOut} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          🚪 Sign Out / Çıkış Yap
        </button>
        
        {saveStatus && (
          <div className={`admin-status-toast ${statusType}`}>
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Subsection Navigation Tabs */}
      <div className="admin-tab-bar">
        <button 
          className={`admin-tab-btn ${activeSubTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('profile')}
        >
          👤 Profile Information
        </button>
        <button 
          className={`admin-tab-btn ${activeSubTab === 'experiences' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('experiences')}
        >
          💼 Experiences ({experiences.length})
        </button>
        <button 
          className={`admin-tab-btn ${activeSubTab === 'projects' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('projects')}
        >
          📂 Projects ({projects.length})
        </button>
      </div>

      <div className="admin-content-card glass-panel">
        
        {/* =========================================================
            SUBSECTION 1: PROFILE
            ========================================================= */}
        {activeSubTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="admin-form">
            <h3 className="form-section-title">Edit Personal Details</h3>
            
            <div className="form-row-grid">
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={profileForm.email} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  name="phone" 
                  value={profileForm.phone} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-row-grid">
              <div className="form-group">
                <label>GitHub Profile URL</label>
                <input 
                  type="url" 
                  name="github" 
                  value={profileForm.github} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>LinkedIn Profile URL</label>
                <input 
                  type="url" 
                  name="linkedin" 
                  value={profileForm.linkedin} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>CV Download Link / Document URL (Download CV Action)</label>
              <input 
                type="text" 
                name="cvUrl" 
                value={profileForm.cvUrl} 
                onChange={handleProfileChange} 
                placeholder="e.g. https://example.com/my-cv.pdf"
              />
            </div>

            <hr className="form-divider" />
            <h4 className="form-subtitle">English Localization (EN)</h4>
            
            <div className="form-row-grid">
              <div className="form-group">
                <label>Greeting (EN)</label>
                <input 
                  type="text" 
                  name="greeting_en" 
                  value={profileForm.greeting_en} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Hero Title (EN)</label>
                <input 
                  type="text" 
                  name="title_en" 
                  value={profileForm.title_en} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Hero Subtitle (EN)</label>
              <textarea 
                name="subtitle_en" 
                value={profileForm.subtitle_en} 
                onChange={handleProfileChange} 
                rows={3} 
                required 
              />
            </div>

            <div className="form-group">
              <label>About Heading (EN)</label>
              <input 
                type="text" 
                name="heading_en" 
                value={profileForm.heading_en} 
                onChange={handleProfileChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>About Description - Paragraph 1 (EN)</label>
              <textarea 
                name="p1_en" 
                value={profileForm.p1_en} 
                onChange={handleProfileChange} 
                rows={3} 
                required 
              />
            </div>

            <div className="form-group">
              <label>About Description - Paragraph 2 (EN)</label>
              <textarea 
                name="p2_en" 
                value={profileForm.p2_en} 
                onChange={handleProfileChange} 
                rows={3} 
              />
            </div>

            <div className="form-group">
              <label>About Description - Paragraph 3 (EN)</label>
              <textarea 
                name="p3_en" 
                value={profileForm.p3_en} 
                onChange={handleProfileChange} 
                rows={3} 
              />
            </div>

            <hr className="form-divider" />
            <h4 className="form-subtitle">Turkish Localization (TR)</h4>

            <div className="form-row-grid">
              <div className="form-group">
                <label>Greeting (TR)</label>
                <input 
                  type="text" 
                  name="greeting_tr" 
                  value={profileForm.greeting_tr} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Hero Title (TR)</label>
                <input 
                  type="text" 
                  name="title_tr" 
                  value={profileForm.title_tr} 
                  onChange={handleProfileChange} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Hero Subtitle (TR)</label>
              <textarea 
                name="subtitle_tr" 
                value={profileForm.subtitle_tr} 
                onChange={handleProfileChange} 
                rows={3} 
                required 
              />
            </div>

            <div className="form-group">
              <label>About Heading (TR)</label>
              <input 
                type="text" 
                name="heading_tr" 
                value={profileForm.heading_tr} 
                onChange={handleProfileChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>About Description - Paragraph 1 (TR)</label>
              <textarea 
                name="p1_tr" 
                value={profileForm.p1_tr} 
                onChange={handleProfileChange} 
                rows={3} 
                required 
              />
            </div>

            <div className="form-group">
              <label>About Description - Paragraph 2 (TR)</label>
              <textarea 
                name="p2_tr" 
                value={profileForm.p2_tr} 
                onChange={handleProfileChange} 
                rows={3} 
              />
            </div>

            <div className="form-group">
              <label>About Description - Paragraph 3 (TR)</label>
              <textarea 
                name="p3_tr" 
                value={profileForm.p3_tr} 
                onChange={handleProfileChange} 
                rows={3} 
              />
            </div>

            <div className="form-actions-bar">
              <button type="submit" className="btn btn-primary">
                💾 Save Profile Changes
              </button>
            </div>
          </form>
        )}

        {/* =========================================================
            SUBSECTION 2: EXPERIENCES
            ========================================================= */}
        {activeSubTab === 'experiences' && (
          <div className="admin-split-layout">
            
            {/* Experience List (Left Column) */}
            <div className="admin-list-pane">
              <h3 className="form-section-title">Current Experiences</h3>
              {experiences.length === 0 ? (
                <p className="no-items-text">No experiences found. Fallbacks are active.</p>
              ) : (
                <div className="admin-list-container">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="admin-item-card">
                      <div className="admin-item-header">
                        <span className="item-order-badge">#{exp.order}</span>
                        <h4 className="item-title">{exp.title_en}</h4>
                        <span className="item-meta">{exp.company} | {exp.year_en}</span>
                      </div>
                      <div className="admin-item-actions">
                        <button 
                          className="btn-text btn-text-edit"
                          onClick={() => startEditExp(exp)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn-text btn-text-delete"
                          onClick={() => handleDeleteExp(exp.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Experience Form (Right Column) */}
            <form onSubmit={handleExpSubmit} className="admin-form form-pane">
              <h3 className="form-section-title">
                {editingExpId ? '✏️ Edit Experience' : '➕ Add Experience'}
              </h3>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Company / Organization Name</label>
                  <input 
                    type="text" 
                    name="company" 
                    value={expForm.company} 
                    onChange={handleExpChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Sort Order Index</label>
                  <input 
                    type="number" 
                    name="order" 
                    value={expForm.order} 
                    onChange={handleExpChange} 
                    min="0"
                    required 
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Years / Duration (EN)</label>
                  <input 
                    type="text" 
                    name="year_en" 
                    value={expForm.year_en} 
                    onChange={handleExpChange} 
                    placeholder="e.g. 2024 - Present"
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Years / Duration (TR)</label>
                  <input 
                    type="text" 
                    name="year_tr" 
                    value={expForm.year_tr} 
                    onChange={handleExpChange} 
                    placeholder="örn: 2024 - Günümüz"
                    required 
                  />
                </div>
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Job Title (EN)</label>
                  <input 
                    type="text" 
                    name="title_en" 
                    value={expForm.title_en} 
                    onChange={handleExpChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Job Title (TR)</label>
                  <input 
                    type="text" 
                    name="title_tr" 
                    value={expForm.title_tr} 
                    onChange={handleExpChange} 
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Job Description (EN)</label>
                <textarea 
                  name="desc_en" 
                  value={expForm.desc_en} 
                  onChange={handleExpChange} 
                  rows={4} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Job Description (TR)</label>
                <textarea 
                  name="desc_tr" 
                  value={expForm.desc_tr} 
                  onChange={handleExpChange} 
                  rows={4} 
                  required 
                />
              </div>

              <div className="form-actions-bar">
                {editingExpId && (
                  <button type="button" className="btn btn-secondary" onClick={resetExpForm}>
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {editingExpId ? 'Save Changes' : 'Add Experience'}
                </button>
              </div>
            </form>

          </div>
        )}

        {/* =========================================================
            SUBSECTION 3: PROJECTS
            ========================================================= */}
        {activeSubTab === 'projects' && (
          <div className="admin-split-layout">

            {/* Projects List (Left Column) */}
            <div className="admin-list-pane">
              <h3 className="form-section-title">Current Projects</h3>
              {projects.length === 0 ? (
                <p className="no-items-text">No projects found. Fallbacks are active.</p>
              ) : (
                <div className="admin-list-container">
                  {projects.map((proj) => (
                    <div key={proj.id} className="admin-item-card">
                      <div className="admin-item-header">
                        <span className="item-order-badge">#{proj.order}</span>
                        <h4 className="item-title">{proj.name}</h4>
                        <span className="item-meta">{proj.tech}</span>
                      </div>
                      <div className="admin-item-actions">
                        <button 
                          className="btn-text btn-text-edit"
                          onClick={() => startEditProj(proj)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn-text btn-text-delete"
                          onClick={() => handleDeleteProj(proj.id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Form (Right Column) */}
            <form onSubmit={handleProjSubmit} className="admin-form form-pane">
              <h3 className="form-section-title">
                {editingProjId ? '✏️ Edit Project' : '➕ Add Project'}
              </h3>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>Project Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={projForm.name} 
                    onChange={handleProjChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Sort Order Index</label>
                  <input 
                    type="number" 
                    name="order" 
                    value={projForm.order} 
                    onChange={handleProjChange} 
                    min="0"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tech Stack / Technologies (comma separated)</label>
                <input 
                  type="text" 
                  name="tech" 
                  value={projForm.tech} 
                  onChange={handleProjChange} 
                  placeholder="e.g. React, TypeScript, Firebase, CSS"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Image URL / Photo Link</label>
                <input 
                  type="text" 
                  name="imageUrl" 
                  value={projForm.imageUrl} 
                  onChange={handleProjChange} 
                  placeholder="e.g. https://images.unsplash.com/... or relative path"
                />
              </div>

              <div className="form-row-grid">
                <div className="form-group">
                  <label>GitHub Repository URL</label>
                  <input 
                    type="url" 
                    name="githubUrl" 
                    value={projForm.githubUrl} 
                    onChange={handleProjChange} 
                    placeholder="https://github.com/..."
                  />
                </div>
                <div className="form-group">
                  <label>Play Store / App URL</label>
                  <input 
                    type="url" 
                    name="playstoreUrl" 
                    value={projForm.playstoreUrl || ''} 
                    onChange={handleProjChange} 
                    placeholder="https://play.google.com/..."
                  />
                </div>
                <div className="form-group">
                  <label>Live Demo / Deployment URL</label>
                  <input 
                    type="url" 
                    name="liveUrl" 
                    value={projForm.liveUrl} 
                    onChange={handleProjChange} 
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Screenshots / Pictures (Upload up to 3 images to Storage)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={handleScreenshotFileChange} 
                  className="file-input-field"
                  disabled={isUploading}
                />
                <span className="form-input-help" style={{ display: 'block', marginTop: '0.4rem', fontSize: '0.8rem', opacity: 0.8 }}>
                  Select up to 3 screenshots. They will be saved to Firebase Storage as <code>projects/projectname/projectname_X.png</code>.
                </span>
              </div>

              {/* Selected screenshots list */}
              {screenshotFiles.length > 0 && (
                <div className="screenshot-previews-container" style={{ margin: '1rem 0' }}>
                  <h5 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Uploads:</h5>
                  <div className="preview-grid" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {screenshotFiles.map((file, idx) => (
                      <div key={idx} className="preview-card" style={{ display: 'flex', alignItems: 'center', background: 'var(--border-color)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', gap: '0.5rem' }}>
                        <span>{file.name}</span>
                        <button 
                          type="button" 
                          className="btn-text btn-text-delete" 
                          onClick={() => removeSelectedFile(idx)}
                          style={{ color: '#ff4444', border: 'none', background: 'none', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved screenshots list */}
              {existingScreenshots.length > 0 && (
                <div className="screenshot-previews-container" style={{ margin: '1rem 0' }}>
                  <h5 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saved Screenshots ({existingScreenshots.length}):</h5>
                  <div className="preview-grid" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {existingScreenshots.map((url, idx) => (
                      <div key={idx} className="preview-card-image" style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                          src={url} 
                          alt={`Screenshot ${idx+1}`} 
                          className="preview-thumbnail" 
                          style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} 
                        />
                        <button 
                          type="button" 
                          className="btn-text btn-text-delete" 
                          onClick={() => removeExistingScreenshot(idx)}
                          style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ff4444', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', cursor: 'pointer' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Project Description (EN)</label>
                <textarea 
                  name="description_en" 
                  value={projForm.description_en} 
                  onChange={handleProjChange} 
                  rows={4} 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Project Description (TR)</label>
                <textarea 
                  name="description_tr" 
                  value={projForm.description_tr} 
                  onChange={handleProjChange} 
                  rows={4} 
                  required 
                />
              </div>

              <div className="form-actions-bar">
                {editingProjId && (
                  <button type="button" className="btn btn-secondary" onClick={resetProjForm}>
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {editingProjId ? 'Save Changes' : 'Add Project'}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
