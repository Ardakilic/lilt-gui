import type { AppSettings } from '@shared/types';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from './common/Button';
import { Input } from './common/Input';
import { Tooltip } from './common/Tooltip';

const SectionTitle = styled.h3`
  margin: 0 0 20px 0;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.fontSize.lg};
  font-weight: ${(props) => props.theme.fontWeight.semibold};
`;

const BinaryGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: ${(props) => props.theme.colors.text};
  font-size: ${(props) => props.theme.fontSize.md};
  font-weight: ${(props) => props.theme.fontWeight.medium};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const BinaryInput = styled(Input)`
  flex: 1;
`;

const BinaryButton = styled(Button)`
  min-width: 80px;
`;

const IdentifyButton = styled(Button)`
  min-width: 80px;
`;

const DisabledGroup = styled.div<{ disabled: boolean }>`
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  transition: opacity 0.2s ease-in-out;
`;

interface BinarySectionProps {
  settings: AppSettings;
  onUpdateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onUpdateLastUsedPath: (pathType: string, path: string) => void;
  onNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const BinarySection: React.FC<BinarySectionProps> = ({
  settings,
  onUpdateSetting,
  onUpdateLastUsedPath,
  onNotification,
}) => {
  const { t } = useTranslation();

  const handleBrowse = async (binaryType: keyof AppSettings) => {
    try {
      const filters = [
        {
          name: 'Executable Files',
          extensions: process.platform === 'win32' ? ['exe'] : ['exe', ''],
        },
        { name: 'All Files', extensions: ['*'] },
      ];

      const result = await window.electronAPI.selectFile(filters);
      if (result) {
        onUpdateSetting(binaryType, result);
        onUpdateLastUsedPath(binaryType.replace('BinaryPath', 'Binary'), result);
      }
    } catch (error) {
      console.error(`Failed to select ${binaryType}:`, error);
      onNotification('Failed to select file', 'error');
    }
  };

  const handleIdentify = async (binaryName: string, settingKey: keyof AppSettings) => {
    try {
      const result = await window.electronAPI.identifyBinary(binaryName);
      if (result.isAvailable && result.path) {
        onUpdateSetting(settingKey, result.path);
        onUpdateLastUsedPath(binaryName, result.path);
        onNotification(t('messages.binaryFound', { path: result.path }), 'success');
      } else {
        onNotification(t('messages.binaryNotFound'), 'error');
      }
    } catch (error) {
      console.error(`Failed to identify ${binaryName}:`, error);
      onNotification(t('messages.binaryNotFound'), 'error');
    }
  };

  const binaryConfigs = [
    {
      key: 'liltBinaryPath' as const,
      label: t('labels.liltBinary'),
      tooltip: t('tooltips.liltBinary'),
      binaryName: 'lilt',
      required: true,
    },
    {
      key: 'soxBinaryPath' as const,
      label: t('labels.soxBinary'),
      tooltip: t('tooltips.soxBinary'),
      binaryName: 'sox',
      required: !settings.useDocker,
    },
    {
      key: 'ffmpegBinaryPath' as const,
      label: t('labels.ffmpegBinary'),
      tooltip: t('tooltips.ffmpegBinary'),
      binaryName: 'ffmpeg',
      required: !settings.useDocker,
    },
    {
      key: 'ffprobeBinaryPath' as const,
      label: t('labels.ffprobeBinary'),
      tooltip: t('tooltips.ffprobeBinary'),
      binaryName: 'ffprobe',
      required: !settings.useDocker,
    },
  ];

  return (
    <div>
      <SectionTitle>{t('sections.binaryConfiguration')}</SectionTitle>

      {binaryConfigs.map((config) => (
        <BinaryGroup key={config.key}>
          <DisabledGroup disabled={config.key !== 'liltBinaryPath' && settings.useDocker}>
            <Tooltip content={config.tooltip}>
              <Label>
                {config.label}
                {config.required && ' *'}
              </Label>
            </Tooltip>

            <InputGroup>
              <BinaryInput
                type="text"
                value={settings[config.key]}
                onChange={(e) => onUpdateSetting(config.key, e.target.value)}
                placeholder={t('placeholders.selectBinary')}
                disabled={config.key !== 'liltBinaryPath' && settings.useDocker}
              />

              <BinaryButton
                variant="secondary"
                onClick={() => handleBrowse(config.key)}
                disabled={config.key !== 'liltBinaryPath' && settings.useDocker}
              >
                {t('buttons.browse')}
              </BinaryButton>

              <IdentifyButton
                variant="ghost"
                onClick={() => handleIdentify(config.binaryName, config.key)}
                disabled={config.key !== 'liltBinaryPath' && settings.useDocker}
              >
                {t('buttons.identify')}
              </IdentifyButton>
            </InputGroup>
          </DisabledGroup>
        </BinaryGroup>
      ))}
    </div>
  );
};
