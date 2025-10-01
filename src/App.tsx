import "./App.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Actions } from "./components/Actions";
import { BinaryConfig } from "./components/BinaryConfig";
import { FolderSelection } from "./components/FolderSelection";
import { HelpModal } from "./components/HelpModal";
import { LanguageSelector } from "./components/LanguageSelector";
import { OutputDisplay } from "./components/OutputDisplay";
import { TranscodingOptions } from "./components/TranscodingOptions";
import { useSettings } from "./hooks/useSettings";

function App() {
  const { t } = useTranslation();
  const [settings, setSettings] = useSettings();
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const handleTranscodingStart = () => {
    setIsRunning(true);
    setOutput((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${t("notifications.transcodingStarted")}`]);
  };

  const handleTranscodingStop = () => {
    setIsRunning(false);
    setOutput((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${t("notifications.transcodingStopped")}`]);
  };

  const handleClearOutput = () => {
    setOutput([]);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-title">
          <div>
            <h1>{t("app.title")}</h1>
            <p>{t("app.subtitle")}</p>
            <p className="version">{t("app.version", { version: "1.0.0" })}</p>
          </div>
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setShowHelp(true)}>
            {t("header.help")}
          </button>
          <LanguageSelector />
        </div>
      </header>

      <main className="main">
        <div className="grid-2">
          <BinaryConfig settings={settings} onSettingsChange={setSettings} />
          <TranscodingOptions settings={settings} onSettingsChange={setSettings} />
        </div>

        <FolderSelection settings={settings} onSettingsChange={setSettings} />

        <Actions
          settings={settings}
          isRunning={isRunning}
          onTranscodingStart={handleTranscodingStart}
          onTranscodingStop={handleTranscodingStop}
        />

        <OutputDisplay output={output} isRunning={isRunning} onClear={handleClearOutput} />
      </main>

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}

export default App;
