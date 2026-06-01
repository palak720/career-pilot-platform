import { useEffect, useMemo, useState } from 'react';

export type OpportunityCategory = 'Internship' | 'Fellowship' | 'Hackathon' | 'Open Source';

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  deadline: string;
  location: string;
  tags: string[];
  link: string;
  description: string;
};

const sampleOpportunities: Opportunity[] = [
  {
    id: 'intern-1',
    title: 'Software Engineering Internship',
    organization: 'TechLeap Labs',
    category: 'Internship',
    deadline: '2026-06-18',
    location: 'Remote',
    tags: ['Full-time', 'Remote', 'Paid'],
    link: 'https://example.com/techleap-internship',
    description: 'Build real products with an early-stage engineering team.',
  },
  {
    id: 'fellowship-1',
    title: 'Data Fellowship Program',
    organization: 'Impact Data Collective',
    category: 'Fellowship',
    deadline: '2026-06-25',
    location: 'Hybrid',
    tags: ['Part-time', 'Mentorship', 'Stipend'],
    link: 'https://example.com/data-fellowship',
    description: 'Work on data-driven impact projects with expert coaching.',
  },
  {
    id: 'hackathon-1',
    title: 'AI For Good Hackathon',
    organization: 'DevSprint',
    category: 'Hackathon',
    deadline: '2026-06-12',
    location: 'Online',
    tags: ['24h', 'Teams', 'Prizes'],
    link: 'https://example.com/ai-good-hackathon',
    description: 'Build AI solutions for sustainability and social impact.',
  },
  {
    id: 'oss-1',
    title: 'Open Source Contributor Camp',
    organization: 'Global OSS',
    category: 'Open Source',
    deadline: '2026-07-05',
    location: 'Remote',
    tags: ['Mentored', 'Community', 'Issues'],
    link: 'https://example.com/oss-camp',
    description: 'Contribute to open-source projects and earn official recognition.',
  },
  {
    id: 'intern-2',
    title: 'Product Design Internship',
    organization: 'Design Pulse',
    category: 'Internship',
    deadline: '2026-06-30',
    location: 'On-site',
    tags: ['Paid', 'Portfolio', 'Team'],
    link: 'https://example.com/design-internship',
    description: 'Shape product experiences with a user-first design team.',
  },
  {
    id: 'fellowship-2',
    title: 'Cybersecurity Fellowship',
    organization: 'SecureFuture',
    category: 'Fellowship',
    deadline: '2026-06-20',
    location: 'Remote',
    tags: ['Training', 'Certification', 'Network'],
    link: 'https://example.com/cyber-fellowship',
    description: 'Join a cohort focused on security research and operations.',
  },
  {
    id: 'hackathon-2',
    title: 'Blockchain Buildathon',
    organization: 'ChainWorks',
    category: 'Hackathon',
    deadline: '2026-07-10',
    location: 'Online',
    tags: ['Web3', 'Team', 'Innovation'],
    link: 'https://example.com/blockchain-hackathon',
    description: 'Create decentralized applications and win mentoring sessions.',
  },
  {
    id: 'oss-2',
    title: 'Open Source Mentorship',
    organization: 'CodeBridge',
    category: 'Open Source',
    deadline: '2026-06-22',
    location: 'Remote',
    tags: ['Mentorship', 'Beginner-friendly', 'Community'],
    link: 'https://example.com/oss-mentorship',
    description: 'Get guided contributions to a popular open-source codebase.',
  },
];

const categories: OpportunityCategory[] = ['Internship', 'Fellowship', 'Hackathon', 'Open Source'];

const STORAGE_KEYS = {
  bookmarks: 'careerPilotBookmarks',
  reminders: 'careerPilotReminders',
};

function getDaysUntil(deadline: string) {
  const now = new Date();
  const due = new Date(deadline + 'T23:59:59');
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function formatRelativeDeadline(deadline: string) {
  const days = getDaysUntil(deadline);
  if (days < 0) {
    return `Passed ${Math.abs(days)} day(s) ago`;
  }
  if (days === 0) {
    return 'Due today';
  }
  return `Due in ${days} day(s)`;
}

function buildReminderMessage(opportunity: Opportunity) {
  const days = getDaysUntil(opportunity.deadline);
  if (days < 0) return 'Deadline passed';
  if (days <= 2) return 'Deadline approaching soon';
  return `Reminder set for ${days} day(s) before deadline`;
}

function App() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<OpportunityCategory | 'All'>('All');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedBookmarks = localStorage.getItem(STORAGE_KEYS.bookmarks);
    const savedReminders = localStorage.getItem(STORAGE_KEYS.reminders);
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
  }, [reminders]);

  const filtered = useMemo(() => {
    return sampleOpportunities.filter((opportunity) => {
      const matchesSearch = [opportunity.title, opportunity.organization, ...opportunity.tags]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || opportunity.category === categoryFilter;
      const matchesBookmark = !showBookmarkedOnly || bookmarks.includes(opportunity.id);
      const matchesRemote = !showRemoteOnly || opportunity.location.toLowerCase().includes('remote');
      return matchesSearch && matchesCategory && matchesBookmark && matchesRemote;
    });
  }, [search, categoryFilter, showBookmarkedOnly, showRemoteOnly, bookmarks]);

  const upcomingReminders = useMemo(() => {
    return sampleOpportunities
      .filter((opportunity) => reminders[opportunity.id] && getDaysUntil(opportunity.deadline) >= 0)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }, [reminders]);

  const toggleBookmark = (id: string) => {
    setBookmarks((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const toggleReminder = (id: string) => {
    setReminders((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">MVP Opportunity Feed</p>
          <h1>Career Pilot</h1>
          <p className="subtitle">Unified feed for internships, fellowships, hackathons, and open source programs.</p>
        </div>
        <div className="reminders-card">
          <h2>Deadline reminders</h2>
          {upcomingReminders.length > 0 ? (
            <div className="reminder-list">
              {upcomingReminders.map((opportunity) => (
                <div key={opportunity.id} className="reminder-item">
                  <strong>{opportunity.title}</strong>
                  <span>{formatRelativeDeadline(opportunity.deadline)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No active reminders yet.</p>
          )}
        </div>
      </header>

      <section className="controls">
        <div className="search-box">
          <label htmlFor="search">Search opportunities</label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, organization, tags..."
          />
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as OpportunityCategory | 'All')}
            >
              <option value="All">All</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="toggles">
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={showRemoteOnly}
                onChange={() => setShowRemoteOnly((value) => !value)}
              />
              Remote only
            </label>
            <label className="toggle-item">
              <input
                type="checkbox"
                checked={showBookmarkedOnly}
                onChange={() => setShowBookmarkedOnly((value) => !value)}
              />
              Bookmarked only
            </label>
          </div>
        </div>
      </section>

      <main>
        <h2 className="section-title">Opportunities</h2>
        <div className="grid">
          {filtered.map((opportunity) => {
            const isBookmarked = bookmarks.includes(opportunity.id);
            const hasReminder = Boolean(reminders[opportunity.id]);
            return (
              <article key={opportunity.id} className="card">
                <div className="card-header">
                  <div>
                    <p className="category-pill">{opportunity.category}</p>
                    <h3>{opportunity.title}</h3>
                    <p className="org-name">{opportunity.organization}</p>
                  </div>
                  <button
                    className={`icon-button ${isBookmarked ? 'active' : ''}`}
                    onClick={() => toggleBookmark(opportunity.id)}
                    aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark opportunity'}
                  >
                    ★
                  </button>
                </div>

                <p className="card-description">{opportunity.description}</p>
                <div className="meta-row">
                  <span>{opportunity.location}</span>
                  <span>{formatRelativeDeadline(opportunity.deadline)}</span>
                </div>
                <div className="tag-row">
                  {opportunity.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="card-actions">
                  <button
                    className={`reminder-button ${hasReminder ? 'active' : ''}`}
                    onClick={() => toggleReminder(opportunity.id)}
                  >
                    {hasReminder ? 'Reminder on' : 'Set reminder'}
                  </button>
                  <a href={opportunity.link} target="_blank" rel="noreferrer" className="apply-link">
                    View details
                  </a>
                </div>
                <p className="reminder-text">{buildReminderMessage(opportunity)}</p>
              </article>
            );
          })}
          {filtered.length === 0 && (
            <div className="empty-state">
              <p>No opportunities match your filters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
