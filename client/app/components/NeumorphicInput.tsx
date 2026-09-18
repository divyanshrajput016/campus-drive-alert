'use client';

import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

export interface NeumorphicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  placeholders?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

const Container = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${props => (props.$fullWidth ? '100%' : 'auto')};
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary, #171717);
  font-family: var(--bm-font-primary);
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const IconWrapper = styled.div`
  position: absolute;
  left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #737373);
  pointer-events: none;
  z-index: 1;
`;

const RightIconWrapper = styled.div`
  position: absolute;
  right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #737373);
  cursor: pointer;
  z-index: 1;
`;

const StyledInput = styled.input<{ $hasIcon?: boolean; $hasRightIcon?: boolean; $hasError?: boolean }>`
  width: 100%;
  border: 1px solid var(--surface-border, rgba(255, 255, 255, 0.08));
  outline: none;
  font-family: var(--bm-font-primary);
  font-size: 14px;
  padding: 12px 18px;
  padding-left: ${props => (props.$hasIcon ? '44px' : '18px')};
  padding-right: ${props => (props.$hasRightIcon ? '44px' : '18px')};
  border-radius: var(--bm-radius-button, 8px);
  transition: all 0.25s ease;

  background: var(--neu-input-bg, #12151E);
  color: var(--text-primary, #FFFFFF);
  box-shadow: var(--neu-inset-shadow);

  &::placeholder {
    color: var(--text-muted, #737373);
    transition: color 0.3s ease;
  }

  &:focus {
    border-color: var(--bm-primary-500, #1D41E3);
    box-shadow: var(--neu-inset-focus), 0 0 0 2px rgba(29, 65, 227, 0.25);
  }

  ${props =>
    props.$hasError &&
    css`
      border-color: #EF4444 !important;
      box-shadow: 
        inset 3px 3px 6px rgba(239, 68, 68, 0.15),
        0 0 0 2px rgba(239, 68, 68, 0.25) !important;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const HelperText = styled.span<{ $isError?: boolean }>`
  font-size: 12px;
  color: ${props => (props.$isError ? '#EF4444' : 'var(--text-secondary)')};
  font-family: var(--bm-font-primary);
  margin-left: 2px;
`;

export const NeumorphicInput: React.FC<NeumorphicInputProps> = ({
  label,
  error,
  helperText,
  icon,
  rightIcon,
  fullWidth = false,
  placeholder,
  placeholders,
  typingSpeed = 80,
  deletingSpeed = 40,
  pauseDuration = 1600,
  className,
  disabled,
  ...props
}) => {
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(placeholder || '');

  useEffect(() => {
    if (!placeholders || placeholders.length === 0) {
      if (placeholder) setAnimatedPlaceholder(placeholder);
      return;
    }

    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;
    let arrayIndex = 0;
    let isDeleting = false;

    const typeStep = () => {
      if (!isMounted) return;

      const currentText = placeholders[arrayIndex];

      if (isDeleting) {
        charIndex--;
        setAnimatedPlaceholder(currentText.substring(0, charIndex));
      } else {
        charIndex++;
        setAnimatedPlaceholder(currentText.substring(0, charIndex));
      }

      let speed = isDeleting ? deletingSpeed : typingSpeed;

      if (!isDeleting && charIndex === currentText.length) {
        speed = pauseDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        arrayIndex = (arrayIndex + 1) % placeholders.length;
        speed = 350;
      }

      timeoutId = setTimeout(typeStep, speed);
    };

    timeoutId = setTimeout(typeStep, 300);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [placeholders, placeholder, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <Container $fullWidth={fullWidth} className={className}>
      {label && <Label>{label}</Label>}
      <InputWrapper>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        <StyledInput
          $hasIcon={!!icon}
          $hasRightIcon={!!rightIcon}
          $hasError={!!error}
          disabled={disabled}
          placeholder={animatedPlaceholder}
          {...props}
        />
        {rightIcon && <RightIconWrapper>{rightIcon}</RightIconWrapper>}
      </InputWrapper>
      {(error || helperText) && (
        <HelperText $isError={!!error}>{error || helperText}</HelperText>
      )}
    </Container>
  );
};

export default NeumorphicInput;
