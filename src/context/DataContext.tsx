import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebaseconfig';
import { 
  doc, 
  collection, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export interface ProfileData {
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  cvUrl: string;
  greeting_en: string;
  greeting_tr: string;
  title_en: string;
  title_tr: string;
  subtitle_en: string;
  subtitle_tr: string;
  heading_en: string;
  heading_tr: string;
  p1_en: string;
  p1_tr: string;
  p2_en: string;
  p2_tr: string;
  p3_en: string;
  p3_tr: string;
}

export interface ExperienceData {
  id: string;
  company: string;
  order: number;
  year_en: string;
  year_tr: string;
  title_en: string;
  title_tr: string;
  desc_en: string;
  desc_tr: string;
}

export interface ProjectData {
  id: string;
  name: string;
  tech: string; // Comma separated values (e.g. "React, TypeScript, Firebase")
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  playstoreUrl?: string;
  screenshots?: string[];
  description_en: string;
  description_tr: string;
  order: number;
}

interface DataContextType {
  profile: ProfileData | null;
  experiences: ExperienceData[];
  projects: ProjectData[];
  loading: boolean;
  saveProfile: (data: ProfileData) => Promise<void>;
  addExperience: (exp: Omit<ExperienceData, 'id'>) => Promise<void>;
  updateExperience: (id: string, exp: Partial<ExperienceData>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  addProject: (proj: Omit<ProjectData, 'id'>) => Promise<void>;
  updateProject: (id: string, proj: Partial<ProjectData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to Profile Collection (Document: main)
    const profileDocRef = doc(db, 'profile', 'main');
    const unsubProfile = onSnapshot(profileDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as ProfileData);
      } else {
        // Leave null, components will fallback to static translations
        setProfile(null);
      }
    }, (err) => {
      console.warn("Failed to listen to profile data:", err);
    });

    // 2. Listen to Experiences Collection (Ordered by 'order' ascending)
    const expColRef = collection(db, 'experiences');
    const expQuery = query(expColRef, orderBy('order', 'asc'));
    const unsubExperiences = onSnapshot(expQuery, (querySnap) => {
      const exps: ExperienceData[] = [];
      querySnap.forEach((docSnap) => {
        exps.push({ id: docSnap.id, ...docSnap.data() } as ExperienceData);
      });
      setExperiences(exps);
    }, (err) => {
      console.warn("Failed to listen to experiences data:", err);
    });

    // 3. Listen to Projects Collection (Ordered by 'order' ascending)
    const projColRef = collection(db, 'projects');
    const projQuery = query(projColRef, orderBy('order', 'asc'));
    const unsubProjects = onSnapshot(projQuery, (querySnap) => {
      const projs: ProjectData[] = [];
      querySnap.forEach((docSnap) => {
        projs.push({ id: docSnap.id, ...docSnap.data() } as ProjectData);
      });
      setProjects(projs);
      setLoading(false);
    }, (err) => {
      console.warn("Failed to listen to projects data:", err);
      setLoading(false);
    });

    return () => {
      unsubProfile();
      unsubExperiences();
      unsubProjects();
    };
  }, []);

  // CRUD Implementations
  const saveProfile = async (data: ProfileData) => {
    const profileDocRef = doc(db, 'profile', 'main');
    await setDoc(profileDocRef, data);
  };

  const addExperience = async (exp: Omit<ExperienceData, 'id'>) => {
    const expColRef = collection(db, 'experiences');
    await addDoc(expColRef, exp);
  };

  const updateExperience = async (id: string, exp: Partial<ExperienceData>) => {
    const expDocRef = doc(db, 'experiences', id);
    await updateDoc(expDocRef, exp);
  };

  const deleteExperience = async (id: string) => {
    const expDocRef = doc(db, 'experiences', id);
    await deleteDoc(expDocRef);
  };

  const addProject = async (proj: Omit<ProjectData, 'id'>) => {
    const projColRef = collection(db, 'projects');
    await addDoc(projColRef, proj);
  };

  const updateProject = async (id: string, proj: Partial<ProjectData>) => {
    const projDocRef = doc(db, 'projects', id);
    await updateDoc(projDocRef, proj);
  };

  const deleteProject = async (id: string) => {
    const projDocRef = doc(db, 'projects', id);
    await deleteDoc(projDocRef);
  };

  return (
    <DataContext.Provider value={{
      profile,
      experiences,
      projects,
      loading,
      saveProfile,
      addExperience,
      updateExperience,
      deleteExperience,
      addProject,
      updateProject,
      deleteProject
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
