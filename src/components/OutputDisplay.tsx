import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface OutputDisplayProps {
  output: string[];
  isRunning: boolean;
  onClear: () => void;
}

export function OutputDisplay({ output, isRunning, onClear }: OutputDisplayProps) {
  const { t } = useTranslation();
  const outputRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="section">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 className="section-title" style={{ marginBottom: 0 }}>
          {t("output.title")}
        </h2>
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={onClear}
          disabled={output.length === 0}
        >
          {t("output.clear")}
        </button>
      </div>
      <div className="output-container">
        <pre ref={outputRef}>
          {output.length === 0 ? (
            <span style={{ color: "var(--text-secondary)" }}>{t("output.waiting")}</span>
          ) : (
            output.join("\n")
          )}
          {isRunning && (
            <>
              {"\n"}
              <span style={{ color: "var(--success-color)" }}>{t("output.running")}</span>
            </>
          )}
        </pre>
      </div>
    </div>
  );
}
