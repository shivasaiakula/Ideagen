import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronLeft, GraduationCap, Brain, Gauge, FolderKanban } from 'lucide-react';

const stepIcons = {
  level: { icon: GraduationCap, emoji: '🎓' },
  domain: { icon: Brain, emoji: '🧠' },
  difficulty: { icon: Gauge, emoji: '⚡' },
  type: { icon: FolderKanban, emoji: '📁' },
};

const optionEmojis = {
  'School': '🏫', 'Diploma': '📜', 'Undergraduate': '🎓', 'Postgraduate': '🔬',
  'IT': '💻', 'AI': '🤖', 'Web Development': '🌐', 'Data Science': '📊',
  'IoT': '📡', 'Cybersecurity': '🛡️', 'Mobile App': '📱',
  'Beginner': '🌱', 'Intermediate': '⚙️', 'Advanced': '🚀',
  'Mini Project': '📦', 'Major Project': '🏗️', 'Final-year Project': '🎯',
};

const steps = [
  { id: 'level', question: 'What is your academic level?', options: ['School', 'Diploma', 'Undergraduate', 'Postgraduate'] },
  { id: 'domain', question: 'Which domain interests you most?', options: ['IT', 'AI', 'Web Development', 'Data Science', 'IoT', 'Cybersecurity', 'Mobile App'] },
  { id: 'difficulty', question: 'Specify your desired difficulty level:', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { id: 'type', question: 'What type of project are you looking for?', options: ['Mini Project', 'Major Project', 'Final-year Project'] },
];

const StepForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSelect = (option) => {
    const stepId = steps[currentStep].id;
    const newAnswers = { ...answers, [stepId]: option };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 200);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const step = steps[currentStep];
  const StepIcon = stepIcons[step.id]?.icon || Brain;

  return (
    <motion.div 
      className="step-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Progress Bar */}
      <div className="step-progress-bar">
        {steps.map((s, i) => (
          <div
            key={s.id}
            className={`step-progress-segment ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
          />
        ))}
      </div>

      {/* Step Counter */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary), #6366f1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
          boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
        }}>
          <StepIcon size={18} />
        </div>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Step {currentStep + 1} of {steps.length}
        </span>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 style={{ marginBottom: '4px' }}>{step.question}</h1>
          <p style={{ marginBottom: '8px', fontSize: '15px' }}>Select the option that best describes you</p>

          <div className="option-grid">
            {step.options.map((option, i) => (
              <motion.div
                key={option}
                className={`option-card ${answers[step.id] === option ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="option-icon">{optionEmojis[option] || '📌'}</span>
                {option}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ marginTop: '36px', display: 'flex', gap: '12px' }}>
        {currentStep > 0 && (
          <motion.button 
            className="btn btn-outline" 
            onClick={handleBack}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ChevronLeft size={18} /> Back
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default StepForm;
