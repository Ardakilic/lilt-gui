import type { AppSettings } from '@shared/types';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Checkbox } from './common/Checkbox';
import { Input } from './common/Input';
import { Select } from './common/Select';
import { Tooltip } from './common/Tooltip';

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
`;

const OptionGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.fontSize.md};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

const DockerImageGroup = styled.div<{ disabled: boolean }>`
  margin-top: 12px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  transition: opacity 0.2s ease-in-out;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

interface OptionsSectionProps {
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

export const OptionsSection: React.FC<OptionsSectionProps> = ({ settings, onUpdateSetting }) => {
  const { t } = useTranslation();

  const outputFormatOptions = [
    { value: '', label: t('options.default') },
    { value: 'flac', label: t('options.flac') },
    { value: 'mp3', label: t('options.mp3') },
    { value: 'alac', label: t('options.alac') },
  ];

  return (
    <div>
      <SectionTitle>{t('sections.conversionOptions')}</SectionTitle>

      <OptionGroup>
        <Tooltip content={t('tooltips.useDocker')}>
          <Checkbox
            label={t('labels.useDocker')}
            checked={settings.useDocker}
            onChange={(e) => onUpdateSetting('useDocker', e.target.checked)}
          />
        </Tooltip>

        <DockerImageGroup disabled={!settings.useDocker}>
          <Tooltip content={t('tooltips.dockerImage')}>
            <Label>{t('labels.dockerImage')}</Label>
          </Tooltip>
          <Input
            type="text"
            value={settings.dockerImage}
            onChange={(e) => onUpdateSetting('dockerImage', e.target.value)}
            placeholder={t('placeholders.dockerImage')}
            disabled={!settings.useDocker}
          />
        </DockerImageGroup>
      </OptionGroup>

      <OptionGroup>
        <Tooltip content={t('tooltips.enforceOutputFormat')}>
          <Label>{t('labels.enforceOutputFormat')}</Label>
        </Tooltip>
        <Select
          value={settings.enforceOutputFormat}
          onChange={(e) =>
            onUpdateSetting('enforceOutputFormat', e.target.value as 'flac' | 'mp3' | 'alac' | '')
          }
          options={outputFormatOptions}
        />
      </OptionGroup>

      <OptionGroup>
        <CheckboxGroup>
          <Tooltip content={t('tooltips.copyImages')}>
            <Checkbox
              label={t('labels.copyImages')}
              checked={settings.copyImages}
              onChange={(e) => onUpdateSetting('copyImages', e.target.checked)}
            />
          </Tooltip>

          <Tooltip content={t('tooltips.noPreserveMetadata')}>
            <Checkbox
              label={t('labels.noPreserveMetadata')}
              checked={settings.noPreserveMetadata}
              onChange={(e) => onUpdateSetting('noPreserveMetadata', e.target.checked)}
            />
          </Tooltip>
        </CheckboxGroup>
      </OptionGroup>
    </div>
  );
};
