import React, { useEffect, useState } from 'react';

type Props = {
  opportunities: any[];
  trackerState: Record<string, string>;
  setTrackerState: (s: Record<string, string>) => void;
};

const COLUMNS = ['Saved', 'Applying', 'Applied', 'Interview', 'Selected'] as const;

export default function Tracker({ opportunities, trackerState, setTrackerState }: Props) {
  const state = trackerState;
  const [dragOver, setDragOver] = useState<string | null>(null);

  const moveTo = (id: string, column: string) => {
    if (column === 'Selected') {
      const ok = window.confirm('Mark this application as Selected?');
      if (!ok) return;
    }
    setTrackerState({ ...state, [id]: column });
  };

  // drag handlers
  const onDragStart = (e: React.DragEvent, id: string) => {
    try {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
    } catch {}
  };

  const onDrop = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      const exists = opportunities.some((o) => o.id === id);
      if (exists) moveTo(id, column);
    }
  };

  const onDragEnter = (e: React.DragEvent, column: string) => {
    e.preventDefault();
    setDragOver(column);
  };

  const onDragLeave = (_e: React.DragEvent) => {
    setDragOver(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <section>
      <h2 className="section-title">Application Tracker</h2>
      <div className="kanban">
        {COLUMNS.map((col) => (
          <div
            key={col}
            className={`kanban-column ${dragOver === col ? 'drag-over' : ''}`}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col)}
            onDragEnter={(e) => onDragEnter(e, col)}
            onDragLeave={onDragLeave}
          >
            <h3 className="kanban-title">{col}</h3>
            <div className="kanban-list">
              {opportunities
                .filter((o) => (state[o.id] || 'Saved') === col)
                .map((o) => (
                  <div
                    key={o.id}
                    className="kanban-card"
                    draggable
                    tabIndex={0}
                    onDragStart={(e) => onDragStart(e, o.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        const idx = COLUMNS.indexOf(col as any);
                        const next = COLUMNS[Math.min(idx + 1, COLUMNS.length - 1)];
                        moveTo(o.id, next);
                      } else if (e.key === 'ArrowLeft') {
                        const idx = COLUMNS.indexOf(col as any);
                        const prev = COLUMNS[Math.max(idx - 1, 0)];
                        moveTo(o.id, prev);
                      }
                    }}
                  >
                    <strong>{o.title}</strong>
                    <div className="kanban-meta">
                      <small>{o.organization}</small>
                      <div className="kanban-actions">
                        <a className="apply-link small" href={o.link} target="_blank" rel="noreferrer">Details</a>
                        {col !== 'Saved' && <button onClick={() => moveTo(o.id, 'Saved')}>← Save</button>}
                        {col !== 'Selected' && <button onClick={() => moveTo(o.id, COLUMNS[Math.min(COLUMNS.indexOf(col as any) + 1, COLUMNS.length - 1)])}>→</button>}
                      </div>
                    </div>
                  </div>
                ))}
              {opportunities.filter((o) => (state[o.id] || 'Saved') === col).length === 0 && (
                <div className="kanban-empty">Drop cards here</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="muted">Drag cards between columns or use arrow buttons. State persists to localStorage.</p>
    </section>
  );
}
