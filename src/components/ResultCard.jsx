import React from 'react';
import { Calendar, Layers, CheckCircle, ExternalLink, Heart, Clock, Sparkles, TrendingUp, TriangleAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const difficultyColors = {
  'Beginner': { bg: 'rgba(16, 185, 129, 0.08)', color: '#059669', border: 'rgba(16, 185, 129, 0.2)' },
  'Intermediate': { bg: 'rgba(245, 158, 11, 0.08)', color: '#d97706', border: 'rgba(245, 158, 11, 0.2)' },
  'Advanced': { bg: 'rgba(239, 68, 68, 0.08)', color: '#dc2626', border: 'rgba(239, 68, 68, 0.2)' },
};

const ResultCard = ({ project, onSelect, isSelected, isUpvoted, onUpvote }) => {
  const diffStyle = difficultyColors[project.difficultyLevel] || difficultyColors['Beginner'];

  return (
    <motion.div 
      className={`card ${isSelected ? 'selected' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: 0, overflow: 'hidden' }}
    >
      {/* Top Accent Bar */}
      <div style={{
        height: '4px',
        background: isSelected 
          ? 'linear-gradient(90deg, #10b981, #34d399)' 
          : 'linear-gradient(90deg, #4f46e5, #7c3aed, #6366f1)',
        backgroundSize: '200% 100%',
        animation: 'gradientSlide 3s ease infinite',
      }} />

      <div style={{ padding: '28px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <h2 style={{ color: '#0f172a', margin: 0, fontSize: '20px' }}>{project.title}</h2>
              <motion.div 
                style={{ 
                  display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', 
                  padding: '4px 10px', borderRadius: '100px', 
                  backgroundColor: isUpvoted ? 'rgba(239, 68, 68, 0.08)' : '#f8fafc', 
                  color: isUpvoted ? '#ef4444' : '#94a3b8', 
                  fontSize: '13px', fontWeight: 700,
                  border: `1px solid ${isUpvoted ? 'rgba(239, 68, 68, 0.15)' : 'transparent'}`,
                  transition: 'all 0.2s',
                }}
                onClick={(e) => { e.stopPropagation(); onUpvote && onUpvote(); }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
              >
                <Heart size={13} fill={isUpvoted ? '#ef4444' : 'none'} />
                {project.upvotes + (isUpvoted ? 1 : 0)}
              </motion.div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <span className="chip" style={{ backgroundColor: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', border: '1px solid rgba(79, 70, 229, 0.12)' }}>
                {project.domain}
              </span>
              <span className="chip" style={{ backgroundColor: diffStyle.bg, color: diffStyle.color, border: `1px solid ${diffStyle.border}` }}>
                {project.difficultyLevel}
              </span>
              <span className="chip" style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>{project.type}</span>
            </div>
          </div>
          <motion.button 
            className={`btn ${isSelected ? 'btn-outline' : 'btn-primary'}`} 
            style={{ padding: '9px 18px', fontSize: '13px', flexShrink: 0 }}
            onClick={() => onSelect(project)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            {isSelected ? '✓ Selected' : 'Select'} <ExternalLink size={14} />
          </motion.button>
        </div>

        <p style={{ marginBottom: '24px', fontSize: '14px', lineHeight: 1.7 }}>{project.description}</p>

        {/* Features + Tech */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          <div>
            <h3 style={{ fontSize: '13px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '7px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              <CheckCircle size={15} color="#10b981" /> Key Features
            </h3>
            <ul style={{ paddingLeft: '0', listStyle: 'none', color: 'var(--text-secondary)', fontSize: '13px' }}>
              {project.features.map((f, i) => (
                <li key={i} style={{ marginBottom: '7px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ color: '#10b981', marginTop: '2px', flexShrink: 0 }}>●</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ fontSize: '13px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '7px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              <Layers size={15} color="var(--primary)" /> Technologies
            </h3>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {project.technologies.map((t, i) => (
                <span key={i} className="chip" style={{ fontSize: '11px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ margin: '24px 0', height: '1px', background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)' }} />

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(79, 70, 229, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={16} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Build Time</div>
              <div style={{ fontWeight: 700, color: '#1e293b' }}>{project.estimatedTime}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={16} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pros</div>
              <div style={{ fontWeight: 700, color: '#059669' }}>{project.advantages}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TriangleAlert size={16} color="#ef4444" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cons</div>
              <div style={{ fontWeight: 700, color: '#dc2626' }}>{project.disadvantages}</div>
            </div>
          </div>
        </div>

        {/* Why Good Choice - Expandable */}
        <motion.div 
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1 }}
          style={{ 
            marginTop: '20px', padding: '16px 18px', 
            background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03), rgba(99, 102, 241, 0.02))',
            borderRadius: '14px', border: '1px solid rgba(79, 70, 229, 0.08)',
            transition: 'all 0.3s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sparkles size={14} color="var(--primary)" />
            <strong style={{ fontSize: '12px', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Why this is a great choice</strong>
          </div>
          <p style={{ fontSize: '13px', margin: 0 }}>{project.whyGoodChoice}</p>
        </motion.div>
        
        <div style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <strong style={{ color: '#475569' }}>Future Scope:</strong> <span>{project.futureScope}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultCard;
