import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AppSettings, LiltConfig } from '@shared/types';
import { Header } from './components/Header';
import { BinarySection } from './components/BinarySection';
import { FolderSection } from './components/FolderSection';
import { OptionsSection } from './components/OptionsSection';
import { ActionsSection } from './components/ActionsSection';
import { OutputSection } from './components/OutputSection';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Notification } from './components/Notification';
import { theme } from './styles/theme';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  #root {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto;
  background: rgba(255, 255, 255, 0.95);
  margin: 10px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
`;

const Section = styled.div`
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

export const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const [isProcessRunning, setIsProcessRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);

  useEffect(() => {
    loadSettings();
    setupEventListeners();

    return () => {
      // Cleanup listeners
      window.electronAPI.removeAllListeners('lilt-output');
      window.electronAPI.removeAllListeners('lilt-finished');
      window.electronAPI.removeAllListeners('lilt-error');
    };
  }, []);

  useEffect(() => {
    if (settings) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings?.language, i18n]);

  const loadSettings = async () => {
    try {
      const loadedSettings = await window.electronAPI.getSettings();
      setSettings(loadedSettings);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load settings:', error);
      showNotification(t('messages.settingsLoadFailed'), 'error');
      setLoading(false);
    }
  };

  const setupEventListeners = () => {
    window.electronAPI.onLiltOutput((output: string) => {
      setOutput(prev => [...prev, output]);
    });

    window.electronAPI.onLiltFinished((result) => {
      setIsProcessRunning(false);
      showNotification(t('messages.processFinished', { code: result.code }), 'success');
    });

    window.electronAPI.onLiltError((error) => {
      setIsProcessRunning(false);
      showNotification(t('messages.processError', { error: error.error }), 'error');
    });
  };

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const updatedSettings = await window.electronAPI.saveSettings(newSettings);
      setSettings(updatedSettings);
      showNotification(t('messages.settingsSaved'), 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings', 'error');
    }
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    if (settings) {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      saveSettings({ [key]: value });
    }
  };

  const updateLastUsedPath = (pathType: string, path: string) => {
    if (settings) {
      const newLastUsedPaths = {
        ...settings.lastUsedPaths,
        [pathType]: path
      };
      updateSetting('lastUsedPaths', newLastUsedPaths);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const validateConfig = (): string | null => {
    if (!settings) return 'Settings not loaded';
    if (!settings.sourceDir) return t('messages.selectSourceFolder');
    if (!settings.targetDir) return t('messages.selectTargetFolder');
    if (!settings.liltBinaryPath) return t('messages.selectLiltBinary');
    
    if (!settings.useDocker) {
      if (!settings.soxBinaryPath) return 'Please select SoX binary';
      if (!settings.ffmpegBinaryPath) return 'Please select FFmpeg binary';
      if (!settings.ffprobeBinaryPath) return 'Please select FFprobe binary';
    }
    
    return null;
  };

  const startTranscoding = async () => {
    const validationError = validateConfig();
    if (validationError) {
      showNotification(validationError, 'error');
      return;
    }

    if (!settings) return;

    const config: LiltConfig = {
      sourceDir: settings.sourceDir,
      targetDir: settings.targetDir,
      copyImages: settings.copyImages,
      useDocker: settings.useDocker,
      dockerImage: settings.dockerImage,
      noPreserveMetadata: settings.noPreserveMetadata,
      enforceOutputFormat: settings.enforceOutputFormat,
      liltBinaryPath: settings.liltBinaryPath,
      soxBinaryPath: settings.soxBinaryPath,
      ffmpegBinaryPath: settings.ffmpegBinaryPath,
      ffprobeBinaryPath: settings.ffprobeBinaryPath,
    };

    try {
      const result = await window.electronAPI.startLilt(config);
      if (result.success) {
        setIsProcessRunning(true);
        setOutput([]);
        showNotification(t('messages.processStarted'), 'success');
      } else {
        showNotification(result.error || 'Failed to start process', 'error');
      }
    } catch (error) {
      showNotification('Failed to start transcoding', 'error');
    }
  };

  const stopTranscoding = async () => {
    try {
      await window.electronAPI.stopLilt();
      setIsProcessRunning(false);
      showNotification(t('messages.processStopped'), 'info');
    } catch (error) {
      showNotification('Failed to stop process', 'error');
    }
  };

  const downloadLilt = async () => {
    try {
      showNotification(t('messages.downloadStarted'), 'info');
      const result = await window.electronAPI.downloadLilt();
      
      if (result.success && result.path) {
        updateSetting('liltBinaryPath', result.path);
        showNotification(t('messages.downloadCompleted', { path: result.path }), 'success');
      } else {
        showNotification(t('messages.downloadFailed', { error: result.error }), 'error');
      }
    } catch (error) {
      showNotification(t('messages.downloadFailed', { error: 'Unknown error' }), 'error');
    }
  };

  const changeLanguage = (language: string) => {
    updateSetting('language', language);
    i18n.changeLanguage(language);
  };

  if (loading || !settings) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Container>
          <LoadingSpinner />
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Container>
        <Header 
          onLanguageChange={changeLanguage}
          currentLanguage={settings.language}
          onDownloadLilt={downloadLilt}
        />
        
        <MainContent>
          <ScrollableContent>
            <Section>
              <BinarySection
                settings={settings}
                onUpdateSetting={updateSetting}
                onUpdateLastUsedPath={updateLastUsedPath}
                onNotification={showNotification}
              />
            </Section>

            <Section>
              <FolderSection
                settings={settings}
                onUpdateSetting={updateSetting}
                onUpdateLastUsedPath={updateLastUsedPath}
                onNotification={showNotification}
              />
            </Section>

            <Section>
              <OptionsSection
                settings={settings}
                onUpdateSetting={updateSetting}
              />
            </Section>

            <Section>
              <ActionsSection
                isProcessRunning={isProcessRunning}
                onStart={startTranscoding}
                onStop={stopTranscoding}
              />
            </Section>
          </ScrollableContent>

          <OutputSection output={output} />
        </MainContent>

        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
      </Container>
    </ThemeProvider>
  );
};
