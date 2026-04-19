import React from 'react';
import { motion } from 'framer-motion';

const SkillRadar = ({ skills }) => {
  const categories = Object.keys(skills);
  const data = Object.values(skills);
  const size = 200;
  const center = size / 2;
  const radius = size * 0.4;

  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const x = center + (radius * value / 100) * Math.cos(angle);
    const y = center + (radius * value / 100) * Math.sin(angle);
    return { x, y };
  };

  const points = categories.map((_, i) => getPoint(data[i], i, categories.length));
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="skill-radar" style={{ textAlign: 'center' }}>
      <svg width={size} height={size}>
        {/* Grid Lines */}
        {gridLevels.map(level => {
          const gridPoints = categories.map((_, i) => getPoint(level, i, categories.length));
          const gridPoly = gridPoints.map(p => `${p.x},${p.y}`).join(' ');
          return (
            <polygon 
              key={level}
              points={gridPoly} 
              fill="none" 
              stroke="#e2e8f0" 
              strokeWidth="1" 
            />
          );
        })}

        {/* Axis Lines */}
        {categories.map((_, i) => {
          const p = getPoint(100, i, categories.length);
          return (
            <line 
              key={i} 
              x1={center} y1={center} 
              x2={p.x} y2={p.y} 
              stroke="#e2e8f0" 
            />
          );
        })}

        {/* Skill Area */}
        <motion.polygon 
          points={polyPoints}
          fill="rgba(79, 70, 229, 0.2)"
          stroke="var(--primary)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Labels */}
        {categories.map((cat, i) => {
          const p = getPoint(115, i, categories.length);
          return (
            <text 
              key={cat} 
              x={p.x} y={p.y} 
              fontSize="10" 
              fontWeight="600"
              fill="#64748b" 
              textAnchor="middle"
              style={{ textTransform: 'uppercase' }}
            >
              {cat}
            </text>
          );
        })}
      </svg>
      <div style={{ marginTop: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--primary)' }}>Skill Balance Radar</h4>
        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Technical domain distribution</p>
      </div>
    </div>
  );
};

export default SkillRadar;
