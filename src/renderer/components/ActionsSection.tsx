import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from './common/Button';

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    
    button {
      width: 100%;
    }
  }
`;

const StartButton = styled(Button)`
  min-width: 160px;
  background: ${props => props.theme.colors.success};
  border-color: ${props => props.theme.colors.success};
  
  &:hover:not(:disabled) {
    background: #059669;
    border-color: #059669;
  }
`;

const StopButton = styled(Button)`
  min-width: 160px;
  background: ${props => props.theme.colors.error};
  border-color: ${props => props.theme.colors.error};
  
  &:hover:not(:disabled) {
    background: #dc2626;
    border-color: #dc2626;
  }
`;

const ProcessIndicator = styled.div<{ $isRunning: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.$isRunning ? props.theme.colors.success : props.theme.colors.textSecondary};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const StatusDot = styled.span<{ $isRunning: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$isRunning ? props.theme.colors.success : props.theme.colors.textLight};
  animation: ${props => props.$isRunning ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
`;

interface ActionsSectionProps {
  isProcessRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const ActionsSection: React.FC<ActionsSectionProps> = ({
  isProcessRunning,
  onStart,
  onStop,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <SectionTitle>{t('sections.actions')}</SectionTitle>
      
      <ButtonGroup>
        <StartButton
          size="lg"
          onClick={onStart}
          disabled={isProcessRunning}
        >
          {isProcessRunning ? '⟳' : '▶'} {t('buttons.start')}
        </StartButton>
        
        <StopButton
          size="lg"
          onClick={onStop}
          disabled={!isProcessRunning}
        >
          ⏹ {t('buttons.stop')}
        </StopButton>
        
        <ProcessIndicator $isRunning={isProcessRunning}>
          <StatusDot $isRunning={isProcessRunning} />
          {isProcessRunning ? t('status.running') : t('status.ready')}
        </ProcessIndicator>
      </ButtonGroup>
    </div>
  );
};
