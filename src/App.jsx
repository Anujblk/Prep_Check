import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'prepwise.questions.v1';
const MACHINE_KEY = 'prepwise.machineStatus.v1';
const WEEKLY_GOAL_KEY = 'prepwise.weeklyGoal.v1';

const starterQuestions = [
  { id: 'q-1', title: 'Two Sum', category: 'DSA', difficulty: 'Easy', status: 'Completed', notes: 'Hash map approach and time complexity.', createdAt: daysAgo(2), completedAt: daysAgo(2) },
  { id: 'q-2', title: 'Remove Duplicates from Sorted Array', category: 'DSA', difficulty: 'Easy', status: 'Completed', notes: 'Two-pointer technique, in-place updates.', createdAt: daysAgo(1), completedAt: daysAgo(1) },
  { id: 'q-3', title: 'Rotate Array', category: 'DSA', difficulty: 'Medium', status: 'In Progress', notes: 'Understand reverse-based rotation.', createdAt: daysAgo(1), completedAt: null },
  { id: 'q-4', title: 'Explain the JavaScript event loop', category: 'Technical', difficulty: 'Medium', status: 'Completed', notes: 'Microtasks, tasks, Promise callbacks.', createdAt: daysAgo(3), completedAt: daysAgo(3) },
  { id: 'q-5', title: 'Authentication vs authorization', category: 'Technical', difficulty: 'Medium', status: 'In Progress', notes: 'Use a protected Express route example.', createdAt: daysAgo(0), completedAt: null },
  { id: 'q-6', title: 'Recover a lost commit with reflog', category: 'Git', difficulty: 'Medium', status: 'Pending', notes: '', createdAt: daysAgo(0), completedAt: null },
  { id: 'q-7', title: 'MongoDB unique indexes and race conditions', category: 'Technical', difficulty: 'Hard', status: 'Pending', notes: '', createdAt: daysAgo(0), completedAt: null },
];

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function getWeekStart(date = new Date()) {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

function isThisWeek(value) {
  if (!value) return false;
  const date = new Date(value);
  const start = getWeekStart();
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return date >= start && date < end;
}

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></>,
    code: <><polyline points="8 17 3 12 8 7"/><polyline points="16 7 21 12 16 17"/><line x1="14" y1="4" x2="10" y2="20"/></>,
    git: <><circle cx="6" cy="4" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="6" cy="20" r="2"/><path d="M6 6v12a2 2 0 0 0 2 2h8"/><path d="M6 10c0 5 12 1 12 6v0"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18M10 12v2h4v-2"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    down: <path d="m7 10 5 5 5-5"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    flame: <><path d="M12 22c4.2 0 7-3.1 7-7.1 0-3-1.7-4.7-3.2-6.2-.3 2-1.5 2.8-2.2 3.1C14.3 7 11.5 3.8 9 2c.4 4.4-3.5 7-3.5 12.7C5.5 18.8 8.1 22 12 22Z"/><path d="M12 22c-2 0-3.1-1.6-3.1-3.5 0-1.4.9-2.7 2.1-4 .2 1.2 1 2 1.8 2.4 1.2 1.8.6 5.1-.8 5.1Z"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    filter: <><path d="M4 5h16M7 12h10M10 19h4"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 10v7M14 10v7"/></>,
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z"/><path d="m19 14 1.1 2.4L22 17l-1.9.9L19 20l-1-2.1-2-.9 2-.6L19 14Z"/></>,
    book: <><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 4.5v17M8 6h8M8 10h7"/></>,
    x: <><path d="m18 6-12 12M6 6l12 12"/></>,
    circle: <circle cx="12" cy="12" r="9"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.circle}</svg>;
}

function dateLabel(date = new Date()) {
  return new Intl.DateTimeFormat('en', { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
}

function formatDate(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(new Date(value));
}

function getInitials(title) {
  return title.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0].toUpperCase()).join('');
}

const categories = ['All categories', 'DSA', 'Git', 'Technical'];
const statuses = ['All statuses', 'Pending', 'In Progress', 'Completed'];
const difficulties = ['All difficulties', 'Easy', 'Medium', 'Hard'];
const questionStatuses = ['Pending', 'In Progress', 'Completed'];

export default function App() {
  const [questions, setQuestions] = useState(() => readStorage(STORAGE_KEY, null) ?? starterQuestions);
  const [machineStatus, setMachineStatus] = useState(() => readStorage(MACHINE_KEY, 'Not started'));
  const [weeklyGoal, setWeeklyGoal] = useState(() => readStorage(WEEKLY_GOAL_KEY, 5));
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [difficultyFilter, setDifficultyFilter] = useState('All difficulties');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ title: '', category: 'DSA', difficulty: 'Easy', status: 'Pending', notes: '' });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(questions)), [questions]);
  useEffect(() => localStorage.setItem(MACHINE_KEY, JSON.stringify(machineStatus)), [machineStatus]);
  useEffect(() => localStorage.setItem(WEEKLY_GOAL_KEY, JSON.stringify(weeklyGoal)), [weeklyGoal]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const completed = questions.filter(q => q.status === 'Completed').length;
  const dsaCompleted = questions.filter(q => q.category === 'DSA' && q.status === 'Completed').length;
  const interviewCompleted = questions.filter(q => ['Git', 'Technical'].includes(q.category) && q.status === 'Completed').length;
  const progress = questions.length ? Math.round((completed / questions.length) * 100) : 0;
  const weeklyCompleted = questions.filter(q => q.status === 'Completed' && isThisWeek(q.completedAt)).length;
  const weeklyProgress = Math.min(100, Math.round((weeklyCompleted / Math.max(1, Number(weeklyGoal))) * 100));
  const inProgressCount = questions.filter(q => q.status === 'In Progress').length;
  const pendingCount = questions.filter(q => q.status === 'Pending').length;

  const filteredQuestions = useMemo(() => {
    const term = query.trim().toLowerCase();
    return questions.filter(question => {
      const matchesText = !term || [question.title, question.notes, question.category].some(value => (value || '').toLowerCase().includes(term));
      const matchesCategory = categoryFilter === 'All categories' || question.category === categoryFilter;
      const matchesStatus = statusFilter === 'All statuses' || question.status === statusFilter;
      const matchesDifficulty = difficultyFilter === 'All difficulties' || question.difficulty === difficultyFilter;
      return matchesText && matchesCategory && matchesStatus && matchesDifficulty;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [questions, query, categoryFilter, statusFilter, difficultyFilter]);

  const recentActivity = useMemo(() => questions
    .filter(question => question.status === 'Completed' && question.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
    .slice(0, 3), [questions]);

  function openCreate() {
    setEditingId(null);
    setForm({ title: '', category: 'DSA', difficulty: 'Easy', status: 'Pending', notes: '' });
    setShowForm(true);
  }

  function openEdit(question) {
    setEditingId(question.id);
    setForm({ title: question.title, category: question.category, difficulty: question.difficulty, status: question.status, notes: question.notes || '' });
    setShowForm(true);
  }

  function saveQuestion(event) {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return;
    const now = new Date().toISOString();
    if (editingId) {
      setQuestions(previous => previous.map(question => question.id === editingId ? {
        ...question,
        ...form,
        title,
        completedAt: form.status === 'Completed' ? (question.status === 'Completed' ? question.completedAt : now) : null,
      } : question));
      setToast('Question updated');
    } else {
      setQuestions(previous => [{
        id: crypto.randomUUID ? crypto.randomUUID() : `q-${Date.now()}`,
        ...form,
        title,
        createdAt: now,
        completedAt: form.status === 'Completed' ? now : null,
      }, ...previous]);
      setToast('Question added to your tracker');
    }
    setShowForm(false);
  }

  function changeStatus(id, status) {
    const now = new Date().toISOString();
    setQuestions(previous => previous.map(question => question.id === id ? {
      ...question,
      status,
      completedAt: status === 'Completed' ? (question.status === 'Completed' ? question.completedAt : now) : null,
    } : question));
    setToast(status === 'Completed' ? 'Nice work — marked complete' : 'Status updated');
  }

  function deleteQuestion(id) {
    setQuestions(previous => previous.filter(question => question.id !== id));
    setToast('Question removed');
  }

  function clearFilters() {
    setQuery('');
    setCategoryFilter('All categories');
    setStatusFilter('All statuses');
    setDifficultyFilter('All difficulties');
  }

  const hasFilters = query || categoryFilter !== 'All categories' || statusFilter !== 'All statuses' || difficultyFilter !== 'All difficulties';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Icon name="spark" size={21} /></div>
          <div><div className="brand-name">prepwise<span>.</span></div><div className="brand-caption">YOUR PREP, IN FOCUS</div></div>
        </div>
        <div className="side-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <a className="nav-item active" href="#overview"><Icon name="grid" size={19} /><span>Overview</span><span className="nav-dot" /></a>
          <a className="nav-item" href="#question-tracker"><Icon name="book" size={19} /><span>Question tracker</span><span className="nav-count">{questions.length}</span></a>
          <a className="nav-item" href="#weekly-focus"><Icon name="calendar" size={19} /><span>Weekly focus</span></a>
          <a className="nav-item" href="#machine-coding"><Icon name="briefcase" size={19} /><span>Machine coding</span></a>
        </nav>
        <div className="sidebar-bottom">
          <div className="side-promo">
            <div className="promo-spark"><Icon name="target" size={17} /></div>
            <div className="promo-title">Small steps. Big outcomes.</div>
            <p>Consistency compounds. Show up for today's session.</p>
            <div className="promo-line"><span style={{ width: `${weeklyProgress}%` }} /></div>
            <div className="promo-foot"><span>{weeklyCompleted} of {weeklyGoal} this week</span><span>{weeklyProgress}%</span></div>
          </div>
          <div className="profile-row">
            <div className="avatar">AP</div>
            <div className="profile-info"><strong>My workspace</strong><span>Interview preparation</span></div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>Overview</strong></div>
          <div className="topbar-right"><span className="today-date"><Icon name="calendar" size={15} /> {dateLabel()}</span><div className="top-avatar">AP</div></div>
        </header>

        <section className="welcome-row">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR PERSONAL PREP SPACE</div>
            <h1>Build momentum,<br className="desktop-break" /> <em>one question at a time.</em></h1>
            <p>A clear view of what you've learned, what you're working on, and what's next.</p>
          </div>
          <button className="primary-button" onClick={openCreate}><Icon name="plus" size={18} /> Add a question</button>
        </section>

        <section className="metrics-grid" aria-label="Preparation metrics">
          <article className="metric-card metric-total">
            <div className="metric-top"><span className="metric-icon"><Icon name="book" /></span><span className="metric-tag">ALL TIME</span></div>
            <div className="metric-value">{questions.length.toString().padStart(2, '0')}</div>
            <div className="metric-label">Total questions</div>
            <div className="metric-foot"><span className="tiny-bar"><i style={{ width: `${questions.length ? 100 : 0}%` }} /></span><span>In your library</span></div>
          </article>
          <article className="metric-card metric-dsa">
            <div className="metric-top"><span className="metric-icon"><Icon name="code" /></span><span className="metric-tag tag-green">DSA</span></div>
            <div className="metric-value">{dsaCompleted.toString().padStart(2, '0')}<span className="metric-denom"> / {questions.filter(q => q.category === 'DSA').length.toString().padStart(2, '0')}</span></div>
            <div className="metric-label">DSA problems completed</div>
            <div className="metric-foot"><span>{questions.filter(q => q.category === 'DSA').length ? Math.round(dsaCompleted / questions.filter(q => q.category === 'DSA').length * 100) : 0}% complete</span><span className="mini-arrow"><Icon name="arrow" size={15} /></span></div>
          </article>
          <article className="metric-card metric-interview">
            <div className="metric-top"><span className="metric-icon"><Icon name="target" /></span><span className="metric-tag tag-purple">GIT + TECH</span></div>
            <div className="metric-value">{interviewCompleted.toString().padStart(2, '0')}<span className="metric-denom"> / {questions.filter(q => ['Git', 'Technical'].includes(q.category)).length.toString().padStart(2, '0')}</span></div>
            <div className="metric-label">Interview questions completed</div>
            <div className="metric-foot"><span>{questions.filter(q => ['Git', 'Technical'].includes(q.category)).length ? Math.round(interviewCompleted / questions.filter(q => ['Git', 'Technical'].includes(q.category)).length * 100) : 0}% complete</span><span className="mini-arrow"><Icon name="arrow" size={15} /></span></div>
          </article>
          <article className="metric-card metric-machine" id="machine-coding">
            <div className="metric-top"><span className="metric-icon"><Icon name="briefcase" /></span><span className="metric-tag tag-amber">PRACTICAL</span></div>
            <div className="metric-label machine-label">Machine coding</div>
            <select className="machine-select" value={machineStatus} onChange={event => setMachineStatus(event.target.value)} aria-label="Machine coding status">
              <option>Not started</option><option>In progress</option><option>Completed</option>
            </select>
            <div className="metric-foot"><span className={`status-pip ${machineStatus === 'Completed' ? 'done' : machineStatus === 'In progress' ? 'doing' : ''}`} /> <span>{machineStatus === 'Completed' ? 'Ready for the next challenge' : machineStatus === 'In progress' ? 'Keep building and testing' : 'A good task for your next session'}</span></div>
          </article>
        </section>

        <section className="overview-grid">
          <article className="panel progress-panel" id="weekly-focus">
            <div className="panel-heading"><div><div className="section-kicker">THE BIG PICTURE</div><h2>Your progress</h2></div><span className="heading-icon"><Icon name="target" /></span></div>
            <div className="progress-content">
              <div className="progress-ring-wrap">
                <svg className="progress-ring" viewBox="0 0 140 140" role="img" aria-label={`${progress}% of questions completed`}>
                  <circle className="ring-track" cx="70" cy="70" r="57" />
                  <circle className="ring-value" cx="70" cy="70" r="57" style={{ strokeDasharray: `${progress * 3.581} 358.1` }} />
                </svg>
                <div className="ring-center"><strong>{progress}<small>%</small></strong><span>completed</span></div>
              </div>
              <div className="progress-breakdown">
                <p className="progress-intro">You're turning preparation into progress. Keep the rhythm going.</p>
                <div className="breakdown-row"><span className="breakdown-dot completed-dot" /><div className="breakdown-name"><strong>Completed</strong><span>Ready to recall</span></div><strong className="breakdown-count">{completed}</strong></div>
                <div className="breakdown-row"><span className="breakdown-dot progress-dot" /><div className="breakdown-name"><strong>In progress</strong><span>Currently learning</span></div><strong className="breakdown-count">{inProgressCount}</strong></div>
                <div className="breakdown-row"><span className="breakdown-dot pending-dot" /><div className="breakdown-name"><strong>Pending</strong><span>Up next</span></div><strong className="breakdown-count">{pendingCount}</strong></div>
              </div>
            </div>
            <div className="panel-bottom-note"><Icon name="spark" size={16} /><span>Progress is calculated from the questions saved in your tracker.</span></div>
          </article>

          <article className="panel weekly-panel">
            <div className="panel-heading"><div><div className="section-kicker">STAY CONSISTENT</div><h2>This week</h2></div><span className="week-pill"><Icon name="calendar" size={14} /> Mon – Sun</span></div>
            <div className="weekly-score"><div><strong>{weeklyCompleted}</strong><span> / {weeklyGoal} questions completed</span></div><span className="weekly-percent">{weeklyProgress}%</span></div>
            <div className="weekly-bar"><span style={{ width: `${weeklyProgress}%` }} /></div>
            <div className="weekly-motivation">{weeklyCompleted >= weeklyGoal ? 'Goal achieved. Take a moment to celebrate.' : `${Math.max(0, Number(weeklyGoal) - weeklyCompleted)} more to hit your weekly target.`}</div>
            <div className="goal-control"><label htmlFor="weekly-goal">Weekly goal</label><div className="stepper"><button onClick={() => setWeeklyGoal(Math.max(1, Number(weeklyGoal) - 1))} aria-label="Decrease weekly goal">−</button><strong>{weeklyGoal}</strong><button onClick={() => setWeeklyGoal(Math.min(50, Number(weeklyGoal) + 1))} aria-label="Increase weekly goal">+</button></div></div>
            <div className="weekly-divider" />
            <div className="activity-heading"><strong>Recently completed</strong><span>{recentActivity.length} latest</span></div>
            {recentActivity.length ? <div className="activity-list">{recentActivity.map(question => <div className="activity-item" key={question.id}><span className="activity-check"><Icon name="check" size={14} /></span><div className="activity-info"><strong>{question.title}</strong><span>{question.category} · {formatDate(question.completedAt)}</span></div></div>)}</div> : <div className="empty-activity">Complete a question and it will show up here.</div>}
          </article>
        </section>

        <section className="panel tracker-panel" id="question-tracker">
          <div className="tracker-heading">
            <div><div className="section-kicker">YOUR LEARNING LIBRARY</div><h2>Question tracker <span className="count-pill">{questions.length}</span></h2><p>Keep every concept, problem, and practice question moving forward.</p></div>
            <button className="secondary-button" onClick={openCreate}><Icon name="plus" size={17} /> New question</button>
          </div>
          <div className="filter-toolbar">
            <div className="search-box"><Icon name="search" size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search questions or notes..." aria-label="Search questions" /></div>
            <div className="filter-selects"><label className="select-wrap"><span className="sr-only">Category</span><select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)}>{categories.map(value => <option key={value}>{value}</option>)}</select><Icon name="down" size={14} /></label><label className="select-wrap"><span className="sr-only">Status</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}>{statuses.map(value => <option key={value}>{value}</option>)}</select><Icon name="down" size={14} /></label><label className="select-wrap"><span className="sr-only">Difficulty</span><select value={difficultyFilter} onChange={event => setDifficultyFilter(event.target.value)}>{difficulties.map(value => <option key={value}>{value}</option>)}</select><Icon name="down" size={14} /></label></div>
          </div>
          {hasFilters && <div className="filter-status"><span><Icon name="filter" size={14} /> Showing {filteredQuestions.length} of {questions.length} questions</span><button onClick={clearFilters}>Clear filters <Icon name="x" size={13} /></button></div>}
          <div className="table-wrap">
            <table className="question-table">
              <thead><tr><th>QUESTION</th><th>CATEGORY</th><th>DIFFICULTY</th><th>STATUS</th><th>ADDED</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {filteredQuestions.map(question => <tr key={question.id}>
                  <td><button className="question-title-button" onClick={() => openEdit(question)}><span className={`question-initial initial-${question.category.toLowerCase()}`}>{getInitials(question.title)}</span><span className="question-title-text"><strong>{question.title}</strong>{question.notes && <small>{question.notes}</small>}</span></button></td>
                  <td><span className={`category-pill category-${question.category.toLowerCase()}`}>{question.category}</span></td>
                  <td><span className={`difficulty difficulty-${question.difficulty.toLowerCase()}`}><i />{question.difficulty}</span></td>
                  <td><label className={`status-select status-${question.status.toLowerCase().replace(' ', '-')}`}><select value={question.status} onChange={event => changeStatus(question.id, event.target.value)} aria-label={`Status for ${question.title}`}>{questionStatuses.map(status => <option key={status}>{status}</option>)}</select><Icon name="down" size={12} /></label></td>
                  <td><span className="date-cell">{formatDate(question.createdAt)}</span></td>
                  <td><div className="row-actions"><button className="icon-button edit-action" onClick={() => openEdit(question)} aria-label={`Edit ${question.title}`} title="Edit question"><Icon name="chevron" size={16} /></button><button className="icon-button delete-action" onClick={() => deleteQuestion(question.id)} aria-label={`Delete ${question.title}`} title="Delete question"><Icon name="trash" size={15} /></button></div></td>
                </tr>)}
              </tbody>
            </table>
            {filteredQuestions.length === 0 && <div className="empty-state"><div className="empty-icon"><Icon name="search" size={23} /></div><strong>{questions.length ? 'No questions match these filters' : 'Your tracker is a blank canvas'}</strong><p>{questions.length ? 'Try a different search or clear your filters.' : 'Add your first question and start building momentum.'}</p><div className="empty-actions">{hasFilters && <button className="secondary-button" onClick={clearFilters}>Clear filters</button>}<button className="primary-button" onClick={openCreate}><Icon name="plus" size={17} /> Add a question</button></div></div>}
          </div>
          <div className="table-footer"><span>Showing <strong>{filteredQuestions.length}</strong> of <strong>{questions.length}</strong> questions</span><span className="footer-tip"><Icon name="spark" size={14} /> Tip: click a question to edit its details.</span></div>
        </section>
        <footer className="app-footer"><span>Made for focused practice <span className="footer-heart">✳</span></span><span>Prepwise · Your progress, your pace.</span></footer>
      </main>

      {showForm && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setShowForm(false); }}>
        <section className="question-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-header"><div><div className="section-kicker">LEARNING LIBRARY</div><h2 id="modal-title">{editingId ? 'Edit question' : 'Add a question'}</h2><p>Capture what you're learning, one item at a time.</p></div><button className="modal-close" onClick={() => setShowForm(false)} aria-label="Close dialog"><Icon name="x" /></button></div>
          <form onSubmit={saveQuestion} className="question-form">
            <label className="form-field full-field"><span>Question title <b>*</b></span><input autoFocus required maxLength={120} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="e.g. Explain closures in JavaScript" /></label>
            <div className="form-row"><label className="form-field"><span>Category</span><select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}><option>DSA</option><option>Git</option><option>Technical</option></select></label><label className="form-field"><span>Difficulty</span><select value={form.difficulty} onChange={event => setForm({ ...form, difficulty: event.target.value })}><option>Easy</option><option>Medium</option><option>Hard</option></select></label></div>
            <label className="form-field full-field"><span>Status</span><select value={form.status} onChange={event => setForm({ ...form, status: event.target.value })}><option>Pending</option><option>In Progress</option><option>Completed</option></select></label>
            <label className="form-field full-field"><span>Notes <small>(optional)</small></span><textarea rows="3" maxLength={500} value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} placeholder="Add a reminder, approach, or concept to revisit..." /></label>
            <div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="primary-button"><Icon name={editingId ? 'check' : 'plus'} size={17} /> {editingId ? 'Save changes' : 'Add question'}</button></div>
          </form>
        </section>
      </div>}
      {toast && <div className="toast" role="status"><span><Icon name="check" size={17} /></span>{toast}</div>}
    </div>
  );
}
