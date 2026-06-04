import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import Tracker from './components/Tracker';

export type OpportunityCategory = 'Internship' | 'Fellowship' | 'Hackathon' | 'Open Source';

type StudentYear = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';

type UserProfile = {
  skills: string[];
  experience: string;
  interests: string[];
};

type Opportunity = {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  deadline: string;
  location: string[];
  tags: string[];
  link: string;
  description: string;
  isPaid: boolean;
  studentYears: StudentYear[];
  technologies: string[];
};

const sampleOpportunities: Opportunity[] = [
  {
    id: 'intern-1',
    title: 'Software Engineering Internship',
    organization: 'TechLeap Labs',
    category: 'Internship',
    deadline: '2026-06-18',
    location: ['Remote'],
    tags: ['Full-time', 'Remote', 'Paid'],
    link: 'https://example.com/techleap-internship',
    description: 'Build real products with an early-stage engineering team.',
    isPaid: true,
    studentYears: ['Junior', 'Senior'],
    technologies: ['JavaScript', 'React', 'Node.js'],
  },
  {
    id: 'fellowship-1',
    title: 'Data Fellowship Program',
    organization: 'Impact Data Collective',
    category: 'Fellowship',
    deadline: '2026-06-25',
    location: ['San Francisco', 'Remote'],
    tags: ['Part-time', 'Mentorship', 'Stipend'],
    link: 'https://example.com/data-fellowship',
    description: 'Work on data-driven impact projects with expert coaching.',
    isPaid: true,
    studentYears: ['Junior', 'Senior'],
    technologies: ['Python', 'SQL', 'Data Analysis'],
  },
  {
    id: 'hackathon-1',
    title: 'AI For Good Hackathon',
    organization: 'DevSprint',
    category: 'Hackathon',
    deadline: '2026-06-12',
    location: ['Online'],
    tags: ['24h', 'Teams', 'Prizes'],
    link: 'https://example.com/ai-good-hackathon',
    description: 'Build AI solutions for sustainability and social impact.',
    isPaid: false,
    studentYears: ['Sophomore', 'Junior', 'Senior'],
    technologies: ['Python', 'TensorFlow', 'Machine Learning'],
  },
  {
    id: 'oss-1',
    title: 'Open Source Contributor Camp',
    organization: 'Global OSS',
    category: 'Open Source',
    deadline: '2026-07-05',
    location: ['Remote'],
    tags: ['Mentored', 'Community', 'Issues'],
    link: 'https://example.com/oss-camp',
    description: 'Contribute to open-source projects and earn official recognition.',
    isPaid: false,
    studentYears: ['Freshman', 'Sophomore', 'Junior', 'Senior'],
    technologies: ['JavaScript', 'Python', 'Go'],
  },
  {
    id: 'intern-2',
    title: 'Product Design Internship',
    organization: 'Design Pulse',
    category: 'Internship',
    deadline: '2026-06-30',
    location: ['New York'],
    tags: ['Paid', 'Portfolio', 'Team'],
    link: 'https://example.com/design-internship',
    description: 'Shape product experiences with a user-first design team.',
    isPaid: true,
    studentYears: ['Sophomore', 'Junior', 'Senior'],
    technologies: ['Figma', 'UI/UX', 'Design Systems'],
  },
  {
    id: 'fellowship-2',
    title: 'Cybersecurity Fellowship',
    organization: 'SecureFuture',
    category: 'Fellowship',
    deadline: '2026-06-20',
    location: ['Remote'],
    tags: ['Training', 'Certification', 'Network'],
    link: 'https://example.com/cyber-fellowship',
    description: 'Join a cohort focused on security research and operations.',
    isPaid: true,
    studentYears: ['Junior', 'Senior'],
    technologies: ['Security', 'Linux', 'Network'],
  },
  {
    id: 'hackathon-2',
    title: 'Blockchain Buildathon',
    organization: 'ChainWorks',
    category: 'Hackathon',
    deadline: '2026-07-10',
    location: ['Online'],
    tags: ['Web3', 'Team', 'Innovation'],
    link: 'https://example.com/blockchain-hackathon',
    description: 'Create decentralized applications and win mentoring sessions.',
    isPaid: false,
    studentYears: ['Sophomore', 'Junior', 'Senior'],
    technologies: ['Solidity', 'Web3.js', 'Blockchain'],
  },
  {
    id: 'oss-2',
    title: 'Open Source Mentorship',
    organization: 'CodeBridge',
    category: 'Open Source',
    deadline: '2026-06-22',
    location: ['Remote'],
    tags: ['Mentorship', 'Beginner-friendly', 'Community'],
    link: 'https://example.com/oss-mentorship',
    description: 'Get guided contributions to a popular open-source codebase.',
    isPaid: false,
    studentYears: ['Freshman', 'Sophomore'],
    technologies: ['JavaScript', 'React', 'Open Source'],
  },
];

const categories: OpportunityCategory[] = ['Internship', 'Fellowship', 'Hackathon', 'Open Source'];
const studentYears: StudentYear[] = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
const allTechnologies = [
  'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Data Analysis',
  'TensorFlow', 'Machine Learning', 'Go', 'Figma', 'UI/UX', 'Design Systems',
  'Security', 'Linux', 'Network', 'Solidity', 'Web3.js', 'Blockchain',
  'Open Source',
];
const allLocations = ['Remote', 'San Francisco', 'New York', 'Online'];

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

function calculateMatchScore(opportunity: Opportunity, userProfile: UserProfile): number {
  if (userProfile.skills.length === 0 && userProfile.interests.length === 0) {
    return 0;
  }

  let score = 0;
  let maxScore = 0;

  // Skills matching (50% weight)
  if (userProfile.skills.length > 0) {
    const skillMatches = userProfile.skills.filter((skill) =>
      opportunity.technologies.some((tech) => tech.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(tech.toLowerCase()))
    ).length;
    score += (skillMatches / userProfile.skills.length) * 50;
    maxScore += 50;
  }

  // Interests/Category matching (30% weight)
  if (userProfile.interests.length > 0) {
    const categoryMatch = userProfile.interests.some(
      (interest) =>
        interest.toLowerCase().includes(opportunity.category.toLowerCase()) ||
        opportunity.category.toLowerCase().includes(interest.toLowerCase())
    ) ? 1 : 0;
    score += categoryMatch * 15;
    maxScore += 30;

    const tagMatches = userProfile.interests.filter((interest) =>
      opportunity.tags.some((tag) => tag.toLowerCase().includes(interest.toLowerCase()) || interest.toLowerCase().includes(tag.toLowerCase()))
    ).length;
    score += (tagMatches / Math.max(userProfile.interests.length, 1)) * 15;
  }

  // Student year matching (20% weight)
  if (userProfile.experience === 'Freshman' || userProfile.experience === 'Sophomore' || userProfile.experience === 'Junior' || userProfile.experience === 'Senior') {
    const yearMatch = opportunity.studentYears.includes(userProfile.experience as StudentYear) ? 1 : 0;
    score += yearMatch * 20;
    maxScore += 20;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function getDeadlineStatus(deadline: string): 'expired' | 'closing-soon' | 'open' {
  const days = getDaysUntil(deadline);
  if (days < 0) return 'expired';
  if (days <= 3) return 'closing-soon';
  return 'open';
}

function App() {
  const [view, setView] = useState<'feed' | 'dashboard' | 'tracker'>('feed');
  const TRACKER_STORAGE = 'careerPilotApplications';
  const [trackerState, setTrackerState] = useState<Record<string, string>>(() => {
    try {
      const raw = localStorage.getItem(TRACKER_STORAGE);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(TRACKER_STORAGE, JSON.stringify(trackerState));
    } catch {}
  }, [trackerState]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<OpportunityCategory | 'All'>('All');
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);
  const [showRemoteOnly, setShowRemoteOnly] = useState(false);
  const [showPaidOnly, setShowPaidOnly] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedStudentYears, setSelectedStudentYears] = useState<StudentYear[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [userProfile, setUserProfile] = useState<UserProfile>({ skills: [], experience: '', interests: [] });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileInput, setProfileInput] = useState({ skills: '', experience: '', interests: '' });

  useEffect(() => {
    const savedBookmarks = localStorage.getItem(STORAGE_KEYS.bookmarks);
    const savedReminders = localStorage.getItem(STORAGE_KEYS.reminders);
    const savedProfile = localStorage.getItem('careerPilotUserProfile');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders));
    }
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.reminders, JSON.stringify(reminders));
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem('careerPilotUserProfile', JSON.stringify(userProfile));
  }, [userProfile]);

  const handleSaveProfile = () => {
    const skills = profileInput.skills.split(',').map(s => s.trim()).filter(s => s);
    const interests = profileInput.interests.split(',').map(i => i.trim()).filter(i => i);
    setUserProfile({ skills, experience: profileInput.experience, interests });
    setShowProfileModal(false);
  };

  const filtered = useMemo(() => {
    return sampleOpportunities.filter((opportunity) => {
      const matchesSearch = [opportunity.title, opportunity.organization, ...opportunity.tags]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || opportunity.category === categoryFilter;
      const matchesBookmark = !showBookmarkedOnly || bookmarks.includes(opportunity.id);
      const matchesRemote = !showRemoteOnly || opportunity.location.some(loc => loc.toLowerCase().includes('remote'));
      const matchesPaid = !showPaidOnly || opportunity.isPaid;
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.some(loc => opportunity.location.includes(loc));
      const matchesStudentYear = selectedStudentYears.length === 0 || selectedStudentYears.some(year => opportunity.studentYears.includes(year));
      const matchesTechnology = selectedTechnologies.length === 0 || selectedTechnologies.some(tech => opportunity.technologies.includes(tech));
      return matchesSearch && matchesCategory && matchesBookmark && matchesRemote && matchesPaid && matchesLocation && matchesStudentYear && matchesTechnology;
    });
  }, [search, categoryFilter, showBookmarkedOnly, showRemoteOnly, showPaidOnly, selectedLocations, selectedStudentYears, selectedTechnologies, bookmarks]);

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

      <div className="profile-section">
        <button className="profile-button" onClick={() => { setShowProfileModal(!showProfileModal); setProfileInput({ skills: userProfile.skills.join(', '), experience: userProfile.experience, interests: userProfile.interests.join(', ') }); }}>
          {userProfile.skills.length > 0 ? '✓ Profile Set' : '+ Add Profile'}
        </button>
      </div>

      <div className="view-tabs" style={{ marginBottom: 20 }}>
        <button className={`tab-btn ${view === 'feed' ? 'active' : ''}`} onClick={() => setView('feed')}>Feed</button>
        <button className={`tab-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>Dashboard</button>
        <button className={`tab-btn ${view === 'tracker' ? 'active' : ''}`} onClick={() => setView('tracker')}>Tracker</button>
      </div>

      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Your Profile</h2>
            <div className="modal-form">
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input
                  type="text"
                  value={profileInput.skills}
                  onChange={(e) => setProfileInput({ ...profileInput, skills: e.target.value })}
                  placeholder="e.g., JavaScript, React, Python"
                />
              </div>
              <div className="form-group">
                <label>Student Year</label>
                <select value={profileInput.experience} onChange={(e) => setProfileInput({ ...profileInput, experience: e.target.value })}>
                  <option value="">Select...</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div className="form-group">
                <label>Interests (comma-separated)</label>
                <input
                  type="text"
                  value={profileInput.interests}
                  onChange={(e) => setProfileInput({ ...profileInput, interests: e.target.value })}
                  placeholder="e.g., AI, Web Development, Startups"
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowProfileModal(false)}>Cancel</button>
                <button className="save-btn" onClick={handleSaveProfile}>Save Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section className="controls">
        <div className="search-box">
          <label htmlFor="search">Search opportunities</label>
          <input
            id="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by company, program, skills..."
          />
        </div>

        <div className="filters-container">
          <div className="filter-section">
            <h3 className="filter-title">Category</h3>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={categoryFilter === 'All'}
                  onChange={() => setCategoryFilter('All')}
                />
                All
              </label>
              {categories.map((category) => (
                <label key={category} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={categoryFilter === category}
                    onChange={() => setCategoryFilter(category)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Quick Filters</h3>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={showRemoteOnly}
                  onChange={() => setShowRemoteOnly((value) => !value)}
                />
                Remote only
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={showPaidOnly}
                  onChange={() => setShowPaidOnly((value) => !value)}
                />
                Paid only
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={showBookmarkedOnly}
                  onChange={() => setShowBookmarkedOnly((value) => !value)}
                />
                Bookmarked only
              </label>
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Location</h3>
            <div className="checkbox-group">
              {allLocations.map((loc) => (
                <label key={loc} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => {
                      if (selectedLocations.includes(loc)) {
                        setSelectedLocations(selectedLocations.filter(l => l !== loc));
                      } else {
                        setSelectedLocations([...selectedLocations, loc]);
                      }
                    }}
                  />
                  {loc}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Student Year</h3>
            <div className="checkbox-group">
              {studentYears.map((year) => (
                <label key={year} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedStudentYears.includes(year)}
                    onChange={() => {
                      if (selectedStudentYears.includes(year)) {
                        setSelectedStudentYears(selectedStudentYears.filter(y => y !== year));
                      } else {
                        setSelectedStudentYears([...selectedStudentYears, year]);
                      }
                    }}
                  />
                  {year}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3 className="filter-title">Technology Stack</h3>
            <div className="checkbox-group">
              {allTechnologies.map((tech) => (
                <label key={tech} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedTechnologies.includes(tech)}
                    onChange={() => {
                      if (selectedTechnologies.includes(tech)) {
                        setSelectedTechnologies(selectedTechnologies.filter(t => t !== tech));
                      } else {
                        setSelectedTechnologies([...selectedTechnologies, tech]);
                      }
                    }}
                  />
                  {tech}
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {view === 'feed' && (
        <main>
          <h2 className="section-title">Opportunities</h2>
          <div className="grid">
            {filtered.map((opportunity) => {
            const isBookmarked = bookmarks.includes(opportunity.id);
            const hasReminder = Boolean(reminders[opportunity.id]);
            const matchScore = calculateMatchScore(opportunity, userProfile);
            const deadlineStatus = getDeadlineStatus(opportunity.deadline);
            const daysLeft = getDaysUntil(opportunity.deadline);
            return (
              <article key={opportunity.id} className={`card ${deadlineStatus}`}>
                <div className="card-header">
                  <div>
                    <div className="card-badges">
                      <p className="category-pill">{opportunity.category}</p>
                      {deadlineStatus === 'closing-soon' && (
                        <span className="deadline-badge closing-soon">Closing soon</span>
                      )}
                      {deadlineStatus === 'expired' && (
                        <span className="deadline-badge expired">Expired</span>
                      )}
                      {matchScore > 0 && (
                        <span className="match-badge">{matchScore}% Match</span>
                      )}
                    </div>
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
                  <span>{opportunity.location.join(', ')}</span>
                  <span className={`days-left ${deadlineStatus}`}>{daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}</span>
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
      )}

      {view === 'dashboard' && (
        <Dashboard
          opportunities={sampleOpportunities}
          bookmarks={bookmarks}
          reminders={reminders}
          userProfile={userProfile}
          calculateMatchScore={calculateMatchScore}
          getDaysUntil={getDaysUntil}
          formatRelativeDeadline={formatRelativeDeadline}
          trackerState={trackerState}
          onOpenTracker={() => setView('tracker')}
        />
      )}

      {view === 'tracker' && (
        <Tracker opportunities={sampleOpportunities} trackerState={trackerState} setTrackerState={setTrackerState} />
      )}
    </div>
  );
}

export default App;
