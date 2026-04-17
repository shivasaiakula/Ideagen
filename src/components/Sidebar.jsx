import React from 'react';
import { Home, Lightbulb, Compass, Settings, Target } from 'lucide-react';

const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'discover', icon: Lightbulb, label: 'Discover' },
    { id: 'explore', icon: Compass, label: 'Explore Ideas' },
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
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon size={20} />
            {item.label}
          </div>
        ))}
      </nav>

      <div className="nav-item">
        <Settings size={20} />
        Settings
      </div>
    </div>
  );
};

export default Sidebar;
