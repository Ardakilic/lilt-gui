import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/api/dialog';
import { readTextFile, writeTextFile, BaseDirectory } from '@tauri-apps/api/fs';

import Header from './components/Header';
import BinarySettings from './components/BinarySettings';
import ConversionSettings from './components/ConversionSettings';
import DirectorySettings from './components/DirectorySettings';
import ActionButtons from './components/ActionButtons';
import OutputTerminal from './components/OutputTerminal';
import HelpDialog from './components/HelpDialog';

import { LiltConfig, ProcessOutput } from './types';

// Configuration file path for settings persistence
const CONFIG_FILE = 'lilt-gui-settings.json';

const defaultConfig: LiltConfig = {
  liltPath: '',
  soxPath: '',
  soxNgPath: '',
  ffmpegPath: '',
  ffprobePath: '',
  useDocker: true,
  dockerImage: 'ardakilic/sox_ng:latest',
  sourceDir: '',
  targetDir: '',
  copyImages: true,
  noPreserveMetadata: false,
  enforceOutputFormat: '',
};

function App() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<LiltConfig>(defaultConfig);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<ProcessOutput[]>([]);
  const [helpOpen, setHelpOpen] = useState(false);

  // Load settings on startup
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const configText = await readTextFile(CONFIG_FILE, { dir: BaseDirectory.AppData });
        const savedConfig = JSON.parse(configText);
        if (savedConfig) {
          setConfig({ ...defaultConfig, ...savedConfig });
        }
      } catch (error) {
        // File doesn't exist or is corrupted, use default config
        console.log('No saved settings found, using defaults');
      }
    };

    loadSettings();
  }, []);

  // Save settings when config changes
  useEffect(() => {
    const saveSettings = async () => {
      try {
        const configText = JSON.stringify(config, null, 2);
        await writeTextFile(CONFIG_FILE, configText, { dir: BaseDirectory.AppData });
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    };

    saveSettings();
  }, [config]);

  // Listen for process output
  useEffect(() => {
    const unlisten = listen<ProcessOutput>('lilt-output', event => {
      setOutput(prev => [...prev, event.payload]);
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  const updateConfig = (updates: Partial<LiltConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const handleSelectDirectory = async (type: 'source' | 'target') => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
      });

      if (selected && typeof selected === 'string') {
        if (type === 'source') {
          updateConfig({ sourceDir: selected });
        } else {
          updateConfig({ targetDir: selected });
        }
      }
    } catch (error) {
      console.error('Failed to select directory:', error);
    }
  };

  const handleStartTranscoding = async () => {
    if (!config.sourceDir || !config.targetDir) {
      alert(t('errors.directory_required'));
      return;
    }

    try {
      setIsRunning(true);
      setOutput([]);

      // Convert frontend config to backend format
      const backendConfig = {
        lilt_path: config.liltPath,
        sox_path: config.soxPath,
        sox_ng_path: config.soxNgPath,
        ffmpeg_path: config.ffmpegPath,
        ffprobe_path: config.ffprobePath,
        use_docker: config.useDocker,
        docker_image: config.dockerImage,
        source_dir: config.sourceDir,
        target_dir: config.targetDir,
        copy_images: config.copyImages,
        no_preserve_metadata: config.noPreserveMetadata,
        enforce_output_format: config.enforceOutputFormat,
      };

      await invoke('start_lilt_process', { config: backendConfig });
    } catch (error) {
      console.error('Failed to start transcoding:', error);
      setIsRunning(false);
      setOutput(prev => [
        ...prev,
        {
          line: t('errors.process_failed', { error: String(error) }),
          isError: true,
        },
      ]);
    }
  };

  const handleStopTranscoding = async () => {
    try {
      await invoke('stop_lilt_process');
      setIsRunning(false);
      setOutput(prev => [
        ...prev,
        {
          line: t('status.stopped'),
          isError: false,
        },
      ]);
    } catch (error) {
      console.error('Failed to stop transcoding:', error);
    }
  };

  const handleDownloadLilt = async () => {
    try {
      await invoke('open_lilt_releases');
    } catch (error) {
      console.error('Failed to open Lilt releases:', error);
    }
  };

  const clearOutput = () => {
    setOutput([]);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <Header onHelpClick={() => setHelpOpen(true)} />

      <main className='container mx-auto px-4 py-6 max-w-6xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Settings Panel */}
          <div className='space-y-6'>
            <BinarySettings config={config} onConfigChange={updateConfig} />

            <ConversionSettings config={config} onConfigChange={updateConfig} />

            <DirectorySettings
              config={config}
              onDirectorySelect={handleSelectDirectory}
            />

            <ActionButtons
              isRunning={isRunning}
              onStart={handleStartTranscoding}
              onStop={handleStopTranscoding}
              onDownload={handleDownloadLilt}
              onClearOutput={clearOutput}
            />
          </div>

          {/* Output Panel */}
          <div className='lg:col-span-1'>
            <OutputTerminal output={output} isRunning={isRunning} />
          </div>
        </div>
      </main>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}

export default App;
