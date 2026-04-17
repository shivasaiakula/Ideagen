import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StepForm from './components/StepForm';
import ResultCard from './components/ResultCard';
import RoadmapView from './components/RoadmapView';
import AuthView from './components/AuthView';
import MentorChat from './components/MentorChat';
import { projectIdeas } from './data/IdeaStore';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('discover');
  const [userData, setUserData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleComplete = (answers) => {
    setUserData(answers);
    setIsProcessing(true);
    
    // Improved matching engine
    setTimeout(() => {
      const filtered = projectIdeas.filter(p => {
        const domainMatch = p.domain.toLowerCase().includes(answers.domain.toLowerCase());
        const levelMatch = p.level.toLowerCase() === answers.level.toLowerCase();
        const difficultyMatch = p.difficultyLevel.toLowerCase() === answers.difficulty.toLowerCase();
        
        // Scoring system for better matching
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
    if (id === 'discover') {
      reset();
    } else {
      setActiveTab(id);
    }
  };

  return (
    <>
      <Sidebar 
        activeTab={(activeTab === 'results' || activeTab === 'discover') ? 'discover' : activeTab} 
        onTabChange={handleTabChange} 
        user={user}
        onLogout={() => setUser(null)}
      />
      
      <main className="main-content">
        <div className="container">
          
          <AnimatePresence mode="wait">
            {!user ? (
              <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AuthView onLogin={(u) => setUser(u)} />
              </motion.div>
            ) : (
              <>
                {activeTab === 'discover' && !isProcessing && (
                  <motion.div key="discover" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <StepForm onComplete={handleComplete} />
                  </motion.div>
                )}

                {isProcessing && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', marginTop: '100px' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        style={{ width: '80px', height: '80px', border: '4px solid #e8f0fe', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
                      />
                    </div>
                    <h2 style={{ mt: '24px', color: 'var(--primary)' }}>Engineering your future...</h2>
                    <p>Synthesizing {projectIdeas.length} real-world software blueprints for your profile</p>
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
                        <ResultCard 
                          key={project.id} 
                          project={project} 
                          onSelect={handleProjectSelect}
                          isSelected={selectedProject?.id === project.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'explore' && (
                  <motion.div key="explore" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <h1>Explore All Blueprints</h1>
                    <p style={{ marginBottom: '32px' }}>Browse our full library of academic and industry-grade projects.</p>
                    
                    <div style={{ display: 'grid', gap: '24px' }}>
                      {projectIdeas.map(project => (
                        <ResultCard 
                          key={project.id} 
                          project={project} 
                          onSelect={handleProjectSelect}
                          isSelected={selectedProject?.id === project.id}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'planner' && (
                  <motion.div key="planner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RoadmapView project={selectedProject} onReset={() => setActiveTab('discover')} />
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

        </div>
      </main>

      {user && <MentorChat user={user} project={selectedProject || projectIdeas[0]} />}
    </>
  );
}

export default App;
