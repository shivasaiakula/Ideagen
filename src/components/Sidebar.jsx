import React from 'react';
import { Home, Lightbulb, Compass, Settings, Target, LogOut, User } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange, user, onLogout }) => {
  const menuItems = [
    { id: 'discover', icon: Lightbulb, label: 'Discover' },
    { id: 'explore', icon: Compass, label: 'Explore Ideas' },
    { id: 'dashboard', icon: Home, label: 'My Projects' },
    { id: 'planner', icon: Target, label: 'Roadmap' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Target size={32} />
        <span>IdeaGen</span>
      </div>
      
      <nav style={{ flex: 1 }}>
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''} ${!user ? 'disabled' : ''}`}
            onClick={() => user && onTabChange(item.id)}
          >
            <item.icon size={20} />
            {item.label}
          </div>
        ))}
      </nav>

      {user ? (
        <div style={{ marginTop: 'auto' }}>
          <div className="nav-item user-profile">
            <User size={20} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{user.name}</span>
              <span style={{ fontSize: '11px', opacity: 0.7 }}>Engineering Student</span>
            </div>
          </div>
          <div className="nav-item" onClick={onLogout} style={{ color: '#ef4444' }}>
            <LogOut size={20} />
            Logout
          </div>
          <div className="nav-item">
            <Settings size={20} />
            Settings
          </div>
        </div>
      ) : (
        <div className="nav-item active">
          <User size={20} />
          Login Required
        </div>
      )}
    </div>
  );
};

export default Sidebar;
