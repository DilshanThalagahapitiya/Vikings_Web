import { useState } from 'react';
import { downloadText, readFileText, todayStamp } from '../../lib/download';
import { Button } from '../ui/Button';
import { FilePicker } from '../ui/FilePicker';
import { Notice } from '../ui/Notice';

interface Props {
  title: string;
  description: string;
  columns: string;
  count: number;
  preview: string[][];
  previewHead: string[];
  onImport: (text: string) => Promise<number>;
  onExport: () => Promise<string>;
  filename: string;
}

/** Import / export card for one catalog CSV. */
export function CsvManager({
  title,
  description,
  columns,
  count,
  preview,
  previewHead,
  onImport,
  onExport,
  filename,
}: Props) {
  const [message, setMessage] = useState<{ tone: 'success' | 'error'; text: string }>();
  const [busy, setBusy] = useState(false);

  const run = async (fn: () => Promise<string>, tone: 'success' = 'success') => {
    setBusy(true);
    try {
      setMessage({ tone, text: await fn() });
    } catch (e) {
      setMessage({ tone: 'error', text: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card">
      <header className="card__head">
        <div>
          <h2>{title}</h2>
          <p className="muted">{description}</p>
          <p className="muted small">Columns: {columns}</p>
        </div>
        <div className="actions">
          <FilePicker
            accept=".csv,text/csv"
            label="Import CSV"
            onFile={(file) =>
              run(async () => `Imported ${await onImport(await readFileText(file))} rows from ${file.name}`)
            }
          />
          <Button
            variant="secondary"
            size="sm"
            disabled={busy}
            onClick={() =>
              run(async () => {
                downloadText(`${filename}_${todayStamp()}.csv`, await onExport());
                return 'Exported.';
              })
            }
          >
            Export CSV
          </Button>
        </div>
      </header>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {previewHead.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="muted small">
        {count} rows{count > preview.length ? ` (showing first ${preview.length})` : ''}
      </p>
    </section>
  );
}
