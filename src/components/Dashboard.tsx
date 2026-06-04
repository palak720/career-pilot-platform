import React from 'react';

type Props = {
  opportunities: any[];
  bookmarks: string[];
  reminders: Record<string, boolean>;
  userProfile: { skills: string[]; experience: string; interests: string[] };
  calculateMatchScore: (op: any, profile: any) => number;
  getDaysUntil: (deadline: string) => number;
  formatRelativeDeadline: (deadline: string) => string;
  trackerState?: Record<string, string>;
};

export default function Dashboard({ opportunities, bookmarks, reminders, userProfile, calculateMatchScore, getDaysUntil, formatRelativeDeadline, trackerState, onOpenTracker }: Props & { onOpenTracker?: () => void }) {
  const saved = opportunities.filter((o) => bookmarks.includes(o.id));
  const applied = opportunities.filter((o) => (trackerState && trackerState[o.id]) === 'Applied');
  const upcoming = opportunities
    .filter((o) => getDaysUntil(o.deadline) >= 0)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 6);

  const recommendations = opportunities
    .map((o) => ({ o, score: calculateMatchScore(o, userProfile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.o);

  return (
    <section>
      <h2 className="section-title">Personalized Dashboard</h2>
      <div className="dashboard-grid">
        <div className="widget">
          <h3>Saved opportunities</h3>
          {saved.length === 0 ? <p className="empty-state">No saved items.</p> : (
            <ul className="simple-list">
              {saved.map((s) => (
                <li key={s.id}>{s.title} — <span className="muted">{s.organization}</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="widget">
          <h3>Applied opportunities</h3>
          {applied.length === 0 ? (
            <p className="muted">No tracked applications yet. Use the Tracker to move items through stages.</p>
          ) : (
            <>
              <ul className="simple-list">
                {applied.map((a) => (
                  <li key={a.id}>{a.title} — <span className="muted">{a.organization}</span></li>
                ))}
              </ul>
              <div style={{ marginTop: 10 }}>
                <button className="tab-btn" onClick={() => onOpenTracker && onOpenTracker()}>Open Tracker</button>
              </div>
            </>
          )}
        </div>

        <div className="widget">
          <h3>Upcoming deadlines</h3>
          {upcoming.length === 0 ? <p className="empty-state">No upcoming deadlines.</p> : (
            <ul className="simple-list">
              {upcoming.map((u) => (
                <li key={u.id}>{u.title} — {formatRelativeDeadline(u.deadline)}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="widget">
          <h3>Recommendations</h3>
          {recommendations.length === 0 ? <p className="empty-state">No recommendations yet — set your profile.</p> : (
            <ul className="simple-list">
              {recommendations.map((r) => (
                <li key={r.id}>{r.title} — <strong>{calculateMatchScore(r, userProfile)}% match</strong></li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
