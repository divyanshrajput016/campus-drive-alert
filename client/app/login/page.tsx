'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
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
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(29, 65, 227, 0.2) 0%, transparent 70%);
    top: 10%;
    left: 15%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(82, 117, 242, 0.15) 0%, transparent 70%);
    bottom: 10%;
    right: 15%;
    pointer-events: none;
  }
`;

const AuthCard = styled.div`
  background: var(--surface-bg, rgba(23, 23, 23, 0.8));
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--bm-radius-modal, 16px);
  padding: 40px 36px;
  width: 100%;
  max-width: 440px;
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
  margin-bottom: 32px;

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
  gap: 20px;
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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

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
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      setAlertConfig({
        isOpen: true,
        type: 'success',
        title: 'Welcome Back!',
        message: 'You have successfully signed in to CampusDrive Tracker.',
      });
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <AuthCard>
        <Header>
          <div className="tag">
            <ShieldCheck size={13} />
            <span>Student Portal</span>
          </div>
          <h1>
            Sign In<span className="accent">back</span>
          </h1>
          <p>Access active placement drives & manage alert preferences</p>
        </Header>

        {errorMessage && (
          <ErrorAlert>
            <span>{errorMessage}</span>
          </ErrorAlert>
        )}

        <Form onSubmit={handleSubmit}>
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
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <AnimatedButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={<LogIn size={18} />}
            style={{ marginTop: '8px' }}
          >
            Sign In
          </AnimatedButton>
        </Form>

        <FooterText>
          Don&apos;t have an account?{' '}
          <Link href="/signup">Create one here</Link>
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
