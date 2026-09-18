'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import { 
  Building2, 
  MapPin, 
  GraduationCap, 
  AlertCircle, 
  Calendar, 
  Clock, 
  ExternalLink, 
  ChevronRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { PlacementDrive } from '@/lib/api';
import { AnimatedButton } from './AnimatedButton';

export interface CampusDriveCardProps {
  drive: PlacementDrive;
  onViewDetails: (drive: PlacementDrive) => void;
}

const Card = styled.div`
  background: var(--card-bg, rgba(23, 23, 23, 0.7));
  border: 1px solid var(--card-border, rgba(255, 255, 255, 0.08));
  border-radius: var(--bm-radius-card, 12px);
  padding: 24px;
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: var(--bm-shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1D41E3, #5275F2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: var(--bm-primary-400, #5275F2);
    box-shadow: 0px 10px 28px rgba(0, 0, 0, 0.12), 0 0 16px rgba(29, 65, 227, 0.15);

    &::before {
      opacity: 1;
    }
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 16px;
`;

const CompanyGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const CompanyAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(29, 65, 227, 0.15) 0%, rgba(82, 117, 242, 0.25) 100%);
  border: 1px solid rgba(82, 117, 242, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bm-primary-500, #1D41E3);
  font-weight: 700;
  font-size: 18px;
  flex-shrink: 0;
`;

const CompanyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h3 {
    font-size: 17px;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .location-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--text-secondary);
  }
`;

const StatusPill = styled.span<{ $isOpen: boolean }>`
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--bm-radius-tag, 6px);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 5px;

  ${props =>
    props.$isOpen
      ? css`
          background: rgba(34, 197, 94, 0.12);
          color: #22C55E;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `
      : css`
          background: rgba(115, 115, 115, 0.12);
          color: var(--text-muted);
          border: 1px solid rgba(115, 115, 115, 0.2);
        `}
`;

const EligibilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 16px 0;
`;

const EligibilityItem = styled.div`
  background: var(--stage-bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--bm-radius-tag, 6px);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;

  .label {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const DatesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(29, 65, 227, 0.04);
  border-radius: var(--bm-radius-tag, 6px);
  border: 1px dashed rgba(29, 65, 227, 0.2);
  margin-bottom: 20px;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;

  .label-group {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-secondary);
  }

  .date-val {
    font-weight: 500;
    color: var(--text-primary);
  }
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const CampusDriveCard: React.FC<CampusDriveCardProps> = ({ drive, onViewDetails }) => {
  const formatDate = (isoString: string | null) => {
    if (!isoString) return 'Not Specified';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return 'Not Specified';
    }
  };

  const firstLetter = drive.companyName ? drive.companyName.trim()[0].toUpperCase() : 'C';

  return (
    <Card>
      <div>
        <CardHeader>
          <CompanyGroup>
            <CompanyAvatar>{firstLetter}</CompanyAvatar>
            <CompanyDetails>
              <h3>{drive.companyName}</h3>
              <div className="location-badge">
                <MapPin size={13} color="var(--bm-primary-400)" />
                <span>{drive.jobLocation || 'Campus / Pan India'}</span>
              </div>
            </CompanyDetails>
          </CompanyGroup>

          <StatusPill $isOpen={drive.isOpenForApply}>
            {drive.isOpenForApply ? (
              <>
                <CheckCircle2 size={12} /> Open
              </>
            ) : (
              <>
                <XCircle size={12} /> Closed
              </>
            )}
          </StatusPill>
        </CardHeader>

        <EligibilityGrid>
          <EligibilityItem>
            <span className="label">Min CGPA</span>
            <span className="value">
              {drive.minCgpa !== null ? `${drive.minCgpa} CGPA` : 'Any CGPA'}
            </span>
          </EligibilityItem>
          <EligibilityItem>
            <span className="label">Max Backlogs</span>
            <span className="value">
              {drive.maxBacklog !== null ? `${drive.maxBacklog} Allowed` : 'No Restriction'}
            </span>
          </EligibilityItem>
        </EligibilityGrid>

        <DatesContainer>
          <DateRow>
            <div className="label-group">
              <Calendar size={13} color="var(--bm-primary-500)" />
              <span>Drive Date</span>
            </div>
            <span className="date-val">{formatDate(drive.startDate)}</span>
          </DateRow>
          <DateRow>
            <div className="label-group">
              <Clock size={13} color="#F59E0B" />
              <span>Registration Deadline</span>
            </div>
            <span className="date-val" style={{ color: '#F59E0B', fontWeight: 600 }}>
              {formatDate(drive.registrationDeadline)}
            </span>
          </DateRow>
        </DatesContainer>
      </div>

      <ActionsRow>
        <AnimatedButton
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => onViewDetails(drive)}
        >
          View Details
        </AnimatedButton>

        {drive.companyApplyUrl ? (
          <a
            href={drive.companyApplyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ flex: 1 }}
          >
            <AnimatedButton
              variant="primary"
              size="sm"
              fullWidth
              icon={<ExternalLink size={14} />}
            >
              Apply Link
            </AnimatedButton>
          </a>
        ) : (
          <AnimatedButton
            variant="glass"
            size="sm"
            fullWidth
            onClick={() => onViewDetails(drive)}
          >
            Check Info
          </AnimatedButton>
        )}
      </ActionsRow>
    </Card>
  );
};

export default CampusDriveCard;
