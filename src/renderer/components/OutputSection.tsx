import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const OutputContainer = styled.div`
  margin-top: 20px;
  flex-shrink: 0;
`;

const OutputTitle = styled.h3`
  margin: 0 0 12px 0;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
`;

const OutputBox = styled.div`
  background: ${(props) => props.theme.colors.gray900};
  color: ${(props) => props.theme.colors.gray100};
  border-radius: ${(props) => props.theme.borderRadius.md};
  padding: 16px;
  height: 200px;
  overflow-y: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const OutputLine = styled.div`
  margin-bottom: 4px;
  white-space: pre-wrap;
  word-break: break-word;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const EmptyMessage = styled.div`
  color: ${(props) => props.theme.colors.textLight};
  font-style: italic;
  text-align: center;
  padding: 40px 20px;
`;

const ScrollButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: ${(props) => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const OutputWrapper = styled.div`
  position: relative;
`;

interface OutputSectionProps {
  output: string[];
}

export const OutputSection: React.FC<OutputSectionProps> = ({ output }) => {
  const { t } = useTranslation();
  const outputRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = React.useState(true);
  const [showScrollButton, setShowScrollButton] = React.useState(false);

  useEffect(() => {
    if (outputRef.current && autoScroll) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [autoScroll]);

  const handleScroll = () => {
    if (!outputRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = outputRef.current;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    setAutoScroll(isAtBottom);
    setShowScrollButton(!isAtBottom && output.length > 0);
  };

  const scrollToBottom = () => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
      setAutoScroll(true);
      setShowScrollButton(false);
    }
  };

  return (
    <OutputContainer>
      <OutputTitle>{t('labels.output')}</OutputTitle>
      <OutputWrapper>
        <OutputBox ref={outputRef} onScroll={handleScroll}>
          {output.length === 0 ? (
            <EmptyMessage>No output yet. Start transcoding to see progress here.</EmptyMessage>
          ) : (
            output.map((line, index) => (
              <OutputLine key={`output-${index}-${line.slice(0, 20)}`}>{line}</OutputLine>
            ))
          )}
        </OutputBox>

        {showScrollButton && (
          <ScrollButton onClick={scrollToBottom}>↓ Scroll to bottom</ScrollButton>
        )}
      </OutputWrapper>
    </OutputContainer>
  );
};
