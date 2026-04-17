import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ExternalLink, ArrowLeft, Copy, Check, Clock, List, BookOpen, Terminal, Sparkles, Layout } from 'lucide-react';
import PortfolioExporter from './PortfolioExporter';

const RoadmapView = ({ project, onReset }) => {
  const [isCopied, setIsCopied] = useState(false);
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
              {phase.steps.map((step, sIdx) => (
                <li key={sIdx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '14px', alignItems: 'flex-start' }}>
                  <CheckCircle size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="roadmap-view">
      <button className="btn btn-outline" onClick={onReset} style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={18} /> Back to Discover
      </button>

      <div className="roadmap-header card shadow-lg">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div className="tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '12px', width: 'fit-content', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
              Industrial Blueprint
            </div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{project.title}</h1>
            <p style={{ color: '#64748b', fontSize: '18px' }}>{project.description}</p>
          </div>
          <motion.button 
            className="btn btn-primary" 
            onClick={copyPrompt}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: 'flex', gap: '8px', padding: '12px 20px', boxShadow: '0 10px 20px rgba(79, 70, 229, 0.2)' }}
          >
            <Sparkles size={18} />
            {isCopied ? 'Copied to Clipboard!' : 'Generate AI Prompt'}
          </motion.button>
        </div>

        <div className="tech-pills" style={{ marginTop: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {project.techStack.map(tech => (
            <span key={tech} className="tech-pill" style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '13px', fontWeight: '500' }}>{tech}</span>
          ))}
        </div>
      </div>

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
          <Clock size={18} /> Visualization {activeTab === 'timeline' && <motion.div layoutId="tab-underline" style={{ position: 'absolute', bottom: '-13px', left: 0, right: 0, height: '3px', background: 'var(--primary)' }} />}
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
                  <div style={{ width: '32px', height: '32px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '14px', fontWeight: 'bold' }}>{idx + 1}</div>
                  <h3 style={{ margin: 0 }}>{phase.title}</h3>
                </div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {phase.steps.map((step, sIdx) => (
                    <li key={sIdx} style={{ display: 'flex', gap: '12px', marginBottom: '12px', fontSize: '14px', color: '#444' }}>
                      <CheckCircle size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
                      {step}
                    </li>
                  ))}
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
            {project.techStack.map((tech) => (
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
