import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, Download, ExternalLink, Globe } from 'lucide-react';

const PortfolioExporter = ({ project, user }) => {
  const [isCopied, setIsCopied] = useState(false);

  const portfolioSnippet = `
### Industrial Project: ${project.title}
**Domain:** ${project.domain} | **Role:** Software Engineering Trainee
**Tech Stack:** ${project.techStack.join(', ')}

#### Project Summary
Transformed high-level requirements into a production-ready system following the IdeaGen industrial blueprint. Implemented a phased development roadmap focusing on ${project.roadmap[0].title} and ${project.roadmap[1].title}.

#### Key Achievements
- Architected the core system using ${project.techStack[0]} following best practices.
- Managed end-to-end development phases from setup to production deployment.
- Optimized development workflow using AI-engineered prompts for rapid prototyping.

*Verified via shivasaiakula build platform*
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioSnippet);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="portfolio-exporter card" style={{ marginTop: '24px', background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={20} color="#0077b5" /> Portfolio Exporter
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>Generate a professional snippet for your Resume or LinkedIn.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCopy} style={{ gap: '8px' }}>
          {isCopied ? <Check size={18} /> : <Copy size={18} />}
          {isCopied ? 'Copied!' : 'Copy Snippet'}
        </button>
      </div>

      <div className="snippet-preview" style={{ 
        background: '#1e293b', 
        color: '#e2e8f0', 
        padding: '20px', 
        borderRadius: '12px', 
        fontSize: '13px', 
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        maxHeight: '200px',
        overflowY: 'auto'
      }}>
        {portfolioSnippet}
      </div>
    </div>
  );
};

export default PortfolioExporter;
