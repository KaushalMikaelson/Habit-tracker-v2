import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Zap, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';

    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email address';

    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.confirm !== form.password) errs.confirm = 'Passwords do not match';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await signup(form.name.trim(), form.email, form.password);
    if (result.success) navigate('/');
  };

  const fields = [
    {
      id: 'signup-name', name: 'name', label: 'Full Name',
      type: 'text', placeholder: 'John Doe', icon: User,
      autoComplete: 'name',
    },
    {
      id: 'signup-email', name: 'email', label: 'Email',
      type: 'email', placeholder: 'you@example.com', icon: Mail,
      autoComplete: 'email',
    },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <Zap size={22} color="#0d1117" strokeWidth={2.5} />
          </div>
          <div>
            <div style={styles.logoTitle}>Habit Tracker</div>
            <div style={styles.logoSub}>Start your journey</div>
          </div>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>Join thousands building better habits</p>

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Name + Email */}
          {fields.map(({ id, name, label, type, placeholder, icon: Icon, autoComplete }) => (
            <div key={name} style={styles.field}>
              <label className="input-label" htmlFor={id}>{label}</label>
              <div style={styles.inputWrap}>
                <Icon size={16} style={styles.inputIcon} />
                <input
                  id={id}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  placeholder={placeholder}
                  value={form[name]}
                  onChange={handleChange}
                  style={{
                    ...styles.input,
                    paddingLeft: 42,
                    borderColor: errors[name] ? '#ef4444' : undefined,
                  }}
                />
              </div>
              {errors[name] && <span style={styles.errorMsg}>{errors[name]}</span>}
            </div>
          ))}

          {/* Password */}
          <div style={styles.field}>
            <label className="input-label" htmlFor="signup-password">Password</label>
            <div style={styles.inputWrap}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  paddingLeft: 42,
                  paddingRight: 42,
                  borderColor: errors.password ? '#ef4444' : undefined,
                }}
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)} style={styles.eyeBtn} tabIndex={-1}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span style={styles.errorMsg}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div style={styles.field}>
            <label className="input-label" htmlFor="signup-confirm">Confirm Password</label>
            <div style={styles.inputWrap}>
              <Lock size={16} style={styles.inputIcon} />
              <input
                id="signup-confirm"
                name="confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                style={{
                  ...styles.input,
                  paddingLeft: 42,
                  paddingRight: 42,
                  borderColor: errors.confirm ? '#ef4444' : undefined,
                }}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} style={styles.eyeBtn} tabIndex={-1}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirm && <span style={styles.errorMsg}>{errors.confirm}</span>}
          </div>

          {/* Submit */}
          <button
            id="signup-submit-btn"
            type="submit"
            disabled={isLoading}
            style={styles.submitBtn}
          >
            {isLoading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Spinner size={18} color="#0d1117" />
                Creating account…
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  blob1: {
    position: 'absolute',
    top: '-10%',
    right: '-5%',
    width: 400,
    height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blob2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-5%',
    width: 450,
    height: 450,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: 20,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 1,
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 28,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: 'linear-gradient(135deg, var(--accent-green), #00c9ff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTitle: {
    fontSize: '1.05rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, var(--accent-green), #00c9ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.02em',
  },
  logoSub: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  heading: {
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: 6,
  },
  subheading: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    marginBottom: 28,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  inputWrap: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    background: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    padding: '11px 14px',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: 2,
    display: 'flex',
    alignItems: 'center',
  },
  errorMsg: {
    fontSize: '0.78rem',
    color: '#ef4444',
    marginTop: 2,
  },
  submitBtn: {
    marginTop: 6,
    width: '100%',
    padding: '13px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, var(--accent-purple), #ec4899)',
    color: 'white',
    fontWeight: 700,
    fontSize: '0.95rem',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.15s, box-shadow 0.15s',
    fontFamily: 'inherit',
  },
  footerText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: '0.875rem',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--accent-green)',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
