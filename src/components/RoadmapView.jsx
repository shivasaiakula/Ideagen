import React, { useState } from 'react';
import { CheckCircle2, Circle, ArrowRight, ExternalLink, Copy, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoadmapView = ({ project, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  if (!project) {
    return (
      <div className="fade-in" style={{ textAlign: 'center', marginTop: '100px' }}>
        <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2>No project selected yet</h2>
          <p>Go to the <strong>Discover</strong> tab to find your perfect project and start your journey.</p>
          <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={onReset}>
            Start Discovery
          </button>
        </div>
      </div>
    );
  }

  const generatedPrompt = `Act as an expert Senior Software Engineer. I want to build a project called "${project.title}".
Description: ${project.description}
Key Features:
${project.features.map(f => `- ${f}`).join('\n')}
Technologies: ${project.technologies.join(', ')}

Please provide:
1. A detailed system architecture overview.
2. A step-by-step implementation guide for the first milestone.
3. Code snippets for the core boilerplate using ${project.technologies[0]}.
4. Best practices for security and performance specifically for this project.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <span className="chip" style={{ marginBottom: '12px', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>
            Your Development Roadmap
          </span>
          <h1>{project.title}</h1>
          <p>Follow these steps to build your {project.type} successfully.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => setShowPrompt(true)}>
            <Sparkles size={18} /> Generate AI Prompt
          </button>
          <button className="btn btn-outline" onClick={onReset}>Change Project</button>
        </div>
      </div>

      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card"
            style={{ marginBottom: '32px', backgroundColor: '#fdfaff', border: '1px solid #e0e7ff', overflow: 'hidden' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary)" /> Ready-to-use AI Prompt
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={handleCopy}>
                  {copied ? <Check size={16} color="var(--secondary)" /> : <Copy size={16} />} 
                  {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
                <button className="btn btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => setShowPrompt(false)}>Close</button>
              </div>
            </div>
            <pre style={{ 
              whiteSpace: 'pre-wrap', 
              fontSize: '13px', 
              color: '#475569', 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '12px',
              border: '1px solid #f1f5f9',
              lineHeight: '1.6',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {generatedPrompt}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        <section>
          <h2 style={{ marginBottom: '24px' }}>Deployment Phases</h2>
          <div className="roadmap-container">
            {project.roadmap ? project.roadmap.map((step, index) => (
              <motion.div 
                key={index} 
                className="roadmap-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <h3 style={{ fontSize: '18px', marginBottom: '8px', color: '#0f172a' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px' }}>{step.desc}</p>
                </div>
              </motion.div>
            )) : (
              <p>Roadmap documentation is being prepared for this project.</p>
            )}
          </div>
        </section>

        <aside>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Tech Stack</h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {project.technologies.map(tech => (
                <span key={tech} className="chip">{tech}</span>
              ))}
            </div>
            
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Learning Resources</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a href="#" className="btn btn-outline" style={{ justifyContent: 'space-between', width: '100%', fontSize: '14px' }}>
                GitHub Template <ExternalLink size={14} />
              </a>
              <a href="#" className="btn btn-outline" style={{ justifyContent: 'space-between', width: '100%', fontSize: '14px' }}>
                Setup Guide <ExternalLink size={14} />
              </a>
              <a href="#" className="btn btn-outline" style={{ justifyContent: 'space-between', width: '100%', fontSize: '14px' }}>
                Architecture Doc <ExternalLink size={14} />
              </a>
            </div>
          </div>
          
          <div className="card" style={{ padding: '24px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px', color: 'white' }}>Expert Tip</h3>
            <p style={{ fontSize: '14px', color: '#cbd5e1' }}>
              Focus on completing Step 1 thoroughly before moving to development. A solid research foundation saves 40% of coding time.
            </p>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default RoadmapView;
