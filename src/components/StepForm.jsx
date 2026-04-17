import React, { useState } from 'react';
import { ArrowRight, ChevronLeft } from 'lucide-react';

const steps = [
  {
    id: 'level',
    question: 'What is your academic level?',
    options: ['School', 'Diploma', 'Undergraduate', 'Postgraduate'],
  },
  {
    id: 'domain',
    question: 'Which domain interests you most?',
    options: ['IT', 'AI', 'Web Development', 'Data Science', 'IoT', 'Cybersecurity', 'Mobile App'],
  },
  {
    id: 'difficulty',
    question: 'Specify your desired difficulty level:',
    options: ['Beginner', 'Intermediate', 'Advanced'],
  },
  {
    id: 'type',
    question: 'What type of project are you looking for?',
    options: ['Mini Project', 'Major Project', 'Final-year Project'],
  }
];

const StepForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleSelect = (option) => {
    const stepId = steps[currentStep].id;
    const newAnswers = { ...answers, [stepId]: option };
    setAnswers(newAnswers);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(newAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const step = steps[currentStep];

  return (
    <div className="step-container fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1a73e8', fontWeight: 600, marginBottom: '8px' }}>
        <span>Step {currentStep + 1} of {steps.length}</span>
      </div>
      <h1>{step.question}</h1>
      
      <div className="option-grid">
        {step.options.map((option) => (
          <div
            key={option}
            className={`option-card ${answers[step.id] === option ? 'selected' : ''}`}
            onClick={() => handleSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
        {currentStep > 0 && (
          <button className="btn btn-outline" onClick={handleBack}>
            <ChevronLeft size={20} /> Back
          </button>
        )}
      </div>
    </div>
  );
};

export default StepForm;
