import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import ConfigForm from './components/ConfigForm';
import OutputConsole from './components/OutputConsole';
import { LoadConfig, SaveConfig } from '../wailsjs/go/main/App';
import type { main } from '../wailsjs/go/models';

function App() {
  const { i18n } = useTranslation();
  const [configLoaded, setConfigLoaded] = useState(false);
  const [savedConfig, setSavedConfig] = useState<main.ConfigData | null>(null);

  useEffect(() => {
    // Load saved configuration on startup
    LoadConfig()
      .then((config) => {
        setSavedConfig(config);
        if (config.language) {
          i18n.changeLanguage(config.language);
        }
        setConfigLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load config:', err);
        setConfigLoaded(true);
      });
  }, [i18n]);

  const handleSaveConfig = (config: main.ConfigData) => {
    SaveConfig(config)
      .then(() => {
        setSavedConfig(config);
      })
      .catch((err) => {
        console.error('Failed to save config:', err);
      });
  };

  if (!configLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header onSaveConfig={handleSaveConfig} currentLanguage={savedConfig?.language || 'en'} />
      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4">
        <ConfigForm savedConfig={savedConfig} onSaveConfig={handleSaveConfig} />
        <OutputConsole />
      </div>
    </div>
  );
}

export default App;
