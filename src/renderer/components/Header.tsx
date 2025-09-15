import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from './common/Button';
import { Select } from './common/Select';

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Title = styled.h1`
  color: white;
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Version = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  font-weight: 400;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LanguageSelect = styled(Select)`
  min-width: 120px;
  
  select {
    background: rgba(255, 255, 255, 0.9);
    color: ${props => props.theme.colors.text};
  }
`;

const DownloadButton = styled(Button)`
  background: ${props => props.theme.colors.success};
  color: white;
  border: none;
  
  &:hover {
    background: #059669;
  }
`;

interface HeaderProps {
  onLanguageChange: (language: string) => void;
  currentLanguage: string;
  onDownloadLilt: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLanguageChange,
  currentLanguage,
  onDownloadLilt,
}) => {
  const { t } = useTranslation();
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    const getVersion = async () => {
      try {
        const appVersion = await window.electronAPI.getAppVersion();
        setVersion(appVersion);
      } catch (error) {
        console.error('Failed to get app version:', error);
      }
    };

    getVersion();
  }, []);

  const languageOptions = [
    { value: 'en', label: t('languages.en') },
    { value: 'tr', label: t('languages.tr') },
    { value: 'de', label: t('languages.de') },
    { value: 'es', label: t('languages.es') },
  ];

  return (
    <HeaderContainer>
      <LeftSection>
        <Title>{t('app.title')}</Title>
        {version && <Version>{t('app.version', { version })}</Version>}
      </LeftSection>
      
      <RightSection>
        <DownloadButton onClick={onDownloadLilt}>
          {t('buttons.download')}
        </DownloadButton>
        
        <LanguageSelect
          value={currentLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          options={languageOptions}
        />
      </RightSection>
    </HeaderContainer>
  );
};
