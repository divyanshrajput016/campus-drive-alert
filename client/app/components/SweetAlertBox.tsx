'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Check, AlertTriangle, X, Info } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';

export type AlertType = 'success' | 'warning' | 'error' | 'info';

export interface SweetAlertBoxProps {
  isOpen: boolean;
  type?: AlertType;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.85) translateY(12px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const Backdrop = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(11, 14, 20, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
  animation: ${fadeIn} 0.2s ease-out forwards;
  opacity: ${props => (props.$isOpen ? 1 : 0)};
  pointer-events: ${props => (props.$isOpen ? 'all' : 'none')};
`;

const ModalCard = styled.div`
  background: var(--surface-bg, #171717);
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.15));
  border-radius: var(--bm-radius-modal, 16px);
  width: 100%;
  max-width: 420px;
  padding: 32px 28px 28px;
  position: relative;
  box-shadow: var(--bm-shadow-lg);
  animation: ${popIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: transparent;
  border: none;
  color: var(--text-secondary, #A3A3A3);
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: var(--stage-bg);
    color: var(--text-primary);
  }
`;

const IconCircle = styled.div<{ $type: AlertType }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  ${props => {
    switch (props.$type) {
      case 'success':
        return `
          background: rgba(34, 197, 94, 0.12);
          color: #22C55E;
          border: 1.5px solid rgba(34, 197, 94, 0.3);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.12);
          color: #EF4444;
          border: 1.5px solid rgba(239, 68, 68, 0.3);
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.12);
          color: #F59E0B;
          border: 1.5px solid rgba(245, 158, 11, 0.3);
        `;
      case 'info':
      default:
        return `
          background: rgba(29, 65, 227, 0.12);
          color: #1D41E3;
          border: 1.5px solid rgba(29, 65, 227, 0.3);
        `;
    }
  }}
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
`;

const Message = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: var(--text-secondary);
  margin-bottom: 26px;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  justify-content: center;
`;

export const SweetAlertBox: React.FC<SweetAlertBoxProps> = ({
  isOpen,
  type = 'info',
  title,
  message,
  confirmText = 'Continue',
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <Check size={32} strokeWidth={2.5} />;
      case 'error':
        return <X size={32} strokeWidth={2.5} />;
      case 'warning':
        return <AlertTriangle size={32} strokeWidth={2.5} />;
      case 'info':
      default:
        return <Info size={32} strokeWidth={2.5} />;
    }
  };

  return (
    <Backdrop $isOpen={isOpen} onClick={onClose}>
      <ModalCard onClick={e => e.stopPropagation()}>
        {onClose && (
          <CloseButton onClick={onClose} aria-label="Close">
            <X size={18} />
          </CloseButton>
        )}
        <IconCircle $type={type}>{renderIcon()}</IconCircle>
        <Title>{title}</Title>
        {message && <Message>{message}</Message>}
        <ActionsRow>
          {showCancel && (
            <AnimatedButton
              variant="outline"
              size="md"
              fullWidth
              onClick={onCancel || onClose}
            >
              {cancelText}
            </AnimatedButton>
          )}
          <AnimatedButton
            variant={type === 'error' ? 'danger' : 'primary'}
            size="md"
            fullWidth
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </AnimatedButton>
        </ActionsRow>
      </ModalCard>
    </Backdrop>
  );
};

export default SweetAlertBox;
