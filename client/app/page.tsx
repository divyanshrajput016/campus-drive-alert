'use client';

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Sparkles, 
  Database, 
  Bell, 
  User as UserIcon, 
  LogIn, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { PlacementDrive, fetchPlacementDrives } from '@/lib/api';
import { AnimatedButton } from './components/AnimatedButton';
import { NeumorphicInput } from './components/NeumorphicInput';
import { NotificationSlider } from './components/NotificationSlider';
import { CampusDriveCard } from './components/CampusDriveCard';
import { DriveDetailsModal } from './components/DriveDetailsModal';
import { StatsOverview } from './components/StatsOverview';
import { SweetAlertBox } from './components/SweetAlertBox';

const MainContainer = styled.main`
  min-height: 100vh;
  padding: 0 0 100px;
`;

const ContentInner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 36px 24px 0;
`;

const HeroSection = styled.section`
  background: var(--hero-bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--bm-radius-modal, 16px);
  padding: 48px 40px;
  margin-bottom: 36px;
  backdrop-filter: blur(14px);
  position: relative;
  overflow: hidden;
  box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.05);

  &::after {
    content: '';
    position: absolute;
    top: -60px;
    right: -60px;
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, rgba(29, 65, 227, 0.28) 0%, transparent 70%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 32px 24px;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(29, 65, 227, 0.12);
  border: 1px solid rgba(82, 117, 242, 0.3);
  padding: 5px 14px;
  border-radius: var(--bm-radius-tag, 6px);
  font-size: 11px;
  font-weight: 600;
  color: var(--bm-primary-500);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 18px;
`;

const HeroTitle = styled.h1`
  font-size: 38px;
  line-height: 1.25;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
  max-width: 820px;

  .accent {
    font-family: var(--bm-font-accent);
    color: var(--bm-primary-500);
    font-weight: 400;
    font-style: italic;
    margin-left: 10px;
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 15px;
  line-height: 24px;
  color: var(--text-secondary);
  max-width: 680px;
  margin-bottom: 28px;
`;

const UserProfileCard = styled.div`
  background: var(--surface-bg, rgba(23, 23, 23, 0.75));
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--bm-radius-card, 12px);
  padding: 24px 28px;
  margin-bottom: 36px;
  backdrop-filter: blur(12px);
  box-shadow: var(--bm-shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 20px;

  .user-header-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .user-badge-group {
    display: flex;
    align-items: center;
    gap: 16px;

    .avatar {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1D41E3 0%, #5275F2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 700;
      box-shadow: 0px 4px 12px rgba(29, 65, 227, 0.3);
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 3px;

      h3 {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-primary);
      }

      .email {
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
  }

  .guest-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;

    .guest-text {
      display: flex;
      flex-direction: column;
      gap: 4px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
      }

      p {
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
  }
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 28px;
`;

const FilterChips = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Chip = styled.button<{ $active: boolean }>`
  font-size: 12px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  border: 1px solid ${props => (props.$active ? 'var(--bm-primary-500)' : 'var(--surface-border)')};
  background: ${props => (props.$active ? 'rgba(29, 65, 227, 0.12)' : 'var(--stage-bg)')};
  color: ${props => (props.$active ? 'var(--bm-primary-500)' : 'var(--text-secondary)')};
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--bm-primary-400);
    color: var(--bm-primary-500);
  }
`;

const DrivesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  gap: 16px;
  color: var(--text-secondary);
`;

const EmptyState = styled.div`
  background: var(--surface-bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--bm-radius-card, 12px);
  padding: 60px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: var(--text-secondary);

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-primary);
  }

  p {
    font-size: 14px;
    max-width: 440px;
  }
`;

export default function HomePage() {
  const { user, updateNotificationSetting } = useAuth();

  const [drives, setDrives] = useState<PlacementDrive[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'open' | 'closed' | 'cgpa'>('all');
  const [selectedDrive, setSelectedDrive] = useState<PlacementDrive | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    isOpen: boolean;
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  const loadDrives = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPlacementDrives();
      setDrives(data);
    } catch (err: any) {
      console.error('Error fetching drives from database:', err);
      setError(err.message || 'Failed to load drives from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const handleToggleNotification = async (enabled: boolean) => {
    try {
      await updateNotificationSetting(enabled);
      setAlertInfo({
        isOpen: true,
        type: 'success',
        title: enabled ? 'Alerts Activated!' : 'Alerts Disabled',
        message: enabled
          ? 'You will now receive email updates immediately whenever a new campus drive is detected in the system.'
          : 'Email alerts have been muted. You can re-enable them at any time.',
      });
    } catch (err: any) {
      setAlertInfo({
        isOpen: true,
        type: 'error',
        title: 'Update Failed',
        message: err.message || 'Could not update notification preference. Please try again.',
      });
    }
  };

  const filteredDrives = useMemo(() => {
    return drives.filter(drive => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        drive.companyName.toLowerCase().includes(query) ||
        (drive.jobLocation && drive.jobLocation.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      if (filterMode === 'open') return drive.isOpenForApply;
      if (filterMode === 'closed') return !drive.isOpenForApply;
      if (filterMode === 'cgpa') return drive.minCgpa !== null && drive.minCgpa > 0;

      return true;
    });
  }, [drives, searchQuery, filterMode]);

  return (
    <MainContainer>
      <ContentInner>
        <HeroSection>
          <HeroBadge>
            <Database size={13} />
            <span>PostgreSQL Database Active</span>
          </HeroBadge>
          <HeroTitle>
            Track Verified Campus Drives<span className="accent">seamlessly</span>
          </HeroTitle>
          <HeroSubtitle>
            All placement drives below are served directly from the persistent database. Stay ahead with real-time tracking, eligibility criteria, and instant email dispatch.
          </HeroSubtitle>
        </HeroSection>

        {/* User Details & Slider Toggle Card */}
        <UserProfileCard>
          {user ? (
            <>
              <div className="user-header-row">
                <div className="user-badge-group">
                  <div className="avatar">
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="info">
                    <h3>{user.name}</h3>
                    <span className="email">{user.email}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Student ID: #{user.id}
                  </span>
                </div>
              </div>

              {/* Notification Slider Toggle Component */}
              <NotificationSlider
                enabled={user.sendNotification}
                onToggle={handleToggleNotification}
              />
            </>
          ) : (
            <div className="guest-banner">
              <div className="guest-text">
                <h3>Want instant email alerts when new campus drives drop?</h3>
                <p>
                  Sign in or create an account to turn on real-time email notifications with our instant slider toggle.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/login">
                  <AnimatedButton variant="primary" size="sm" icon={<LogIn size={15} />}>
                    Sign In to Enable Alerts
                  </AnimatedButton>
                </Link>
                <Link href="/signup">
                  <AnimatedButton variant="outline" size="sm">
                    Register
                  </AnimatedButton>
                </Link>
              </div>
            </div>
          )}
        </UserProfileCard>

        {/* Stats Metrics Cards */}
        <StatsOverview
          drives={drives}
          userAlertsEnabled={user?.sendNotification ?? false}
        />

        {/* Search and Filters */}
        <ControlsBar>
          <NeumorphicInput
            icon={<Search size={16} />}
            placeholders={[
              'Search by company name...',
              'Search by location (e.g. Indore)...',
              'Find eligible drives...',
            ]}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '320px' }}
          />

          <FilterChips>
            <Chip
              $active={filterMode === 'all'}
              onClick={() => setFilterMode('all')}
            >
              All Drives ({drives.length})
            </Chip>
            <Chip
              $active={filterMode === 'open'}
              onClick={() => setFilterMode('open')}
            >
              Open for Apply ({drives.filter(d => d.isOpenForApply).length})
            </Chip>
            <Chip
              $active={filterMode === 'closed'}
              onClick={() => setFilterMode('closed')}
            >
              Closed ({drives.filter(d => !d.isOpenForApply).length})
            </Chip>
            <Chip
              $active={filterMode === 'cgpa'}
              onClick={() => setFilterMode('cgpa')}
            >
              With CGPA Cutoff
            </Chip>
            <AnimatedButton
              variant="outline"
              size="sm"
              icon={<RefreshCw size={14} />}
              onClick={loadDrives}
              loading={loading}
              title="Refresh from PostgreSQL Database"
            >
              Refresh
            </AnimatedButton>
          </FilterChips>
        </ControlsBar>

        {/* Campus Drives Grid from Database */}
        {loading ? (
          <LoadingState>
            <RefreshCw size={36} className="animate-spin" color="var(--bm-primary-500)" />
            <p>Querying campus drives from PostgreSQL database...</p>
          </LoadingState>
        ) : error ? (
          <EmptyState>
            <AlertCircle size={40} color="#EF4444" />
            <h3>Unable to Load Campus Drives</h3>
            <p>{error}</p>
            <AnimatedButton variant="primary" size="md" onClick={loadDrives}>
              Retry Database Query
            </AnimatedButton>
          </EmptyState>
        ) : filteredDrives.length === 0 ? (
          <EmptyState>
            <Briefcase size={40} color="var(--bm-primary-400)" />
            <h3>No Placement Drives Found</h3>
            <p>
              No campus drives match your current search or filter. Try clearing your filters or refreshing the database.
            </p>
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setFilterMode('all');
              }}
            >
              Clear Filters
            </AnimatedButton>
          </EmptyState>
        ) : (
          <DrivesGrid>
            {filteredDrives.map(drive => (
              <CampusDriveCard
                key={drive.id}
                drive={drive}
                onViewDetails={setSelectedDrive}
              />
            ))}
          </DrivesGrid>
        )}
      </ContentInner>

      {/* Drive Details Modal */}
      <DriveDetailsModal
        drive={selectedDrive}
        onClose={() => setSelectedDrive(null)}
      />

      {/* Sweet Alert Feedback Dialog */}
      <SweetAlertBox
        isOpen={alertInfo.isOpen}
        type={alertInfo.type}
        title={alertInfo.title}
        message={alertInfo.message}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
      />
    </MainContainer>
  );
}
