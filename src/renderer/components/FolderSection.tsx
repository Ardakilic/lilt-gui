import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { AppSettings } from '@shared/types';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Tooltip } from './common/Tooltip';

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.lg};
  font-weight: ${props => props.theme.fontWeight.semibold};
`;

const FolderGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSize.md};
  font-weight: ${props => props.theme.fontWeight.medium};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FolderInput = styled(Input)`
  flex: 1;
`;

const BrowseButton = styled(Button)`
  min-width: 80px;
`;

interface FolderSectionProps {
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onUpdateLastUsedPath: (pathType: string, path: string) => void;
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const FolderSection: React.FC<FolderSectionProps> = ({
  settings,
  onUpdateSetting,
  onUpdateLastUsedPath,
  onNotification,
}) => {
  const { t } = useTranslation();

  const handleBrowseFolder = async (folderType: 'sourceDir' | 'targetDir') => {
    try {
      const result = await window.electronAPI.selectFolder();
      if (result) {
        onUpdateSetting(folderType, result);
        onUpdateLastUsedPath(folderType, result);
      }
    } catch (error) {
      console.error(`Failed to select ${folderType}:`, error);
      onNotification('Failed to select folder', 'error');
    }
  };

  const folderConfigs = [
    {
      key: 'sourceDir' as const,
      label: t('labels.sourceFolder'),
      tooltip: t('tooltips.sourceFolder'),
      placeholder: t('placeholders.selectFolder'),
      required: true,
    },
    {
      key: 'targetDir' as const,
      label: t('labels.targetFolder'),
      tooltip: t('tooltips.targetFolder'),
      placeholder: t('placeholders.selectFolder'),
      required: true,
    },
  ];

  return (
    <div>
      <SectionTitle>{t('sections.folderConfiguration')}</SectionTitle>
      
      {folderConfigs.map((config) => (
        <FolderGroup key={config.key}>
          <Tooltip content={config.tooltip}>
            <Label>
              {config.label}
              {config.required && ' *'}
            </Label>
          </Tooltip>
          
          <InputGroup>
            <FolderInput
              type="text"
              value={settings[config.key]}
              onChange={(e) => onUpdateSetting(config.key, e.target.value)}
              placeholder={config.placeholder}
            />
            
            <BrowseButton
              variant="secondary"
              onClick={() => handleBrowseFolder(config.key)}
            >
              {t('buttons.browse')}
            </BrowseButton>
          </InputGroup>
        </FolderGroup>
      ))}
    </div>
  );
};
