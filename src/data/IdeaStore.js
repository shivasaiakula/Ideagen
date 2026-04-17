export const projectIdeas = [
  {
    id: 'greenloop',
    title: 'GreenLoop: Smart Recycling Hub',
    description: 'A community-driven platform that uses AI and geolocation to optimize recycling habits and locate nearby eco-centers.',
    features: [
      'Interactive Map using Google Maps API',
      'AI Waste Categorizer (Computer Vision)',
      'Community Leaderboard & Rewards',
      'Real-time Eco-Impact Tracking'
    ],
    technologies: ['React', 'Node.js', 'PyTorch', 'Google Maps API'],
    difficultyLevel: 'Intermediate',
    advantages: 'Practical real-world impact, high scalability, integrates multiple APIs.',
    disadvantages: 'Requires accurate datasets for waste classification.',
    whyGoodChoice: 'Addresses climate change while demonstrating full-stack and AI skills.',
    estimatedTime: '4-6 Weeks',
    futureScope: 'Integration with municipal waste management systems.',
    domain: 'AI',
    level: 'Undergraduate',
    type: 'Major Project',
    roadmap: [
      { title: 'Research & Data Collection', desc: 'Identify local recycling rules and gather images for AI training.' },
      { title: 'MVP Development', desc: 'Setup basic React app and integrate Google Maps.' },
      { title: 'AI Integration', desc: 'Implement the waste categorization model using PyTorch.' },
      { title: 'Testing & Deployment', desc: 'Beta test with community members and deploy to cloud.' }
    ]
  },
  {
    id: 'skillswap',
    title: 'SkillSwap: Peer-to-Peer Mentorship',
    description: 'A decentralized platform where students can exchange skills through video calls and real-time collaboration.',
    features: [
      'Real-time Chat with Socket.io',
      'WebRTC Video Conferencing',
      'Skill Matching Algorithm',
      'User Rating & Endorsement System'
    ],
    technologies: ['React', 'Express', 'Socket.io', 'WebRTC'],
    difficultyLevel: 'Advanced',
    advantages: 'Strong focus on real-time networking and complex state management.',
    disadvantages: 'Video latency management can be tricky.',
    whyGoodChoice: 'Highly impressive for portfolios; solves a common student problem.',
    estimatedTime: '6-8 Weeks',
    futureScope: 'AI-based career path recommendations.',
    domain: 'Web Development',
    level: 'Postgraduate',
    type: 'Final-year Project',
    roadmap: [
      { title: 'Architecture Design', desc: 'Plan the WebRTC signaling flow and DB schema.' },
      { title: 'Signaling Server', desc: 'Build the Socket.io server for connection handling.' },
      { title: 'Video Implementation', desc: 'Develop the WebRTC peer connection logic.' },
      { title: 'Mentorship Features', desc: 'Add ratings, profiles, and scheduling.' }
    ]
  },
  {
    id: 'iot-agri',
    title: 'Smart Farming: IoT Soil Monitor',
    description: 'An IoT solution using sensors to monitor soil moisture and pH, providing real-time data to farmers via a dashboard.',
    features: [
      'ESP32 Sensor Integration',
      'Real-time MQTT Data Streaming',
      'Custom Analytics Dashboard',
      'Automated Irrigation Trigger'
    ],
    technologies: ['Arduino/C++', 'Node-RED', 'React', 'MQTT'],
    difficultyLevel: 'Intermediate',
    advantages: 'Tangible hardware project with direct social benefit.',
    disadvantages: 'Requires physical hardware components.',
    whyGoodChoice: 'Perfect for demonstrating IoT and embedded systems knowledge.',
    estimatedTime: '4-5 Weeks',
    futureScope: 'Satellite data integration for weather forecasting.',
    domain: 'IoT',
    level: 'Diploma',
    type: 'Major Project',
    roadmap: [
      { title: 'Hardware Setup', desc: 'Connect sensors to ESP32 and test readings.' },
      { title: 'Data Pipeline', desc: 'Setup MQTT broker and stream data to the backend.' },
      { title: 'Dashboard Development', desc: 'Create the React UI for data visualization.' },
      { title: 'Automation Logic', desc: 'Program the relay triggers for irrigation.' }
    ]
  },
  {
    id: 'securescan',
    title: 'SecureScan: Vulnerability Inspector',
    description: 'A lightweight tool that scans small-scale web applications for common security vulnerabilities (OWASP Top 10).',
    features: [
      'SQL Injection Tester',
      'XSS Payload Injection Simulator',
      'Comprehensive Security Report Generator',
      'Real-time Threat Alerts'
    ],
    technologies: ['Python', 'React', 'OWASP ZAP API'],
    difficultyLevel: 'Advanced',
    advantages: 'Deep dive into cybersecurity and automated testing.',
    disadvantages: 'Must be used ethically; requires a sandboxed environment.',
    whyGoodChoice: 'Extremely relevant for the current tech landscape.',
    estimatedTime: '5-7 Weeks',
    futureScope: 'Docker integration for automated CI/CD scans.',
    domain: 'Cybersecurity',
    level: 'Postgraduate',
    type: 'Final-year Project',
    roadmap: [
      { title: 'Scope Definition', desc: 'Identify which OWASP vulnerabilities to target.' },
      { title: 'Scanner Engine', desc: 'Write the Python scripts for automated payloads.' },
      { title: 'Reporting Module', desc: 'Format results into PDF/HTML reports.' },
      { title: 'GUI Development', desc: 'Build the React dashboard for controlling scans.' }
    ]
  },
  {
    id: 'datawiz',
    title: 'DataWiz: Personal Budget Visualizer',
    description: 'A clean, intuitive dashboard that transforms complex financial data into actionable visual insights.',
    features: [
      'Interactive Charts using D3.js',
      'CSV/JSON Data Import',
      'Predictive Spending AI',
      'Secure Local Storage'
    ],
    technologies: ['React', 'D3.js', 'Firebase Auth'],
    difficultyLevel: 'Beginner',
    advantages: 'Visually stunning; focuses on frontend data handling.',
    disadvantages: 'Limited to frontend logic unless backend is added.',
    whyGoodChoice: 'Great for beginners wanting to learn data visualization.',
    estimatedTime: '2-3 Weeks',
    futureScope: 'Direct bank API integration (Plaid).',
    domain: 'Data Science',
    level: 'School',
    type: 'Mini Project',
    roadmap: [
      { title: 'Basic UI', desc: 'Design the input forms and layout.' },
      { title: 'Data Processing', desc: 'Implement CSV parsing and data cleaning logic.' },
      { title: 'D3 Integration', desc: 'Create the dynamic bar and pie charts.' },
      { title: 'Persistence', desc: 'Add local storage or Firebase to save data.' }
    ]
  },
  {
    id: 'medi-bot',
    title: 'MediBot: AI Symptom Checker',
    description: 'An AI-powered chatbot that helps users identify potential illnesses based on symptoms and suggests nearby doctors.',
    features: [
      'NLP for Symptom Analysis',
      'Doctor Appointment Scheduling',
      'Medical History Encrypted Vault',
      'Integration with Pharmacy APIs'
    ],
    technologies: ['Python/Flask', 'React', 'TensorFlow', 'PostgreSQL'],
    difficultyLevel: 'Advanced',
    advantages: 'Solves a critical accessibility problem in healthcare.',
    disadvantages: 'Requires strict data privacy compliance.',
    whyGoodChoice: 'Strong use case for AI and full-stack development.',
    estimatedTime: '6-8 Weeks',
    futureScope: 'Real-time video consultation with doctors.',
    domain: 'AI, Web Development',
    level: 'Undergraduate',
    type: 'Final-year Project',
    roadmap: [
      { title: 'Dataset Prep', desc: 'Acquire and clean medical symptom datasets.' },
      { title: 'NLP Model', desc: 'Train the classification model using TensorFlow.' },
      { title: 'Chatbot UI', desc: 'Develop the conversational interface in React.' },
      { title: 'Security Setup', desc: 'Implement encryption for user medical data.' }
    ]
  }
];
