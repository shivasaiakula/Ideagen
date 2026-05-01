import React from 'react';
import { motion } from 'framer-motion';

const SkillRadar = ({ skills }) => {
  const categories = Object.keys(skills);
  const data = Object.values(skills);
  const size = 220;
  const center = size / 2;
  const radius = size * 0.36;

  const getPoint = (value, index, total) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const x = center + (radius * value / 100) * Math.cos(angle);
    const y = center + (radius * value / 100) * Math.sin(angle);
    return { x, y };
  };

  const points = categories.map((_, i) => getPoint(data[i], i, categories.length));
  const polyPoints = points.map(p => `${p.x},${p.y}`).join(' ');
  const gridLevels = [25, 50, 75, 100];

  const skillColors = {
    frontend: '#4f46e5',
    backend: '#10b981',
    ai: '#f59e0b',
    uiux: '#ec4899',
    database: '#06b6d4',
    devops: '#8b5cf6',
  };

  const getBarColor = (cat) => skillColors[cat.toLowerCase()] || '#4f46e5';

  return (
    <div style={{ textAlign: 'center' }}>
      {/* SVG Radar */}
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width={size} height={size}>
          {/* Grid Polygons */}
          {gridLevels.map(level => {
            const gridPoints = categories.map((_, i) => getPoint(level, i, categories.length));
            const gridPoly = gridPoints.map(p => `${p.x},${p.y}`).join(' ');
            return (
              <polygon
                key={level}
                points={gridPoly}
                fill={level === 100 ? 'rgba(79, 70, 229, 0.02)' : 'none'}
                stroke="#e8eaf0"
                strokeWidth="1"
                strokeDasharray={level === 50 ? '4,3' : 'none'}
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
                stroke="#e8eaf0"
                strokeWidth="1"
              />
            );
          })}

          {/* Gradient fill area */}
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(79, 70, 229, 0.35)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0.15)" />
            </linearGradient>
            <filter id="radarGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Skill Area */}
          <motion.polygon
            points={polyPoints}
            fill="url(#radarGradient)"
            stroke="rgba(79, 70, 229, 0.8)"
            strokeWidth="2"
            strokeLinejoin="round"
            filter="url(#radarGlow)"
            initial={{ opacity: 0, scale: 0, originX: '50%', originY: '50%' }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={4}
              fill="white"
              stroke="var(--primary)"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.3 }}
            />
          ))}

          {/* Labels */}
          {categories.map((cat, i) => {
            const p = getPoint(122, i, categories.length);
            return (
              <text
                key={cat}
                x={p.x}
                y={p.y}
                fontSize="10"
                fontWeight="700"
                fill="#64748b"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}
              >
                {cat}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Skill Bars Legend */}
      <div style={{ marginTop: '16px' }}>
        {categories.map((cat, i) => (
          <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', width: '52px', textAlign: 'right', letterSpacing: '0.05em' }}>
              {cat}
            </div>
            <div style={{ flex: 1, height: '5px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${data[i]}%` }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                style={{ height: '100%', background: getBarColor(cat), borderRadius: '10px' }}
              />
            </div>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#475569', width: '28px' }}>
              {data[i]}%
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>Skill Balance Radar</h4>
        <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>Technical domain distribution</p>
      </div>
    </div>
  );
};

export default SkillRadar;
