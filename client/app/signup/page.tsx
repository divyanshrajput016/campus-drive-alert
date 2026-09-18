'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, UserPlus, Sparkles, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatedButton } from '../components/AnimatedButton';
import { NeumorphicInput } from '../components/NeumorphicInput';
import { SweetAlertBox } from '../components/SweetAlertBox';

const PageWrapper = styled.main`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 380px;
    height: 380px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29, 65, 227, 0.22) 0%, transparent 70%);
    top: 5%;
    right: 10%;
    pointer-events: none;
  }
`;

const AuthCard = styled.div`
  background: var(--surface-bg, rgba(23, 23, 23, 0.8));
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--bm-radius-modal, 16px);
  padding: 40px 36px;
  width: 100%;
  max-width: 480px;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: var(--bm-shadow-lg);
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    padding: 32px 24px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    color: var(--bm-primary-500);
    background: rgba(29, 65, 227, 0.1);
    border: 1px solid rgba(82, 117, 242, 0.3);
    padding: 4px 12px;
    border-radius: var(--bm-radius-tag, 6px);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 12px;
  }

  h1 {
    font-size: 26px;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 8px;

    .accent {
      font-family: var(--bm-font-accent);
      color: var(--bm-primary-500);
      font-weight: 400;
      margin-left: 6px;
    }
  }

  p {
    font-size: 14px;
    color: var(--text-secondary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ErrorAlert = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
  padding: 10px 14px;
  border-radius: var(--bm-radius-button, 8px);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FooterText = styled.p`
  text-align: center;
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 24px;

  a {
    color: var(--bm-primary-500);
    font-weight: 600;
    margin-left: 4px;
    text-decoration: underline;

    &:hover {
      color: var(--bm-primary-400);
    }
  }
`;

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [alertConfig, setAlertConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
      setAlertConfig({
        isOpen: true,
        type: 'success',
        title: 'Account Created!',
        message: 'Your account has been registered. Welcome to CampusDrive Tracker.',
      });
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Email might already exist.');
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AuthCard>
        <Header>
          <div className="tag">
            <Sparkles size={13} />
            <span>Join Now</span>
          </div>
          <h1>
            Create<span className="accent">account</span>
          </h1>
          <p>Sign up to track verified campus placement drives</p>
        </Header>

        {errorMessage && (
          <ErrorAlert>
            <span>{errorMessage}</span>
          </ErrorAlert>
        )}

        <Form onSubmit={handleSubmit}>
          <NeumorphicInput
            label="Full Name"
            type="text"
            required
            fullWidth
            icon={<User size={16} />}
            placeholder="e.g. Divyansh Rajput"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <NeumorphicInput
            label="College Email Address"
            type="email"
            required
            fullWidth
            icon={<Mail size={16} />}
            placeholder="student@acropolis.in"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <NeumorphicInput
            label="Password"
            type="password"
            required
            fullWidth
            icon={<Lock size={16} />}
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <AnimatedButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={<UserPlus size={18} />}
            style={{ marginTop: '8px' }}
          >
            Create Account
          </AnimatedButton>
        </Form>

        <FooterText>
          Already have an account?{' '}
          <Link href="/login">Sign in here</Link>
        </FooterText>
      </AuthCard>

      <SweetAlertBox
        isOpen={alertConfig.isOpen}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        confirmText="Go to Dashboard"
        onConfirm={() => {
          setAlertConfig(prev => ({ ...prev, isOpen: false }));
          router.push('/');
        }}
        onClose={() => {
          setAlertConfig(prev => ({ ...prev, isOpen: false }));
          router.push('/');
        }}
      />
    </PageWrapper>
  );
}
