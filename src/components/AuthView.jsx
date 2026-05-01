import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, ArrowRight, Globe, Sparkles, Zap, Target, AlertCircle, Loader } from 'lucide-react';
import { signIn, signUp, signInWithGitHub, signInWithGoogle } from '../lib/db';

const AuthView = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { user, session } = await signIn(formData.email, formData.password);
        if (user) onLogin(user, session);
      } else {
        if (!formData.name.trim()) {
          setError('Please enter your full name.');
          setLoading(false);
          return;
        }
        const { user, session } = await signUp(formData.email, formData.password, formData.name);
        if (user) {
          if (session) {
            onLogin(user, session);
          } else {
            setError('✅ Account created! Check your email to confirm your address, then sign in.');
            setLoading(false);
            setIsLogin(true);
            return;
          }
        }
      }
    } catch (err) {
      const msg = err.message || 'Something went wrong. Please try again.';
      if (msg.includes('Invalid login credentials')) setError('Incorrect email or password.');
      else if (msg.includes('User already registered')) setError('An account with this email already exists. Please sign in.');
      else if (msg.includes('Password should')) setError('Password must be at least 6 characters.');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setOauthLoading(provider);
    setError('');
    try {
      if (provider === 'github') await signInWithGitHub();
      else await signInWithGoogle();
    } catch (err) {
      setError(err.message || `${provider} sign-in failed.`);
      setOauthLoading('');
    }
  };

  const features = [
    { icon: <Zap size={14} />, text: 'AI-Powered Matching' },
    { icon: <Target size={14} />, text: 'Industrial Blueprints' },
    { icon: <Sparkles size={14} />, text: 'Smart Mentor Chat' },
  ];

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card card"
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand */}
        <div className="auth-brand">
          <motion.div
            className="brand-icon"
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <Target size={30} />
          </motion.div>
        </div>

        <div className="auth-header">
          <motion.h2 initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            {isLogin ? 'Welcome Back' : 'Join IdeaGen'}
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {isLogin ? 'Continue your engineering journey' : 'Start building industrial projects today'}
          </motion.p>
        </div>

        {/* Feature Pills */}
        <motion.div
          style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {features.map((f, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '5px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 600,
              background: i === 0 ? 'rgba(79,70,229,0.08)' : i === 1 ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
              color: i === 0 ? '#4f46e5' : i === 1 ? '#059669' : '#d97706',
            }}>
              {f.icon} {f.text}
            </span>
          ))}
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '12px 16px', borderRadius: '10px', marginBottom: '16px',
                background: error.startsWith('✅') ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${error.startsWith('✅') ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                fontSize: '13px',
                color: error.startsWith('✅') ? '#059669' : '#dc2626',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

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
                <label><User size={14} /> Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={loading}
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="input-group">
            <label><Mail size={14} /> Email Address</label>
            <input
              type="email"
              placeholder="name@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
              required
            />
          </div>

          <div className="input-group">
            <label><Lock size={14} /> Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
              required
              minLength={6}
            />
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary auth-submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            style={{ opacity: loading ? 0.8 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? (
              <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> {isLogin ? 'Signing In...' : 'Creating Account...'}</>
            ) : (
              <>{isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="social-auth">
          <motion.button
            className="btn btn-outline social-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOAuth('github')}
            disabled={!!oauthLoading}
            style={{ opacity: oauthLoading === 'github' ? 0.7 : 1 }}
          >
            {oauthLoading === 'github' ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Globe size={18} />}
            GitHub
          </motion.button>
          <motion.button
            className="btn btn-outline social-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading}
            style={{ opacity: oauthLoading === 'google' ? 0.7 : 1 }}
          >
            {oauthLoading === 'google' ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Globe size={18} />}
            Google
          </motion.button>
        </div>

        <p className="auth-footer">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default AuthView;
