import React from 'react';
import { Calendar, Layers, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultCard = ({ project, onSelect, isSelected }) => {
  return (
    <motion.div 
      className={`card ${isSelected ? 'selected' : ''}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h2 style={{ color: '#0f172a', marginBottom: '4px' }}>{project.title}</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span className="chip" style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)' }}>{project.domain}</span>
            <span className="chip" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)' }}>{project.difficultyLevel}</span>
            <span className="chip">{project.type}</span>
          </div>
        </div>
        <button 
          className={`btn ${isSelected ? 'btn-outline' : 'btn-primary'}`} 
          style={{ padding: '8px 16px' }}
          onClick={() => onSelect(project)}
        >
          {isSelected ? 'Selected' : 'Select'} <ExternalLink size={16} />
        </button>
      </div>

      <p style={{ marginBottom: '24px', fontSize: '15px' }}>{project.description}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
            <CheckCircle size={18} color="var(--secondary)" /> Key Features
          </h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
            {project.features.map((f, i) => <li key={i} style={{ marginBottom: '6px' }}>{f}</li>)}
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
            <Layers size={18} color="var(--accent)" /> Technologies
          </h3>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {project.technologies.map((t, i) => <span key={i} className="chip" style={{ fontSize: '11px' }}>{t}</span>)}
          </div>
        </div>
      </div>

      <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', fontSize: '14px' }}>
        <div>
          <strong style={{ display: 'block', marginBottom: '4px', color: '#475569' }}>Build Time</strong>
          <span>{project.estimatedTime}</span>
        </div>
        <div>
          <strong style={{ display: 'block', marginBottom: '4px', color: '#475569' }}>Pros</strong>
          <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>{project.advantages}</span>
        </div>
        <div>
          <strong style={{ display: 'block', marginBottom: '4px', color: '#475569' }}>Cons</strong>
          <span style={{ color: '#ef4444', fontWeight: 600 }}>{project.disadvantages}</span>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        style={{ marginTop: '24px', padding: '16px', backgroundColor: 'rgba(79, 70, 229, 0.03)', borderRadius: '12px', border: '1px solid rgba(79, 70, 229, 0.1)' }}
      >
        <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--primary)' }}>Why this is a good choice:</strong>
        <p style={{ fontSize: '14px' }}>{project.whyGoodChoice}</p>
      </motion.div>
      
      <div style={{ marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', gap: '6px' }}>
        <strong>Future Scope:</strong> <span>{project.futureScope}</span>
      </div>
    </motion.div>
  );
};

export default ResultCard;
