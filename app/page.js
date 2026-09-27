'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// ⚠️ 아래 값을 본인 이름으로 바꿔서 제출하세요.
const MAKER_NAME = '희현';

// 운영자 비밀번호: 마감시간 변경 / 결과 초기화 시 필요합니다.
const ADMIN_PASSWORD = 'qwer1234';

const DEFAULT_OPTIONS = [
  { id: 'a', label: '치킨' },
  { id: 'b', label: '피자' },
  { id: 'c', label: '떡볶이' },
  { id: 'd', label: '족발' },
];

const STORAGE_KEY = 'vote-app-state-v1';
const COLORS = ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#fb7185'];

function loadState() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // ignore write errors (e.g. private mode)
  }
}

function defaultDeadline() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(23, 59, 0, 0);
  // datetime-local input expects 'YYYY-MM-DDTHH:mm'
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function Page() {
  const [question] = useState('오늘 저녁 뭐 먹을까?');
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [votes, setVotes] = useState([]); // { name, optionId, ts }
  const [deadline, setDeadline] = useState(defaultDeadline());
  const [name, setName] = useState('');
  const [selected, setSelected] = useState(null);
  const [now, setNow] = useState(new Date());
  const [hydrated, setHydrated] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const unlockAdmin = () => {
    if (adminUnlocked) return true;
    const input = window.prompt('운영자 비밀번호를 입력하세요');
    if (input === null) return false;
    if (input === ADMIN_PASSWORD) {
      setAdminUnlocked(true);
      return true;
    }
    window.alert('비밀번호가 올바르지 않습니다.');
    return false;
  };

  // 저장된 상태 불러오기
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      if (saved.options) setOptions(saved.options);
      if (saved.votes) setVotes(saved.votes);
      if (saved.deadline) setDeadline(saved.deadline);
      if (saved.name) setName(saved.name);
    }
    setHydrated(true);
  }, []);

  // 상태 변경 시 저장
  useEffect(() => {
    if (!hydrated) return;
    saveState({ options, votes, deadline, name });
  }, [options, votes, deadline, name, hydrated]);

  // 1초마다 현재 시각 갱신 (마감 카운트다운용)
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const deadlineDate = useMemo(() => new Date(deadline), [deadline]);
  const isClosed = now.getTime() >= deadlineDate.getTime();

  const remaining = useMemo(() => {
    const diff = deadlineDate.getTime() - now.getTime();
    if (diff <= 0) return null;
    const s = Math.floor(diff / 1000);
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (days > 0) return `${days}일 ${hours}시간 ${mins}분 남음`;
    if (hours > 0) return `${hours}시간 ${mins}분 ${secs}초 남음`;
    return `${mins}분 ${secs}초 남음`;
  }, [deadlineDate, now]);

  const chartData = useMemo(
    () =>
      options.map((opt) => ({
        label: opt.label,
        votes: votes.filter((v) => v.optionId === opt.id).length,
      })),
    [options, votes]
  );

  const hasVotedAsName = (n) => votes.some((v) => v.name === n.trim());

  const canVote =
    !isClosed && name.trim().length > 0 && selected !== null && !hasVotedAsName(name);

  const submitVote = () => {
    if (!canVote) return;
    setVotes((prev) => [...prev, { name: name.trim(), optionId: selected, ts: Date.now() }]);
    setSelected(null);
  };

  const resetVotes = () => {
    if (!unlockAdmin()) return;
    if (!window.confirm('모든 투표 기록을 초기화할까요?')) return;
    setVotes([]);
  };

  return (
    <div className="wrap">
      <div className="header">
        <h1>🗳️ {question}</h1>
        <div className="maker">만든 사람: {MAKER_NAME}</div>
      </div>

      <div className="card">
        <h2>⏰ 투표 마감 시간</h2>
        <div className="deadline-row">
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            onFocus={(e) => {
              if (!adminUnlocked) {
                e.target.blur();
                unlockAdmin();
              }
            }}
            disabled={isClosed}
          />
          <span className={`status-badge ${isClosed ? 'status-closed' : 'status-open'}`}>
            {isClosed ? '마감됨' : '진행중'}
          </span>
        </div>
        {!isClosed && remaining && <div className="countdown">⏳ {remaining}</div>}
        {!adminUnlocked && (
          <div className="hint">🔒 마감시간을 바꾸려면 클릭 시 운영자 비밀번호가 필요해요.</div>
        )}
      </div>

      <div className="card">
        <h2>✍️ 투표하기</h2>
        <input
          className="name-input"
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isClosed}
        />
        <div className="option-list">
          {options.map((opt) => (
            <button
              key={opt.id}
              className={`option-btn ${selected === opt.id ? 'selected' : ''}`}
              onClick={() => setSelected(opt.id)}
              disabled={isClosed}
            >
              <span>{opt.label}</span>
              {selected === opt.id && <span>✓</span>}
            </button>
          ))}
        </div>
        <button className="vote-btn" onClick={submitVote} disabled={!canVote}>
          {isClosed
            ? '투표가 마감되었습니다'
            : hasVotedAsName(name) && name.trim()
            ? '이미 투표했습니다'
            : '투표하기'}
        </button>
        <div className="hint">동일한 이름으로는 한 번만 투표할 수 있어요.</div>
      </div>

      <div className="card">
        <h2>📊 실시간 투표 결과</h2>
        <div className="total">총 {votes.length}명 참여</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
            <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #334155' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            <Bar dataKey="votes" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={entry.label} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <button className="reset-btn" onClick={resetVotes}>
            결과 초기화
          </button>
        </div>
      </div>

      <div className="footer">Built with Next.js · Claude Code · {MAKER_NAME}</div>
    </div>
  );
}
