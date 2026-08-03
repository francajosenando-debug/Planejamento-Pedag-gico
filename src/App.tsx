import React, { useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signOut, 
  db, 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  User 
} from './lib/firebase';
import { 
  WeeklyPlanning, 
  SavedLesson, 
  Lesson,
  Story, 
  Song, 
  Game, 
  SchoolSettings, 
  UserProfile 
} from './types';
import { SAMPLE_PLANNING, SAMPLE_LESSONS, SAMPLE_STORIES, SAMPLE_SONGS, SAMPLE_GAMES } from './data/sampleData';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PlanningEditor } from './components/PlanningEditor';
import { PlanningList } from './components/PlanningList';
import { LessonBank } from './components/LessonBank';
import { StoryBank } from './components/StoryBank';
import { SongBank } from './components/SongBank';
import { GameBank } from './components/GameBank';
import { BnccExplorer } from './components/BnccExplorer';
import { MaterialsBank } from './components/MaterialsBank';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginGate } from './components/LoginGate';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Data States
  const [plannings, setPlannings] = useState<WeeklyPlanning[]>([SAMPLE_PLANNING]);
  const [currentPlanning, setCurrentPlanning] = useState<WeeklyPlanning>(SAMPLE_PLANNING);
  const [lessons, setLessons] = useState<SavedLesson[]>(SAMPLE_LESSONS);
  const [stories, setStories] = useState<Story[]>(SAMPLE_STORIES);
  const [songs, setSongs] = useState<Song[]>(SAMPLE_SONGS);
  const [games, setGames] = useState<Game[]>(SAMPLE_GAMES);

  const [settings, setSettings] = useState<SchoolSettings | null>({
    userId: 'default-user',
    schoolName: 'Escola de Educação Infantil Cristão de Curitiba',
    logoUrl: '',
    teacherName: 'Profe Camila',
    city: 'Curitiba',
    state: 'PR',
    phone: '(41) 99999-9999',
    defaultClass: 'KINDER 3'
  });

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // PWA Install Prompt State
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Listen for dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Listen for PWA Install Event
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallPwa = () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: any) => {
      if (choiceResult.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    });
  };

  // Firebase Auth Listener & Firestore Data Fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      if (firebaseUser) {
        const uProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || 'usuario@escola.com',
          displayName: firebaseUser.displayName || 'Professor(a)',
          photoURL: firebaseUser.photoURL || undefined,
          isAnonymous: firebaseUser.isAnonymous
        };
        setUser(uProfile);

        // Load Firestore User Plannings
        try {
          const q = query(collection(db, 'plannings'), where('userId', '==', firebaseUser.uid));
          const querySnapshot = await getDocs(q);
          const docs: WeeklyPlanning[] = [];
          querySnapshot.forEach((docSnap) => {
            docs.push({ id: docSnap.id, ...docSnap.data() } as WeeklyPlanning);
          });
          if (docs.length > 0) {
            setPlannings(docs);
            setCurrentPlanning(docs[0]);
          }
        } catch (err) {
          console.log("Firestore fetch fallback:", err);
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Save Planning to Firebase
  const handleSavePlanningFirebase = async (planningToSave: WeeklyPlanning) => {
    // Local Update first
    const exists = plannings.some(p => p.id === planningToSave.id);
    let updatedList: WeeklyPlanning[];
    if (exists) {
      updatedList = plannings.map(p => p.id === planningToSave.id ? planningToSave : p);
    } else {
      updatedList = [planningToSave, ...plannings];
    }
    setPlannings(updatedList);
    setCurrentPlanning(planningToSave);

    // Sync to Firestore if logged in
    if (user && db) {
      try {
        const docRef = doc(db, 'plannings', planningToSave.id);
        await setDoc(docRef, {
          ...planningToSave,
          userId: user.uid,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        alert("Planejamento salvo com sucesso no Firebase!");
      } catch (err: any) {
        console.error("Erro ao salvar no Firestore:", err);
        alert("Planejamento salvo localmente no aplicativo!");
      }
    } else {
      alert("Planejamento salvo no seu navegador!");
    }
  };

  // Duplicate Planning
  const handleDuplicatePlanning = (planning: WeeklyPlanning) => {
    const duplicated: WeeklyPlanning = {
      ...planning,
      id: `planning-${Date.now()}`,
      week: `${planning.week} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setPlannings([duplicated, ...plannings]);
    setCurrentPlanning(duplicated);
    setActiveTab('novo-planejamento');
  };

  // Delete Planning
  const handleDeletePlanning = async (id: string) => {
    const updated = plannings.filter(p => p.id !== id);
    setPlannings(updated);

    if (currentPlanning?.id === id) {
      if (updated.length > 0) {
        setCurrentPlanning(updated[0]);
      } else {
        handleCreateNewPlanning();
      }
    }

    if (user && db) {
      try {
        await deleteDoc(doc(db, 'plannings', id));
      } catch (e) {
        console.error("Erro ao deletar do Firestore:", e);
      }
    }
  };

  // New Fresh Planning Creation
  const handleCreateNewPlanning = () => {
    const newPlanning: WeeklyPlanning = {
      id: `planning-${Date.now()}`,
      userId: user?.uid || 'default-user',
      className: settings?.defaultClass || 'KINDER 3',
      year: new Date().getFullYear().toString(),
      teacher: settings?.teacherName || 'Profe Camila',
      period: 'Vespertino',
      week: 'Nova Semana',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      generalTheme: 'Novo Tema Geral',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      days: {
        segunda: { dayName: 'Segunda-feira', dateStr: '', routine: [], lessons: [] },
        terca: { dayName: 'Terça-feira', dateStr: '', routine: [], lessons: [] },
        quarta: { dayName: 'Quarta-feira', dateStr: '', routine: [], lessons: [] },
        quinta: { dayName: 'Quinta-feira', dateStr: '', routine: [], lessons: [] },
        sexta: { dayName: 'Sexta-feira', dateStr: '', routine: [], lessons: [] }
      }
    };
    setPlannings([newPlanning, ...plannings]);
    setCurrentPlanning(newPlanning);
    setActiveTab('novo-planejamento');
  };

  // Loading Screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse mb-4">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-xs font-bold text-slate-600 dark:text-slate-400 animate-pulse">
          Carregando sistema de planejamentos...
        </p>
      </div>
    );
  }

  // Mandatory Login Gate if user is not authenticated
  if (!user) {
    return (
      <LoginGate 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
        onLocalGuestLogin={() => {
          setUser({
            uid: 'guest-' + Date.now(),
            email: 'visitante@escola.com',
            displayName: 'Professor(a) Visitante',
            isAnonymous: true
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-blue-500 selection:text-white">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        settings={settings}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={() => signOut(auth)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        installPrompt={installPrompt}
        onInstallPwa={handleInstallPwa}
      />

      {/* Main App Canvas */}
      <main className="lg:pl-64 w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
        
        {activeTab === 'dashboard' && (
          <Dashboard
            setActiveTab={setActiveTab}
            plannings={plannings}
            lessons={lessons}
            stories={stories}
            songs={songs}
            games={games}
            onOpenAiAssistant={() => setAiAssistantOpen(true)}
            onOpenSettings={() => setSettingsModalOpen(true)}
            onSelectPlanning={(p) => {
              setCurrentPlanning(p);
              setActiveTab('novo-planejamento');
            }}
          />
        )}

        {activeTab === 'novo-planejamento' && (
          <PlanningEditor
            currentPlanning={currentPlanning}
            onChangePlanning={(updated) => {
              setCurrentPlanning(updated);
              setPlannings(plannings.map(p => p.id === updated.id ? updated : p));
            }}
            onSaveFirebase={handleSavePlanningFirebase}
            settings={settings}
            onOpenAiAssistant={() => setAiAssistantOpen(true)}
            savedLessons={lessons}
            stories={stories}
            onClose={() => setActiveTab('planejamentos')}
          />
        )}

        {activeTab === 'planejamentos' && (
          <PlanningList
            plannings={plannings}
            onSelectPlanning={(p) => {
              setCurrentPlanning(p);
              setActiveTab('novo-planejamento');
            }}
            onDuplicatePlanning={handleDuplicatePlanning}
            onDeletePlanning={handleDeletePlanning}
            onNewPlanning={handleCreateNewPlanning}
            settings={settings}
          />
        )}

        {activeTab === 'banco-aulas' && (
          <LessonBank
            lessons={lessons}
            onSaveLesson={(l) => {
              const exists = lessons.some(x => x.id === l.id);
              setLessons(exists ? lessons.map(x => x.id === l.id ? l : x) : [l, ...lessons]);
            }}
            onDeleteLesson={(id) => setLessons(lessons.filter(l => l.id !== id))}
            onToggleFavorite={(id) => setLessons(lessons.map(l => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l))}
          />
        )}

        {activeTab === 'banco-historias' && (
          <StoryBank
            stories={stories}
            onSaveStory={(s) => {
              const exists = stories.some(x => x.id === s.id);
              setStories(exists ? stories.map(x => x.id === s.id ? s : x) : [s, ...stories]);
            }}
            onDeleteStory={(id) => setStories(stories.filter(s => s.id !== id))}
          />
        )}

        {activeTab === 'banco-musicas' && (
          <SongBank
            songs={songs}
            onSaveSong={(s) => {
              const exists = songs.some(x => x.id === s.id);
              setSongs(exists ? songs.map(x => x.id === s.id ? s : x) : [s, ...songs]);
            }}
            onDeleteSong={(id) => setSongs(songs.filter(s => s.id !== id))}
          />
        )}

        {activeTab === 'banco-brincadeiras' && (
          <GameBank
            games={games}
            onSaveGame={(g) => {
              const exists = games.some(x => x.id === g.id);
              setGames(exists ? games.map(x => x.id === g.id ? g : x) : [g, ...games]);
            }}
            onDeleteGame={(id) => setGames(games.filter(g => g.id !== id))}
          />
        )}

        {activeTab === 'banco-materiais' && (
          <MaterialsBank />
        )}

        {activeTab === 'banco-bncc' && (
          <BnccExplorer />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
      />

      <AiAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
        onSaveToBank={(lesson) => setLessons([lesson, ...lessons])}
        defaultClass={settings?.defaultClass || 'KINDER 3'}
        defaultTeacher={settings?.teacherName || 'Profe Camila'}
        onApplyPlanning={(newPlanning) => {
          setPlannings([newPlanning, ...plannings]);
          setCurrentPlanning(newPlanning);
          setActiveTab('novo-planejamento');
          setAiAssistantOpen(false);
        }}
        onApplyLesson={(lessonData) => {
          const newLesson: Lesson = {
            id: `lesson-${Date.now()}`,
            subject: lessonData.subject || 'LINGUAGEM',
            time: '13:30 – 14:20',
            theme: lessonData.theme || lessonData.name || 'Aula Gerada por IA',
            objectives: lessonData.objectives || '',
            bnccCodes: lessonData.bnccCodes || [],
            development: lessonData.development || '',
            materials: lessonData.materials || [],
            notes: lessonData.notes || ''
          };

          if (currentPlanning) {
            const dayKey = 'segunda';
            const currentDayObj = currentPlanning.days[dayKey];
            const updatedDay = {
              ...currentDayObj,
              lessons: [...(currentDayObj.lessons || []), newLesson]
            };
            const updatedPlanning = {
              ...currentPlanning,
              days: {
                ...currentPlanning.days,
                [dayKey]: updatedDay
              },
              updatedAt: new Date().toISOString()
            };
            setCurrentPlanning(updatedPlanning);
            setPlannings(plannings.map(p => p.id === updatedPlanning.id ? updatedPlanning : p));
          }
          setActiveTab('novo-planejamento');
          setAiAssistantOpen(false);
        }}
      />
    </div>
  );
}
