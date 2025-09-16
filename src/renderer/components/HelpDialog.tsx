import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from './common/Button';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const DialogContainer = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 12px;
  max-width: 600px;
  max-height: 80vh;
  width: 90%;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.xl};
  font-weight: ${props => props.theme.fontWeight.bold};
  margin: 0;
`;

const CloseButton = styled(Button)`
  min-width: 80px;
`;

const Content = styled.div`
  color: ${props => props.theme.colors.text};
  line-height: 1.6;
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
  margin: 0 0 12px 0;
`;

const Description = styled.p`
  margin: 0 0 12px 0;
  color: ${props => props.theme.colors.textSecondary};
`;

const FeatureList = styled.ul`
  margin: 0 0 12px 20px;
  padding: 0;
  color: ${props => props.theme.colors.textSecondary};
`;

const FeatureItem = styled.li`
  margin-bottom: 8px;
`;

const AuthorSection = styled.div`
  background: ${props => props.theme.colors.backgroundAlt};
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
`;

const AuthorTitle = styled.h4`
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.semibold};
  margin: 0 0 8px 0;
`;

const AuthorInfo = styled.p`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.textSecondary};
`;

const Link = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpDialog: React.FC<HelpDialogProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleLinkClick = (url: string) => {
    window.electronAPI.openExternal(url);
  };

  return (
    <Overlay onClick={handleOverlayClick} data-testid="help-dialog-overlay">
      <DialogContainer>
        <Header>
          <Title>{t('help.title')}</Title>
          <CloseButton variant="ghost" onClick={onClose}>
            {t('buttons.close')}
          </CloseButton>
        </Header>
        
        <Content>
          <Section>
            <SectionTitle>{t('help.about.title')}</SectionTitle>
            <Description>{t('help.about.description')}</Description>
            <Description>{t('help.about.purpose')}</Description>
          </Section>

          <Section>
            <SectionTitle>{t('help.features.title')}</SectionTitle>
            <FeatureList>
              <FeatureItem>{t('help.features.modern')}</FeatureItem>
              <FeatureItem>{t('help.features.docker')}</FeatureItem>
              <FeatureItem>{t('help.features.formats')}</FeatureItem>
              <FeatureItem>{t('help.features.batch')}</FeatureItem>
              <FeatureItem>{t('help.features.metadata')}</FeatureItem>
              <FeatureItem>{t('help.features.multilang')}</FeatureItem>
            </FeatureList>
          </Section>

          <Section>
            <SectionTitle>{t('help.usage.title')}</SectionTitle>
            <FeatureList>
              <FeatureItem>{t('help.usage.step1')}</FeatureItem>
              <FeatureItem>{t('help.usage.step2')}</FeatureItem>
              <FeatureItem>{t('help.usage.step3')}</FeatureItem>
              <FeatureItem>{t('help.usage.step4')}</FeatureItem>
              <FeatureItem>{t('help.usage.step5')}</FeatureItem>
            </FeatureList>
          </Section>

          <AuthorSection>
            <AuthorTitle>{t('help.author.title')}</AuthorTitle>
            <AuthorInfo>
              {t('help.author.name')}: <strong>Arda Kilicdagi</strong>
            </AuthorInfo>
            <AuthorInfo>
              {t('help.author.github')}: {' '}
              <Link onClick={() => handleLinkClick('https://github.com/Ardakilic')}>
                github.com/Ardakilic
              </Link>
            </AuthorInfo>
            <AuthorInfo>
              {t('help.author.project')}: {' '}
              <Link onClick={() => handleLinkClick('https://github.com/Ardakilic/lilt-gui')}>
                github.com/Ardakilic/lilt-gui
              </Link>
            </AuthorInfo>
            <AuthorInfo>
              {t('help.author.lilt')}: {' '}
              <Link onClick={() => handleLinkClick('https://github.com/Ardakilic/lilt')}>
                github.com/Ardakilic/lilt
              </Link>
            </AuthorInfo>
          </AuthorSection>
        </Content>
      </DialogContainer>
    </Overlay>
  );
};