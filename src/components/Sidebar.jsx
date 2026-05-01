import React from 'react';
import { motion } from 'framer-motion';
import { Home, Lightbulb, Compass, Settings, Target, LogOut, User, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, user, onLogout }) => {
  const menuItems = [
    { id: 'discover', icon: Lightbulb, label: 'Discover', desc: 'Find projects' },
    { id: 'explore', icon: Compass, label: 'Explore Ideas', desc: 'Browse library' },
    { id: 'dashboard', icon: Home, label: 'My Projects', desc: 'Track progress' },
    { id: 'planner', icon: Target, label: 'Roadmap', desc: 'Build plan' },
  ];

  return (
    <div className="sidebar">
      <motion.div 
        className="sidebar-header"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Target size={30} />
        <span>IdeaGen</span>
      </motion.div>
      
      <nav style={{ flex: 1 }}>
        {menuItems.map((item, i) => (
          <motion.div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''} ${!user ? 'disabled' : ''}`}
            onClick={() => user && onTabChange(item.id)}
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileHover={user ? { x: 4 } : {}}
            whileTap={user ? { scale: 0.97 } : {}}
            style={{ opacity: !user ? 0.5 : 1, cursor: !user ? 'not-allowed' : 'pointer' }}
          >
            <item.icon size={19} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px' }}>{item.label}</div>
              {activeTab === item.id && (
                <motion.div 
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 0.7, width: 'auto' }}
                  style={{ fontSize: '11px', fontWeight: 400, marginTop: '1px' }}
                >
                  {item.desc}
                </motion.div>
              )}
            </div>
            {activeTab === item.id && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
          </motion.div>
        ))}
      </nav>

      {user ? (
        <motion.div 
          style={{ marginTop: 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #e2e8f0, transparent)', margin: '12px 0 16px' }} />
          
          <div className="nav-item" style={{ cursor: 'default' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '14px', fontWeight: 700,
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)',
            }}>
              {user.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dark)' }}>{user.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Engineering Student</span>
            </div>
          </div>

          <motion.div 
            className="nav-item" 
            onClick={onLogout} 
            style={{ color: '#ef4444', fontSize: '13px' }}
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.97 }}
          >
            <LogOut size={17} />
            Logout
          </motion.div>
        </motion.div>
      ) : (
        <div className="nav-item active" style={{ marginTop: 'auto' }}>
          <User size={18} />
          Login Required
        </div>
      )}
    </div>
  );
};

export default Sidebar;
