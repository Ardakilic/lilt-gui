import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { EventsOn } from '../../wailsjs/runtime/runtime';
import { StopTranscoding } from '../../wailsjs/go/main/App';

interface OutputLine {
  type: string;
  data: string;
}

function OutputConsole() {
  const { t } = useTranslation();
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const outputEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeOutput = EventsOn('transcoding-output', (data: OutputLine) => {
      setOutput((prev) => [...prev, data.data]);
      setIsRunning(true);
    });

    const unsubscribeComplete = EventsOn('transcoding-complete', (message: string) => {
      setOutput((prev) => [...prev, `\n✅ ${message}\n`]);
      setIsRunning(false);
    });

    const unsubscribeError = EventsOn('transcoding-error', (error: string) => {
      setOutput((prev) => [...prev, `\n❌ Error: ${error}\n`]);
      setIsRunning(false);
    });

    return () => {
      unsubscribeOutput();
      unsubscribeComplete();
      unsubscribeError();
    };
  }, []);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output]);

  const handleStopTranscoding = async () => {
    try {
      await StopTranscoding();
      setOutput((prev) => [...prev, `\n⚠️  ${t('output.stopped')}\n`]);
      setIsRunning(false);
    } catch (err) {
      alert(`${t('output.stopFailed')}: ${err}`);
    }
  };

  const handleClearOutput = () => {
    setOutput([]);
  };

  return (
    <div className="card bg-base-100 shadow-xl flex-1 overflow-hidden flex flex-col">
      <div className="card-body flex flex-col overflow-hidden">
        <div className="flex justify-between items-center">
          <h2 className="card-title">{t('output.title')}</h2>
          <div className="flex gap-2">
            {isRunning && (
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={handleStopTranscoding}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                {t('output.stopTranscoding')}
              </button>
            )}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleClearOutput}
              disabled={isRunning}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="w-4 h-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              {t('output.clear')}
            </button>
          </div>
        </div>

        <div className="flex-1 bg-base-300 rounded-lg p-4 overflow-y-auto scrollbar-thin font-mono text-sm">
          {output.length === 0 ? (
            <div className="text-base-content opacity-50 text-center">
              {t('output.placeholder')}
            </div>
          ) : (
            <div className="output-console">
              {output.join('')}
              <div ref={outputEndRef} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OutputConsole;
