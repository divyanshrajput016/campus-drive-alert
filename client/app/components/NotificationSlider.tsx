'use client';

import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Bell, BellOff, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

export interface NotificationSliderProps {
  enabled: boolean;
  onToggle: (newState: boolean) => Promise<void> | void;
  disabled?: boolean;
}

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(29, 65, 227, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(29, 65, 227, 0); }
  100% { box-shadow: 0 0 0 0 rgba(29, 65, 227, 0); }
`;

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: var(--surface-bg, rgba(23, 23, 23, 0.75));
  backdrop-filter: blur(12px);
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.1));
  border-radius: var(--bm-radius-card, 12px);
  padding: 16px 20px;
  transition: all 0.3s ease;
  box-shadow: var(--bm-shadow-sm);

  &:hover {
    border-color: var(--bm-primary-300, #8FA8FF);
    box-shadow: var(--bm-shadow-md);
  }

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const InfoCol = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const IconBadge = styled.div<{ $enabled: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

  ${props =>
    props.$enabled
      ? css`
          background: linear-gradient(135deg, #1D41E3 0%, #5275F2 100%);
          color: #FFFFFF;
          box-shadow: 0px 4px 14px rgba(29, 65, 227, 0.35);
        `
      : css`
          background: var(--stage-bg, #1A1E29);
          color: var(--text-muted, #737373);
          border: 1px solid var(--surface-border);
        `}
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;

  .title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .status-tag {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--bm-radius-tag, 6px);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .subtitle {
    font-size: 13px;
    color: var(--text-secondary);
  }
`;

const StatusBadge = styled.span<{ $enabled: boolean }>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--bm-radius-tag, 6px);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props =>
    props.$enabled
      ? css`
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `
      : css`
          background: rgba(115, 115, 115, 0.15);
          color: var(--text-muted);
          border: 1px solid rgba(115, 115, 115, 0.2);
        `}
`;

const SwitchControlWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: center;
`;

const SwitchTrack = styled.button<{ $enabled: boolean; $loading: boolean }>`
  position: relative;
  width: 58px;
  height: 32px;
  border-radius: 20px;
  border: 1.5px solid ${props => (props.$enabled ? 'var(--bm-primary-400, #5275F2)' : 'var(--surface-border)')};
  background: ${props => (props.$enabled ? 'var(--bm-primary-500, #1D41E3)' : 'var(--stage-bg, #171717)')};
  cursor: ${props => (props.$loading ? 'wait' : 'pointer')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${props => (props.$enabled ? '0px 0px 14px rgba(29, 65, 227, 0.45)' : 'var(--neu-inset-shadow)')};
  padding: 3px;
  outline: none;

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(82, 117, 242, 0.5);
  }

  ${props =>
    props.$enabled &&
    css`
      animation: ${pulse} 2s infinite;
    `}
`;

const SwitchThumb = styled.span<{ $enabled: boolean; $loading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #FFFFFF;
  color: ${props => (props.$enabled ? '#1D41E3' : '#737373')};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.25);
  transform: ${props => (props.$enabled ? 'translateX(26px)' : 'translateX(0px)')};
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
`;

export const NotificationSlider: React.FC<NotificationSliderProps> = ({
  enabled,
  onToggle,
  disabled = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleClick = async () => {
    if (disabled || isUpdating) return;
    setIsUpdating(true);
    try {
      await onToggle(!enabled);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <SliderContainer>
      <InfoCol>
        <IconBadge $enabled={enabled}>
          {enabled ? <Bell size={22} /> : <BellOff size={22} />}
        </IconBadge>
        <TextGroup>
          <div className="title-row">
            <span>Email Alerts for New Drives</span>
            <StatusBadge $enabled={enabled}>
              {enabled ? 'Active' : 'Inactive'}
            </StatusBadge>
          </div>
          <span className="subtitle">
            {enabled
              ? 'You receive direct email notifications whenever a new placement drive is added.'
              : 'Notifications are muted. Turn on the slider to get real-time email alerts.'}
          </span>
        </TextGroup>
      </InfoCol>

      <SwitchControlWrapper>
        <SwitchTrack
          type="button"
          role="switch"
          aria-checked={enabled}
          $enabled={enabled}
          $loading={isUpdating}
          onClick={handleClick}
          disabled={disabled || isUpdating}
          aria-label="Toggle email notifications"
        >
          <SwitchThumb $enabled={enabled} $loading={isUpdating}>
            {isUpdating ? (
              <Loader2 size={13} className="animate-spin" />
            ) : enabled ? (
              <CheckCircle2 size={13} />
            ) : null}
          </SwitchThumb>
        </SwitchTrack>
      </SwitchControlWrapper>
    </SliderContainer>
  );
};

export default NotificationSlider;
