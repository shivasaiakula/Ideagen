import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ExternalLink, ArrowLeft, Copy, Check, Clock, List, BookOpen, Terminal, Sparkles, Layout, Trophy, Circle, CheckCircle2, Share2, MessageCircle, Globe } from 'lucide-react';
import PortfolioExporter from './PortfolioExporter';
import SkillRadar from './SkillRadar';

const RoadmapView = ({ project, onReset, onJoin, progress = {}, onToggleStep, isJoined }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [activeTab, setActiveTab] = useState('roadmap');

  const generatePrompt = () => {
    return `Act as a Senior Software Engineer. I am building a project called "${project.title}".
Context: This is a ${project.difficultyLevel} level project in the ${project.domain} domain.
Tech Stack: ${project.techStack.join(', ')}

Please help me implement Phase 1: "${project.roadmap[0].title}".
Specific requirements: ${project.roadmap[0].steps.join(', ')}

Provide a detailed architecture breakdown and initial boilerplate code.`;
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatePrompt());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const renderTimeline = () => (
    <div className="timeline-container">
      <div className="timeline-track"></div>
      {project.roadmap.map((phase, idx) => (
        <motion.div 
          key={idx} 
          className="timeline-item"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="timeline-dot"></div>
          <div className="timeline-content shadow-sm">
            <div className="timeline-week">Week {idx * 2 + 1} - {idx * 2 + 2}</div>
            <h3 style={{ margin: '8px 0' }}>{phase.title}</h3>
            <ul style={{ marginTop: '12px', listStyle: 'none', padding: 0 }}>
              {phase.steps.map((step, sIdx) => {
                const stepKey = `${idx}-${sIdx}`;
                const isDone = progress[stepKey];
                return (
                  <li key={sIdx} 
                    onClick={() => isJoined && onToggleStep(project.id, stepKey)}
                    style={{ 
                      display: 'flex', 
                      gap: '8px', 
                      marginBottom: '8px', 
                      fontSize: '14px', 
                      alignItems: 'flex-start',
                      cursor: isJoined ? 'pointer' : 'default',
                      opacity: isDone ? 0.6 : 1,
                      textDecoration: isDone ? 'line-through' : 'none'
                    }}
                  >
                    {isDone ? <CheckCircle2 size={16} color="#10b981" /> : <Circle size={16} color="#cbd5e1" />}
                    {step}
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="roadmap-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button className="btn btn-outline" onClick={onReset} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> Back
        </button>
        {!isJoined && (
          <motion.button 
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onJoin(project)}
            style={{ borderRadius: '25px', padding: '10px 24px', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)' }}
          >
            <Trophy size={18} style={{ marginRight: '8px' }} /> Join Project & Track Progress
          </motion.button>
        )}
      </div>

      <div className="roadmap-header card shadow-lg" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'center' }}>
        <div>
          <div className="tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '12px', width: 'fit-content', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
            Industrial Blueprint
          </div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{project.title}</h1>
          <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '24px' }}>{project.description}</p>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button 
              className="btn btn-primary" 
              onClick={copyPrompt}
              whileHover={{ scale: 1.05 }}
              style={{ display: 'flex', gap: '8px' }}
            >
              <Sparkles size={18} />
              {isCopied ? 'Copied!' : 'AI Prompt'}
            </motion.button>
            
            <button 
              className="btn btn-outline" 
              onClick={() => setShowShare(true)}
              style={{ display: 'flex', gap: '8px' }}
            >
              <Share2 size={18} /> Share Progress
            </button>
          </div>
        </div>
        
        <SkillRadar skills={project.skills || { frontend: 10, backend: 10, ai: 10, uiux: 10 }} />
      </div>

      <AnimatePresence>
        {showShare && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowShare(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="card shadow-xl"
              style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '32px' }}
              onClick={e => e.stopPropagation()}
            >
              <h2 style={{ marginBottom: '16px' }}>Share Your Progress</h2>
              <p style={{ color: '#64748b', marginBottom: '24px' }}>Show the world your industrial blueprint journey!</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={() => window.open(`https://twitter.com/intent/tweet?text=Building ${project.title} on IdeaGen!`)}>
                  <MessageCircle size={18} color="#1DA1F2" /> Twitter
                </button>
                <button className="btn btn-outline" style={{ display: 'flex', gap: '8px', justifyContent: 'center' }} onClick={() => window.open(`https://linkedin.com/sharing/share-offsite/?url=${window.location.href}`)}>
                  <Globe size={18} color="#0A66C2" /> LinkedIn
                </button>
              </div>
              
              <button className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }} onClick={() => setShowShare(false)}>
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="roadmap-tabs" style={{ display: 'flex', gap: '32px', margin: '32px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', overflowX: 'auto' }}>
        <button 
          className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`} 
          onClick={() => setActiveTab('roadmap')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', fontSize: '16px', fontWeight: '600', color: activeTab === 'roadmap' ? 'var(--primary)' : '#64748b', cursor: 'pointer', position: 'relative', padding: '8px 0' }}
        >
          <List size={18} /> Roadmap {activeTab === 'roadmap' && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} 
          onClick={() => setActiveTab('timeline')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', fontSize: '16px', fontWeight: '600', color: activeTab === 'timeline' ? 'var(--primary)' : '#64748b', cursor: 'pointer', position: 'relative', padding: '8px 0' }}
        >
          <Clock size={18} /> Timeline {activeTab === 'timeline' && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />}
        </button>
        <button 
          className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`} 
          onClick={() => setActiveTab('resources')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', fontSize: '16px', fontWeight: '600', color: activeTab === 'resources' ? 'var(--primary)' : '#64748b', cursor: 'pointer', position: 'relative', padding: '8px 0' }}
        >
          <BookOpen size={18} /> Resources {activeTab === 'resources' && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'roadmap' && (
          <motion.div key="roadmap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {project.roadmap.map((phase, idx) => (
              <div key={idx} className="card shadow-sm" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>{idx + 1}</div>
                  <h3 style={{ margin: 0 }}>{phase.title}</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {phase.steps.map((step, sIdx) => {
                    const stepKey = `${idx}-${sIdx}`;
                    const isDone = progress[stepKey];
                    return (
                      <li key={sIdx} 
                        onClick={() => isJoined && onToggleStep(project.id, stepKey)}
                        style={{ 
                          display: 'flex', 
                          gap: '12px', 
                          marginBottom: '12px', 
                          fontSize: '14px', 
                          color: isDone ? '#94a3b8' : '#444',
                          cursor: isJoined ? 'pointer' : 'default',
                          textDecoration: isDone ? 'line-through' : 'none'
                        }}
                      >
                        {isDone ? <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} /> : <Circle size={18} color="#cbd5e1" style={{ flexShrink: 0 }} />}
                        {step}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div key="timeline" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {renderTimeline()}
          </motion.div>
        )}

        {activeTab === 'resources' && (
          <motion.div key="resources" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {project.technologies?.map((tech) => (
              <a 
                key={tech} 
                href={`https://www.google.com/search?q=${tech}+documentation`} 
                target="_blank" 
                rel="noreferrer" 
                className="card shadow-sm"
                style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'transform 0.2s' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: '12px', color: 'var(--primary)' }}>
                    <Layout size={24} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{tech} Mastery</h4>
                    <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Technical Documentation</p>
                  </div>
                </div>
                <ExternalLink size={18} color="#94a3b8" />
              </a>
            ))}
            
            <div className="card shadow-md" style={{ background: 'var(--dark)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px' }}>
                  <Terminal size={24} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>Boilerplate Script</h4>
                  <p style={{ margin: 0, fontSize: '11px', opacity: 0.7 }}>One-click init script</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                style={{ background: 'var(--primary)', border: 'none', color: 'white', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => alert(`Running initialization script for ${project.title}...`)}
              >
                <Copy size={18} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PortfolioExporter project={project} />
    </div>
  );
};

export default RoadmapView;
