import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import StepForm from './components/StepForm';
import ResultCard from './components/ResultCard';
import RoadmapView from './components/RoadmapView';
import AuthView from './components/AuthView';
import MentorChat from './components/MentorChat';
import DashboardView from './components/DashboardView';
import { projectIdeas } from './data/IdeaStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { supabase } from './lib/supabase';
import {
  signOut,
  fetchJoinedProjects,
  joinProject,
  fetchProgress,
  toggleStep,
  fetchUpvotes,
  toggleUpvote,
} from './lib/db';

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', flexDirection: 'column', gap: '24px',
    background: 'linear-gradient(135deg, #f8faff 0%, #f1f5ff 100%)',
  }}>
    <div style={{ position: 'relative', width: '72px', height: '72px' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: '#4f46e5', borderRadius: '50%' }}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        style={{ position: 'absolute', inset: '12px', border: '3px solid transparent', borderTopColor: '#10b981', borderRadius: '50%' }}
      />
    </div>
    <motion.p
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ repeat: Infinity, duration: 2 }}
      style={{ color: '#64748b', fontSize: '15px', fontWeight: 500 }}
    >
      Loading IdeaGen…
    </motion.p>
  </div>
);

// ─── Error Toast ──────────────────────────────────────────────────────────────
const ErrorToast = ({ message, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: '#1e293b', color: 'white', padding: '12px 20px', borderRadius: '12px',
      fontSize: '13px', fontWeight: 500, zIndex: 9999, display: 'flex', gap: '12px', alignItems: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
    }}
  >
    ⚠️ {message}
    <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}>✕</button>
  </motion.div>
);

function App() {
  // ─── Auth state ─────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ─── App state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('discover');
  const [userData, setUserData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // ─── Supabase-backed state ───────────────────────────────────────────────────
  const [joinedProjects, setJoinedProjects] = useState({});
  const [progress, setProgress] = useState({});
  const [upvotedProjects, setUpvotedProjects] = useState({});
  const [dataLoading, setDataLoading] = useState(false);

  // ─── UI state ───────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [errorMsg, setErrorMsg] = useState('');

  // ─── Show error helper ───────────────────────────────────────────────────────
  const showError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 5000);
  };

  // ─── Load user data from Supabase ─────────────────────────────────────────
  const loadUserData = useCallback(async (userId) => {
    setDataLoading(true);
    try {
      const [joined, prog, upvotes] = await Promise.all([
        fetchJoinedProjects(userId),
        fetchProgress(userId),
        fetchUpvotes(userId),
      ]);
      setJoinedProjects(joined);
      setProgress(prog);
      setUpvotedProjects(upvotes);
    } catch (err) {
      console.error('Failed to load user data:', err);
      showError('Failed to load your data. Please refresh.');
    } finally {
      setDataLoading(false);
    }
  }, []);

  // ─── Auth listener (Supabase) ─────────────────────────────────────────────
  useEffect(() => {
    // 1. Get current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) loadUserData(session.user.id);
      setAuthLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserData(session.user.id);
      } else {
        // Clear all state on logout
        setJoinedProjects({});
        setProgress({});
        setUpvotedProjects({});
        setActiveTab('discover');
        setSelectedProject(null);
        setRecommendations([]);
        setUserData(null);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [loadUserData]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleLogin = (supabaseUser, supabaseSession) => {
    setUser(supabaseUser);
    setSession(supabaseSession);
    // onAuthStateChange will also fire — loadUserData called there
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      showError('Logout failed. Please try again.');
    }
  };

  const handleToggleUpvote = async (projectId) => {
    if (!user) return;
    const isCurrentlyUpvoted = !!upvotedProjects[projectId];
    // Optimistic update
    setUpvotedProjects(prev => ({ ...prev, [projectId]: !isCurrentlyUpvoted }));
    try {
      await toggleUpvote(user.id, projectId, isCurrentlyUpvoted);
    } catch (err) {
      // Revert on failure
      setUpvotedProjects(prev => ({ ...prev, [projectId]: isCurrentlyUpvoted }));
      showError('Could not save upvote. Please try again.');
    }
  };

  const handleJoinProject = async (project) => {
    if (!user) return;
    // Optimistic update
    setJoinedProjects(prev => ({ ...prev, [project.id]: project }));
    if (!progress[project.id]) setProgress(prev => ({ ...prev, [project.id]: {} }));
    setActiveTab('dashboard');
    try {
      await joinProject(user.id, project);
    } catch (err) {
      showError('Failed to join project. Please try again.');
      setJoinedProjects(prev => { const n = { ...prev }; delete n[project.id]; return n; });
    }
  };

  const handleToggleStep = async (projectId, stepKey) => {
    if (!user) return;
    const currentValue = progress[projectId]?.[stepKey] ?? false;
    // Optimistic update
    setProgress(prev => ({
      ...prev,
      [projectId]: { ...prev[projectId], [stepKey]: !currentValue },
    }));
    try {
      await toggleStep(user.id, projectId, stepKey, currentValue);
    } catch (err) {
      // Revert
      setProgress(prev => ({
        ...prev,
        [projectId]: { ...prev[projectId], [stepKey]: currentValue },
      }));
      showError('Failed to save progress. Please try again.');
    }
  };

  const handleComplete = (answers) => {
    setUserData(answers);
    setIsProcessing(true);
    setTimeout(() => {
      const filtered = projectIdeas.filter(p => {
        const domainMatch = p.domain.toLowerCase().includes(answers.domain.toLowerCase());
        const levelMatch = p.level.toLowerCase() === answers.level.toLowerCase();
        const difficultyMatch = p.difficultyLevel.toLowerCase() === answers.difficulty.toLowerCase();
        let score = 0;
        if (domainMatch) score += 3;
        if (levelMatch) score += 2;
        if (difficultyMatch) score += 1;
        p._matchScore = score;
        return score > 0;
      }).sort((a, b) => b._matchScore - a._matchScore);
      setRecommendations(filtered.length > 0 ? filtered : projectIdeas.slice(0, 3));
      setIsProcessing(false);
      setActiveTab('results');
    }, 2000);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setActiveTab('planner');
  };

  const reset = () => {
    setUserData(null);
    setRecommendations([]);
    setActiveTab('discover');
  };

  const handleTabChange = (id) => {
    if (id === 'discover') reset();
    else setActiveTab(id);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  if (authLoading) return <LoadingScreen />;

  // Derive display name from Supabase user metadata
  const displayUser = user
    ? { ...user, name: user.user_metadata?.name || user.email?.split('@')[0] || 'Student' }
    : null;

  return (
    <>
      <Sidebar
        activeTab={(activeTab === 'results' || activeTab === 'discover') ? 'discover' : activeTab}
        onTabChange={handleTabChange}
        user={displayUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        <div className="container">
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AuthView onLogin={handleLogin} />
              </motion.div>
            ) : dataLoading ? (
              <motion.div key="data-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}
              >
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%' }}
                />
                <p style={{ color: '#64748b', fontSize: '14px' }}>Loading your workspace…</p>
              </motion.div>
            ) : (
              <>
                {activeTab === 'discover' && !isProcessing && (
                  <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <StepForm onComplete={handleComplete} />
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    style={{ textAlign: 'center', marginTop: '80px' }}
                  >
                    <div style={{ position: 'relative', display: 'inline-block', width: '90px', height: '90px', marginBottom: '32px' }}>
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                        style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: 'var(--primary)', borderRadius: '50%' }} />
                      <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
                        style={{ position: 'absolute', inset: '10px', border: '3px solid transparent', borderTopColor: '#10b981', borderRadius: '50%' }} />
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        style={{ position: 'absolute', inset: '22px', border: '3px solid transparent', borderTopColor: '#f59e0b', borderRadius: '50%' }} />
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                        style={{ position: 'absolute', inset: '34px', background: 'linear-gradient(135deg, var(--primary), #7c3aed)', borderRadius: '50%' }} />
                    </div>
                    <motion.h2 animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2 }}
                      style={{ color: 'var(--primary)', marginBottom: '12px', fontSize: '28px' }}
                    >
                      Engineering your future…
                    </motion.h2>
                    <p style={{ marginBottom: '28px' }}>Synthesizing {projectIdeas.length} real-world blueprints for your profile</p>
                    <div style={{ width: '280px', height: '5px', background: '#e2e8f0', borderRadius: '10px', margin: '0 auto', overflow: 'hidden' }}>
                      <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                        style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, transparent, var(--primary), #7c3aed, transparent)', borderRadius: '10px' }} />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'results' && (
                  <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                      <div>
                        <h1>Handpicked for you</h1>
                        <p>Optimized for a {userData?.level} student specializing in {userData?.domain}.</p>
                      </div>
                      <button className="btn btn-outline" onClick={reset}>Try Again</button>
                    </div>
                    <div style={{ display: 'grid', gap: '24px' }}>
                      {recommendations.map(project => (
                        <ResultCard key={project.id} project={project} onSelect={handleProjectSelect}
                          isSelected={selectedProject?.id === project.id}
                          isUpvoted={!!upvotedProjects[project.id]}
                          onUpvote={() => handleToggleUpvote(project.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'explore' && (
                  <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h1>Explore All Blueprints</h1>
                    </div>
                    <p style={{ marginBottom: '24px' }}>Browse our full library of academic and industry-grade projects.</p>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
                      <div className="input-group" style={{ marginBottom: 0, flex: 1, minWidth: '250px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" placeholder="Search titles, descriptions, or tech stack…"
                          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                          style={{ paddingLeft: '40px' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {['All', 'AI', 'Web Development', 'Mobile App', 'Cybersecurity', 'Cloud Computing'].map(filter => (
                          <button key={filter}
                            className={`chip ${selectedFilter === filter ? 'selected-chip' : ''}`}
                            onClick={() => setSelectedFilter(filter)}
                            style={{
                              border: 'none', cursor: 'pointer',
                              backgroundColor: selectedFilter === filter ? 'var(--primary)' : '#f1f5f9',
                              color: selectedFilter === filter ? 'white' : '#475569',
                            }}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gap: '24px' }}>
                      {projectIdeas.filter(p => {
                        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.techStack && p.techStack.join(' ').toLowerCase().includes(searchQuery.toLowerCase()));
                        const matchesFilter = selectedFilter === 'All' || p.domain.includes(selectedFilter);
                        return matchesSearch && matchesFilter;
                      }).map(project => (
                        <ResultCard key={project.id} project={project} onSelect={handleProjectSelect}
                          isSelected={selectedProject?.id === project.id}
                          isUpvoted={!!upvotedProjects[project.id]}
                          onUpvote={() => handleToggleUpvote(project.id)}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'dashboard' && (
                  <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DashboardView
                      joinedProjects={joinedProjects}
                      progress={progress}
                      user={displayUser}
                      onSelectProject={(p) => { setSelectedProject(p); setActiveTab('planner'); }}
                    />
                  </motion.div>
                )}

                {activeTab === 'planner' && (
                  <motion.div key="planner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RoadmapView
                      project={selectedProject}
                      onReset={() => setActiveTab('discover')}
                      onJoin={handleJoinProject}
                      isJoined={!!joinedProjects[selectedProject?.id]}
                      progress={progress[selectedProject?.id] || {}}
                      onToggleStep={handleToggleStep}
                    />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </main>

      {user && (
        <MentorChat
          user={displayUser}
          project={selectedProject || projectIdeas[0]}
        />
      )}

      <AnimatePresence>
        {errorMsg && <ErrorToast message={errorMsg} onDismiss={() => setErrorMsg('')} />}
      </AnimatePresence>
    </>
  );
}

export default App;
