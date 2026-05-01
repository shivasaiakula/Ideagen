import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Globe, Sparkles, FileText, ExternalLink } from 'lucide-react';

const PortfolioExporter = ({ project }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState('linkedin');

  const formats = {
    linkedin: {
      label: '🔗 LinkedIn',
      snippet: `🚀 Currently building: ${project.title}

${project.description}

Tech Stack: ${project.techStack?.join(' • ')}

Key achievements:
✅ Architected core system using ${project.techStack?.[0]} following industry best practices
✅ Followed a phased roadmap: ${project.roadmap?.[0]?.title} → ${project.roadmap?.[1]?.title}
✅ Optimized development workflow using AI-engineered blueprints

#${project.domain?.replace(/\s/g, '')} #SoftwareEngineering #StudentProject #IdeaGen`,
    },
    resume: {
      label: '📄 Resume',
      snippet: `${project.title} | ${project.domain}
Technologies: ${project.techStack?.join(', ')}

• Designed and implemented a ${project.difficultyLevel?.toLowerCase()} level ${project.type?.toLowerCase()} following an industrial blueprint methodology
• Led phased development: ${project.roadmap?.map(p => p.title).join(' → ')}
• Applied ${project.techStack?.[0]} for core system architecture with best-practice patterns
• Estimated delivery: ${project.estimatedTime}`,
    },
    github: {
      label: '⚡ GitHub README',
      snippet: `# ${project.title}

> ${project.description}

## 🛠 Tech Stack
${project.techStack?.map(t => `- ${t}`).join('\n')}

## 📋 Roadmap
${project.roadmap?.map((p, i) => `### Phase ${i + 1}: ${p.title}\n${p.steps?.map(s => `- [ ] ${s}`).join('\n')}`).join('\n\n')}

## 🔮 Future Scope
${project.futureScope}

---
*Built with [IdeaGen](https://ideagen.app) — AI-powered project discovery*`,
    },
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formats[activeFormat].snippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      style={{
        marginTop: '28px',
        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.02) 0%, rgba(255, 255, 255, 0.95) 100%)',
        border: '1px solid rgba(79, 70, 229, 0.1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '17px', marginBottom: '4px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: 'rgba(0, 119, 181, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Globe size={17} color="#0077b5" />
            </div>
            Portfolio Exporter
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginLeft: '41px' }}>
            Generate a professional snippet for your Resume, LinkedIn, or GitHub.
          </p>
        </div>
        <motion.button
          className="btn btn-primary"
          onClick={handleCopy}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{ flexShrink: 0, gap: '7px' }}
        >
          <AnimatePresence mode="wait">
            {isCopied ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Check size={16} /> Copied!
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Copy size={16} /> Copy Snippet
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Format Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {Object.entries(formats).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setActiveFormat(key)}
            style={{
              padding: '7px 14px',
              borderRadius: '100px',
              border: `1.5px solid ${activeFormat === key ? 'var(--primary)' : '#e2e8f0'}`,
              background: activeFormat === key ? 'rgba(79, 70, 229, 0.06)' : 'white',
              color: activeFormat === key ? 'var(--primary)' : '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {val.label}
          </button>
        ))}
      </div>

      {/* Snippet Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFormat}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            padding: '20px 22px',
            borderRadius: '14px',
            fontSize: '12.5px',
            fontFamily: '"Fira Code", "Courier New", monospace',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.7,
            maxHeight: '220px',
            overflowY: 'auto',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {formats[activeFormat].snippet}
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
        <Sparkles size={12} color="#94a3b8" />
        <span style={{ fontSize: '11px', color: '#94a3b8' }}>AI-verified project blueprint · Ready to paste</span>
      </div>
    </motion.div>
  );
};

export default PortfolioExporter;
