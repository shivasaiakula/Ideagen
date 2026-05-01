import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle2, ArrowRight, BarChart3, Briefcase, Star, Zap, Code, FolderOpen, TrendingUp, Target } from 'lucide-react';

const DashboardView = ({ joinedProjects, progress, onSelectProject }) => {
  const projects = Object.values(joinedProjects);

  const calculateProgress = (projectId) => {
    const project = joinedProjects[projectId];
    if (!project || !project.roadmap) return 0;
    
    const totalSteps = project.roadmap.reduce((acc, phase) => acc + phase.steps.length, 0);
    const completedSteps = Object.values(progress[projectId] || {}).filter(Boolean).length;
    
    return totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  };

  const totalStepsCompleted = Object.keys(progress).reduce((acc, id) => {
    return acc + Object.values(progress[id] || {}).filter(Boolean).length;
  }, 0);

  const highestCompletion = projects.length > 0 ? Math.max(...projects.map(p => calculateProgress(p.id))) : 0;

  const stats = [
    { label: 'Active Projects', value: projects.length, icon: FolderOpen, color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.08)' },
    { label: 'Steps Completed', value: totalStepsCompleted, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
    { label: 'Best Progress', value: `${highestCompletion}%`, icon: TrendingUp, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
    { label: 'Streak', value: `${Math.min(projects.length * 2, 14)}d`, icon: Zap, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)' },
  ];

  return (
    <div className="dashboard-view">
      <div style={{ marginBottom: '36px' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: '36px', marginBottom: '8px' }}
        >
          Student Dashboard
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.15 }}
          style={{ color: '#64748b' }}
        >
          Track your active industrial blueprints and skill growth.
        </motion.p>
      </div>

      {/* Stat Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-value animate-count">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 ? (
        <motion.div 
          className="card" 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', padding: '60px 20px' }}
        >
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: 'rgba(79, 70, 229, 0.06)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
          }}>
            <Briefcase size={32} color="#94a3b8" />
          </div>
          <h3 style={{ marginBottom: '8px' }}>No Active Projects</h3>
          <p style={{ color: '#64748b', marginBottom: '24px', maxWidth: '360px', margin: '0 auto' }}>
            Join a project from the Discover or Explore tabs to start tracking your progress.
          </p>
        </motion.div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {projects.map((project, i) => {
            const completion = calculateProgress(project.id);
            return (
              <motion.div 
                key={project.id} 
                className="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
                onClick={() => onSelectProject(project)}
              >
                {/* Colored top accent */}
                <div style={{
                  height: '4px',
                  background: completion >= 100 
                    ? 'linear-gradient(90deg, #10b981, #34d399)' 
                    : completion >= 50 
                    ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' 
                    : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                }} />
                
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <span className="chip" style={{ background: 'rgba(79, 70, 229, 0.08)', color: 'var(--primary)', fontSize: '11px' }}>
                      {project.domain}
                    </span>
                    <div style={{ 
                      display: 'flex', alignItems: 'center', gap: '5px', 
                      color: completion >= 100 ? '#10b981' : completion >= 50 ? '#f59e0b' : 'var(--primary)',
                      fontSize: '13px', fontWeight: 'bold',
                    }}>
                      <CheckCircle2 size={14} /> {completion}%
                    </div>
                  </div>
                  
                  <h3 style={{ marginBottom: '8px', fontSize: '17px' }}>{project.title}</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {project.description}
                  </p>
                  
                  <div className="progress-bar-container" style={{ height: '6px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '16px' }}>
                    <motion.div 
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${completion}%` }}
                      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%' }}
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94a3b8' }}>
                        <Clock size={13} /> {project.estimatedTime || '4 Weeks'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#94a3b8' }}>
                        <BarChart3 size={13} /> {project.difficultyLevel}
                      </span>
                    </div>
                    <motion.button 
                      className="btn btn-primary" 
                      style={{ padding: '6px 14px', fontSize: '12px' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Resume <ArrowRight size={13} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {projects.length > 0 && (
        <motion.div 
          style={{ marginTop: '40px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 style={{ fontSize: '22px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Star fill="var(--primary)" color="var(--primary)" size={22} /> Skill Achievements
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            
            {[
              { title: 'First Step Taken', desc: 'Begin your first roadmap.', icon: Zap, threshold: 0, color: 'var(--primary)', bg: 'rgba(79, 70, 229, 0.1)' },
              { title: 'Halfway Hacker', desc: 'Reach 50% completion.', icon: Code, threshold: 50, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
              { title: 'Master Builder', desc: '100% project completion.', icon: Trophy, threshold: 100, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
            ].map((badge, i) => {
              const unlocked = highestCompletion >= badge.threshold;
              return (
                <motion.div
                  key={badge.title}
                  className="card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    background: unlocked ? 'var(--dark)' : 'white',
                    color: unlocked ? 'white' : '#94a3b8',
                    border: unlocked ? 'none' : '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '20px',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {unlocked && (
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                      background: `linear-gradient(90deg, ${badge.color}, transparent)`,
                    }} />
                  )}
                  <div style={{ 
                    background: unlocked ? badge.bg : '#f1f5f9', 
                    padding: '12px', borderRadius: '12px', 
                    color: unlocked ? badge.color : '#cbd5e1',
                    transition: 'all 0.3s',
                  }}>
                    <badge.icon size={26} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', color: unlocked ? 'white' : '#64748b' }}>{badge.title}</h3>
                    <p style={{ margin: 0, opacity: 0.7, fontSize: '12px' }}>{badge.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardView;
