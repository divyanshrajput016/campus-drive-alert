'use client';

import React from 'react';
import styled from 'styled-components';
import { Database, CheckCircle2, Bell, TrendingUp } from 'lucide-react';
import { PlacementDrive } from '@/lib/api';

export interface StatsOverviewProps {
  drives: PlacementDrive[];
  userAlertsEnabled?: boolean;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: var(--surface-bg, rgba(23, 23, 23, 0.7));
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.08));
  border-radius: var(--bm-radius-card, 12px);
  padding: 18px 20px;
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--bm-shadow-sm);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--bm-primary-300);
    box-shadow: var(--bm-shadow-md);
  }

  .stat-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    gap: 2px;

    .label {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .value {
      font-size: 22px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.2;
    }
  }
`;

export const StatsOverview: React.FC<StatsOverviewProps> = ({ drives, userAlertsEnabled }) => {
  const totalDrives = drives.length;
  const openDrives = drives.filter(d => d.isOpenForApply).length;
  const avgCgpa = drives.length
    ? (
        drives.reduce((acc, d) => acc + (d.minCgpa || 0), 0) /
        (drives.filter(d => d.minCgpa !== null).length || 1)
      ).toFixed(1)
    : '6.0';

  return (
    <Grid>
      <StatCard>
        <div
          className="stat-icon"
          style={{ background: 'rgba(29, 65, 227, 0.12)', color: '#1D41E3' }}
        >
          <Database size={22} />
        </div>
        <div className="stat-content">
          <span className="label">Database Drives</span>
          <span className="value">{totalDrives}</span>
        </div>
      </StatCard>

      <StatCard>
        <div
          className="stat-icon"
          style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22C55E' }}
        >
          <CheckCircle2 size={22} />
        </div>
        <div className="stat-content">
          <span className="label">Open for Apply</span>
          <span className="value">{openDrives}</span>
        </div>
      </StatCard>

      <StatCard>
        <div
          className="stat-icon"
          style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#F59E0B' }}
        >
          <TrendingUp size={22} />
        </div>
        <div className="stat-content">
          <span className="label">Avg Min CGPA</span>
          <span className="value">{avgCgpa}</span>
        </div>
      </StatCard>

      <StatCard>
        <div
          className="stat-icon"
          style={{
            background: userAlertsEnabled ? 'rgba(34, 197, 94, 0.12)' : 'rgba(115, 115, 115, 0.12)',
            color: userAlertsEnabled ? '#22C55E' : '#737373',
          }}
        >
          <Bell size={22} />
        </div>
        <div className="stat-content">
          <span className="label">Email Alerts</span>
          <span className="value">{userAlertsEnabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </StatCard>
    </Grid>
  );
};

export default StatsOverview;
