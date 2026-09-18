'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import { ArrowRight, Loader2 } from 'lucide-react';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'primary' | 'outline' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  iconPosition?: 'right' | 'left';
  loading?: boolean;
}

const IconWrapper = styled.span<{ $iconPosition?: 'right' | 'left' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  will-change: transform;
`;

const StyledButton = styled.button<{
  $size: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
  $variant: 'primary' | 'outline' | 'glass' | 'danger';
  $iconPosition?: 'right' | 'left';
}>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: var(--bm-font-primary, system-ui, -apple-system, sans-serif);
  font-weight: 600;
  border-radius: var(--bm-radius-button, 8px);
  cursor: pointer;
  outline: none;
  overflow: hidden;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};

  /* Typography & Padding according to design.md tokens */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return css`
          font-size: 13px;
          line-height: 18px;
          padding: 8px 16px;
        `;
      case 'lg':
        return css`
          font-size: 16px;
          line-height: 24px;
          padding: 14px 28px;
        `;
      case 'md':
      default:
        return css`
          font-size: 14px;
          line-height: 20px;
          padding: 11px 22px;
        `;
    }
  }}

  /* Variant Configurations */
  ${props => {
    switch (props.$variant) {
      case 'danger':
        return css`
          background-color: var(--bm-error-500, #EF4444);
          color: #FFFFFF;
          border: 1px solid #DC2626;
          box-shadow: 0px 4px 12px rgba(239, 68, 68, 0.2);

          &:hover {
            background-color: #DC2626;
            box-shadow: 0px 6px 16px rgba(239, 68, 68, 0.35);
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: var(--text-primary, #FFFFFF);
          border: 1.5px solid var(--bm-primary-500, #1D41E3);

          &:hover {
            background-color: var(--bm-primary-500, #1D41E3);
            color: #FFFFFF;
            border-color: var(--bm-primary-400, #5275F2);
            box-shadow: 0px 6px 20px rgba(29, 65, 227, 0.35);
          }
        `;
      case 'glass':
        return css`
          background-color: rgba(29, 65, 227, 0.08);
          backdrop-filter: blur(10px);
          color: var(--text-primary, #FFFFFF);
          border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.15));

          &:hover {
            background-color: rgba(29, 65, 227, 0.18);
            border-color: var(--bm-primary-400, #5275F2);
            color: var(--bm-primary-500, #1D41E3);
            box-shadow: 0px 4px 16px rgba(29, 65, 227, 0.15);
          }
        `;
      case 'primary':
      default:
        return css`
          background-color: var(--btn-bg, #171717);
          color: var(--btn-text, #FFFFFF);
          border: 1.5px solid var(--btn-border, #1D41E3);
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);

          &:hover {
            background-color: var(--btn-hover-bg, #1D41E3);
            color: var(--btn-hover-text, #FFFFFF);
            border-color: var(--btn-hover-border, #5275F2);
            box-shadow: 
              0px 6px 20px rgba(29, 65, 227, 0.4),
              0px 0px 14px rgba(82, 117, 242, 0.3);
          }
        `;
    }
  }}

  transition: 
    background-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    color 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.22),
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    &::before {
      left: 100%;
    }

    ${IconWrapper} {
      transform: ${props => (props.$iconPosition === 'left' ? 'translateX(-4px)' : 'translateX(4px)')};
    }
  }

  &:active {
    transform: scale(0.97);
    background-color: var(--bm-primary-600, #1939C9);
    border-color: var(--bm-primary-500, #1D41E3);
    color: #FFFFFF;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
    box-shadow: none;
  }
`;

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  icon,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconPosition = 'right',
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const defaultIconSize = size === 'sm' ? 15 : size === 'lg' ? 20 : 17;
  const iconContent = loading ? (
    <Loader2 size={defaultIconSize} className="animate-spin" />
  ) : (
    icon
  );

  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $iconPosition={iconPosition}
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === 'left' && iconContent && (
        <IconWrapper $iconPosition={iconPosition}>{iconContent}</IconWrapper>
      )}
      <span>{children}</span>
      {iconPosition === 'right' && iconContent && (
        <IconWrapper $iconPosition={iconPosition}>{iconContent}</IconWrapper>
      )}
    </StyledButton>
  );
};

export default AnimatedButton;
