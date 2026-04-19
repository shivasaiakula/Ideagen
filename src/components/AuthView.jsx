import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, Globe } from 'lucide-react';

const AuthView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate real persistence
    const users = JSON.parse(localStorage.getItem('ideagen_registered_users') || '[]');
    
    if (isLogin) {
      const existingUser = users.find(u => u.email === formData.email && u.password === formData.password);
      if (existingUser) {
        onLogin(existingUser);
      } else {
        alert('Invalid email or password');
      }
    } else {
      const alreadyExists = users.some(u => u.email === formData.email);
      if (alreadyExists) {
        alert('Email already registered');
        return;
      }
      
      const newUser = { 
        name: formData.name || 'Student', 
        email: formData.email, 
        password: formData.password,
        registeredAt: new Date().toISOString() 
      };
      
      users.push(newUser);
      localStorage.setItem('ideagen_registered_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <h2>{isLogin ? 'Welcome Back' : 'Join IdeaGen'}</h2>
          <p>{isLogin ? 'Continue your engineering journey' : 'Start building industrial projects today'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                key="name"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="input-group"
              >
                <label><User size={16} /> Full Name</label>
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              placeholder="name@university.edu" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
            />
          </div>

          <div className="input-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit">
            {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <div className="social-auth">
          <button className="btn btn-outline social-btn"><Globe size={20} /> GitHub</button>
          <button className="btn btn-outline social-btn"><Globe size={20} /> Google</button>
        </div>

        <p className="auth-footer">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthView;
