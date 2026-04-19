import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle2, ArrowRight, BarChart3, Briefcase } from 'lucide-react';

const DashboardView = ({ joinedProjects, progress, onSelectProject }) => {
  const projects = Object.values(joinedProjects);

  const calculateProgress = (projectId) => {
    const project = joinedProjects[projectId];
    if (!project || !project.roadmap) return 0;
    
    const totalSteps = project.roadmap.reduce((acc, phase) => acc + phase.steps.length, 0);
    const completedSteps = Object.values(progress[projectId] || {}).filter(Boolean).length;
    
    return Math.round((completedSteps / totalSteps) * 100);
  };

  return (
    <div className="dashboard-view">
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px' }}>Student Dashboard</h1>
        <p style={{ color: '#64748b' }}>Track your active industrial blueprints and skill growth.</p>
      </div>

      {projects.length === 0 ? (
        <div className="card shadow-sm" style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(255,255,255,0.5)' }}>
          <Briefcase size={48} color="#cbd5e1" style={{ marginBottom: '20px' }} />
          <h3>No Active Projects</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>Join a project from the Discover or Explore tabs to start tracking your progress.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          {projects.map(project => {
            const completion = calculateProgress(project.id);
            return (
              <motion.div 
                key={project.id} 
                className="card shadow-md"
                whileHover={{ y: -5 }}
                style={{ cursor: 'pointer', overflow: 'hidden' }}
                onClick={() => onSelectProject(project)}
              >
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div className="tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)', fontSize: '11px' }}>
                      {project.domain}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '13px', fontWeight: 'bold' }}>
                      <CheckCircle2 size={14} /> {completion}% Done
                    </div>
                  </div>
                  
                  <h3 style={{ marginBottom: '8px' }}>{project.title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px', lineClamp: 2 }}>{project.description}</p>
                  
                  <div className="progress-bar-container" style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                    <motion.div 
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      style={{ height: '100%', background: 'var(--primary)' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                        <Clock size={14} /> {project.estimatedTime || '4 Weeks'}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                        <BarChart3 size={14} /> {project.difficultyLevel}
                      </div>
                    </div>
                    <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      Resume <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {projects.length > 0 && (
        <div className="card shadow-lg" style={{ marginTop: '40px', background: 'var(--dark)', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '16px' }}>
              <Trophy size={32} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Skill Achievement Locked</h3>
              <p style={{ margin: 0, opacity: 0.7, fontSize: '14px' }}>Complete your first milestone to unlock your technical credentials badge.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
