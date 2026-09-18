'use client';

import React from 'react';
import styled from 'styled-components';
import { 
  X, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  GraduationCap, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  XCircle,
  Hash,
  Database
} from 'lucide-react';
import { PlacementDrive } from '@/lib/api';
import { AnimatedButton } from './AnimatedButton';

export interface DriveDetailsModalProps {
  drive: PlacementDrive | null;
  onClose: () => void;
}

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(11, 14, 20, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
  animation: fadeIn 0.25s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContent = styled.div`
  background: var(--surface-solid, #171717);
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.15));
  border-radius: var(--bm-radius-modal, 16px);
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--bm-shadow-lg);
  padding: 32px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--stage-bg);
  border: 1px solid var(--surface-border);
  color: var(--text-secondary);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--text-primary);
    border-color: var(--bm-primary-400);
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding-right: 40px;

  .avatar {
    width: 54px;
    height: 54px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1D41E3 0%, #5275F2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
    font-size: 22px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .meta {
    display: flex;
    flex-direction: column;
    gap: 4px;

    h2 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      line-height: 1.3;
    }

    .location {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-secondary);
    }
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const DetailCard = styled.div`
  background: var(--stage-bg);
  border: 1px solid var(--surface-border);
  border-radius: var(--bm-radius-card, 12px);
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--text-muted);
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }
`;

const DatabaseBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(29, 65, 227, 0.08);
  border: 1px solid rgba(82, 117, 242, 0.25);
  border-radius: var(--bm-radius-tag, 6px);
  padding: 10px 14px;
  font-size: 12px;
  color: var(--text-secondary);

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--bm-primary-500);
    font-weight: 600;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

export const DriveDetailsModal: React.FC<DriveDetailsModalProps> = ({ drive, onClose }) => {
  if (!drive) return null;

  const formatDate = (isoString: string | null) => {
    if (!isoString) return 'Not Specified';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Not Specified';
    }
  };

  const firstLetter = drive.companyName ? drive.companyName.trim()[0].toUpperCase() : 'C';

  return (
    <Backdrop onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </CloseBtn>

        <HeaderSection>
          <div className="avatar">{firstLetter}</div>
          <div className="meta">
            <h2>{drive.companyName}</h2>
            <div className="location">
              <MapPin size={14} color="var(--bm-primary-400)" />
              <span>{drive.jobLocation || 'Campus Placement / Pan India'}</span>
            </div>
          </div>
        </HeaderSection>

        <DatabaseBadge>
          <div className="tag">
            <Database size={14} />
            <span>PostgreSQL Database Verified</span>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>
            ID: #{drive.id}
          </span>
        </DatabaseBadge>

        <DetailGrid>
          <DetailCard>
            <div className="label">
              <GraduationCap size={13} color="var(--bm-primary-500)" />
              <span>Minimum CGPA</span>
            </div>
            <div className="value">
              {drive.minCgpa !== null ? `${drive.minCgpa} CGPA` : 'No CGPA Cutoff'}
            </div>
          </DetailCard>

          <DetailCard>
            <div className="label">
              <Building2 size={13} color="var(--bm-primary-500)" />
              <span>Maximum Backlogs</span>
            </div>
            <div className="value">
              {drive.maxBacklog !== null ? `${drive.maxBacklog} Allowed` : 'No Backlog Restrictions'}
            </div>
          </DetailCard>

          <DetailCard>
            <div className="label">
              <Calendar size={13} color="var(--bm-primary-500)" />
              <span>Drive Scheduled Date</span>
            </div>
            <div className="value">{formatDate(drive.startDate)}</div>
          </DetailCard>

          <DetailCard>
            <div className="label">
              <Clock size={13} color="#F59E0B" />
              <span>Registration Deadline</span>
            </div>
            <div className="value" style={{ color: '#F59E0B' }}>
              {formatDate(drive.registrationDeadline)}
            </div>
          </DetailCard>
        </DetailGrid>

        {drive.jobDescriptionUrl && (
          <DetailCard>
            <div className="label">
              <FileText size={13} color="var(--bm-primary-500)" />
              <span>Job Description Document</span>
            </div>
            <a
              href={drive.jobDescriptionUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--bm-primary-500)',
                textDecoration: 'underline',
                fontSize: '13px',
                marginTop: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>Download / Open Job Description</span>
              <ExternalLink size={14} />
            </a>
          </DetailCard>
        )}

        <ButtonRow>
          {drive.companyApplyUrl ? (
            <a
              href={drive.companyApplyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1 }}
            >
              <AnimatedButton
                variant="primary"
                size="md"
                fullWidth
                icon={<ExternalLink size={16} />}
              >
                Proceed to Apply Portal
              </AnimatedButton>
            </a>
          ) : (
            <AnimatedButton
              variant="primary"
              size="md"
              fullWidth
              onClick={onClose}
            >
              Close Details
            </AnimatedButton>
          )}

          <AnimatedButton
            variant="outline"
            size="md"
            onClick={onClose}
          >
            Back to List
          </AnimatedButton>
        </ButtonRow>
      </ModalContent>
    </Backdrop>
  );
};

export default DriveDetailsModal;
