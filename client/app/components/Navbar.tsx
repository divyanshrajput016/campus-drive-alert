'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AnimatedButton } from './AnimatedButton';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Briefcase, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  UserPlus,
  Bell,
  BellOff
} from 'lucide-react';

const NavContainer = styled.nav`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  background: var(--surface-bg, rgba(23, 23, 23, 0.8));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--surface-border, rgba(255, 255, 255, 0.1));
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
`;

const NavInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const BrandLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  cursor: pointer;

  .logo-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, #1D41E3 0%, #5275F2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    box-shadow: 0px 4px 12px rgba(29, 65, 227, 0.35);
  }

  .brand-text {
    display: flex;
    flex-direction: column;

    h1 {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--text-primary);
      line-height: 1.2;

      span {
        color: var(--bm-primary-500, #1D41E3);
      }
    }

    .tagline {
      font-size: 11px;
      color: var(--text-secondary);
      font-weight: 500;
      letter-spacing: 0.2px;
    }
  }
`;

const ControlsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserChip = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--card-bg);
  border: 1px solid var(--surface-border);
  padding: 6px 14px;
  border-radius: var(--bm-radius-button, 8px);
  font-size: 13px;

  .avatar {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--bm-primary-500);
    color: #FFFFFF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 12px;
  }

  .user-info {
    display: flex;
    flex-direction: column;

    .name {
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    .email {
      font-size: 11px;
      color: var(--text-muted);
    }
  }

  .bell-status {
    color: ${props => (props.theme ? '#22C55E' : '#737373')};
  }
`;

const ThemeToggleButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--bm-radius-button, 8px);
  cursor: pointer;
  background: var(--stage-bg);
  color: var(--text-primary);
  border: 1px solid var(--surface-border);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--bm-primary-400);
    color: var(--bm-primary-500);
  }
`;

const MobileMenuToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--bm-radius-button, 8px);
  background: transparent;
  border: 1px solid var(--surface-border);
  color: var(--text-primary);
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobilePanel = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: ${props => (props.$isOpen ? '20px 24px 24px' : '0 24px')};
    max-height: ${props => (props.$isOpen ? '400px' : '0')};
    opacity: ${props => (props.$isOpen ? 1 : 0)};
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    border-top: ${props => (props.$isOpen ? '1px solid var(--surface-border)' : 'none')};
  }
`;

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <NavContainer>
      <NavInner>
        <BrandLink href="/">
          <div className="logo-icon">
            <Briefcase size={20} />
          </div>
          <div className="brand-text">
            <h1>Campus<span>Drive</span></h1>
            <span className="tagline">Official Database Tracker</span>
          </div>
        </BrandLink>

        <ControlsGroup>
          <ThemeToggleButton onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#1D41E3" />}
          </ThemeToggleButton>

          {user ? (
            <>
              <UserChip>
                <div className="avatar">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="user-info">
                  <span className="name">{user.name}</span>
                  <span className="email">{user.email}</span>
                </div>
                <div title={user.sendNotification ? 'Alerts ON' : 'Alerts OFF'}>
                  {user.sendNotification ? (
                    <Bell size={16} color="#22C55E" />
                  ) : (
                    <BellOff size={16} color="#737373" />
                  )}
                </div>
              </UserChip>

              <AnimatedButton
                variant="outline"
                size="sm"
                icon={<LogOut size={16} />}
                onClick={logout}
              >
                Logout
              </AnimatedButton>
            </>
          ) : (
            <>
              <Link href="/login">
                <AnimatedButton
                  variant="outline"
                  size="sm"
                  icon={<LogIn size={16} />}
                >
                  Sign In
                </AnimatedButton>
              </Link>
              <Link href="/signup">
                <AnimatedButton
                  variant="primary"
                  size="sm"
                  icon={<UserPlus size={16} />}
                >
                  Create Account
                </AnimatedButton>
              </Link>
            </>
          )}
        </ControlsGroup>

        <div style={{ display: 'flex', gap: '8px' }}>
          <ThemeToggleButton 
            onClick={toggleTheme} 
            aria-label="Toggle theme"
            style={{ display: 'none' }}
            className="mobile-theme-btn"
          >
            {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#1D41E3" />}
          </ThemeToggleButton>
          <MobileMenuToggle onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle mobile menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </MobileMenuToggle>
        </div>
      </NavInner>

      <MobilePanel $isOpen={mobileOpen}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Color Theme</span>
          <ThemeToggleButton onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#1D41E3" />}
          </ThemeToggleButton>
        </div>

        {user ? (
          <>
            <UserChip>
              <div className="avatar">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <span className="name">{user.name}</span>
                <span className="email">{user.email}</span>
              </div>
            </UserChip>
            <AnimatedButton
              variant="outline"
              size="md"
              fullWidth
              icon={<LogOut size={16} />}
              onClick={() => {
                logout();
                setMobileOpen(false);
              }}
            >
              Sign Out
            </AnimatedButton>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href="/login" onClick={() => setMobileOpen(false)}>
              <AnimatedButton variant="outline" size="md" fullWidth icon={<LogIn size={16} />}>
                Sign In
              </AnimatedButton>
            </Link>
            <Link href="/signup" onClick={() => setMobileOpen(false)}>
              <AnimatedButton variant="primary" size="md" fullWidth icon={<UserPlus size={16} />}>
                Sign Up
              </AnimatedButton>
            </Link>
          </div>
        )}
      </MobilePanel>
    </NavContainer>
  );
};

export default Navbar;
