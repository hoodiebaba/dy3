import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Globe,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Radio,
  Search,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import CommonActions from '../store/actions/common-actions';

/** Neutral session hint — not live infra telemetry (avoids misleading demo alerts). */
const HEADER_SESSION_STATUS = {
  text: 'Session active',
  dot: 'bg-emerald-400',
  tone: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
};

const timezoneFallbacks = [
  'UTC',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'Australia/Sydney',
  'Pacific/Auckland',
];
const timezoneCodeMap = {
  UTC: 'UTC',
  'Asia/Kolkata': 'IST',
  'Asia/Dubai': 'GST',
  'Asia/Singapore': 'SGT',
  'Asia/Tokyo': 'JST',
  'Europe/London': 'GMT',
  'Europe/Paris': 'CET',
  'Europe/Berlin': 'CET',
  'America/New_York': 'EST',
  'America/Chicago': 'CST',
  'America/Denver': 'MST',
  'America/Los_Angeles': 'PST',
  'America/Toronto': 'EST',
  'Australia/Sydney': 'AEST',
  'Pacific/Auckland': 'NZST',
};
const timezoneNameMap = {
  'Asia/Kolkata': 'IST - India Standard Time',
  UTC: 'Universal Time Coordinated',
  'Asia/Dubai': 'Gulf Standard Time',
  'Asia/Singapore': 'Singapore Standard Time',
  'Asia/Tokyo': 'Japan Standard Time',
  'Europe/London': 'Greenwich Mean Time',
  'Europe/Paris': 'Central European Time',
  'Europe/Berlin': 'Central European Time',
  'America/New_York': 'Eastern Standard Time',
  'America/Chicago': 'Central Standard Time',
  'America/Denver': 'Mountain Standard Time',
  'America/Los_Angeles': 'Pacific Standard Time',
  'America/Toronto': 'Eastern Standard Time',
  'Australia/Sydney': 'Australian Eastern Time',
  'Pacific/Auckland': 'New Zealand Standard Time',
};
const TIMEZONE_STORAGE_KEY = 'dy3-header-timezone';

const formatTimezoneLabel = (value) => value.split('/').map((part) => part.replace(/_/g, ' ')).join(' / ');
const getTimezoneOptions = () => {
  const supported = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : timezoneFallbacks;
  const ordered = [...timezoneFallbacks, ...supported.filter((value) => !timezoneFallbacks.includes(value))];
  return ordered.map((value) => ({
    value,
    name: timezoneNameMap[value] || formatTimezoneLabel(value),
    aliases: value === 'Asia/Kolkata' ? ['india', 'indian', 'kolkata', 'ist', 'asia kolkata'] : [],
    code: timezoneCodeMap[value] || value.split('/').at(-1).replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase(),
  }));
};

const getDynamicTimezoneCode = (timeZone, fallbackCode, currentDate) => {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).formatToParts(currentDate);
    const derived = parts.find((part) => part.type === 'timeZoneName')?.value?.trim();
    if (!derived) return fallbackCode;
    if (timeZone === 'Asia/Kolkata' && derived.startsWith('GMT')) return 'IST';
    return derived;
  } catch (_) {
    return fallbackCode;
  }
};

const normalizeUser = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (_) {
      return null;
    }
  }
  return value;
};

const readLocalUser = () => {
  try {
    return normalizeUser(localStorage.getItem('user')) || {};
  } catch (_) {
    return {};
  }
};

const TopBar = ({ isSidebarOpen, isMobileViewport, onSidebarToggle }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const storedUser = useSelector((state) => state?.auth?.user);
  const [profileVersion, setProfileVersion] = useState(0);
  const user = useMemo(() => normalizeUser(storedUser) || readLocalUser(), [storedUser, profileVersion]);
  const displayName = user?.name || user?.fullName || user?.username || 'DataPlus User';
  const displayRole = String(user?.rolename || user?.title || 'Admin User').toUpperCase();
  const profileImage = user?.avatar || '/icon1.png';
  const timezoneOptions = useRef(getTimezoneOptions());
  const [currentTime, setCurrentTime] = useState(null);
  const [selectedTz, setSelectedTz] = useState(() => {
    try {
      return localStorage.getItem(TIMEZONE_STORAGE_KEY) || 'Asia/Kolkata';
    } catch (_) {
      return 'Asia/Kolkata';
    }
  });
  const [timezoneQuery, setTimezoneQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [logoutBusy, setLogoutBusy] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    setCurrentTime(new Date());
    try {
      const savedTimezone = localStorage.getItem(TIMEZONE_STORAGE_KEY);
      if (savedTimezone) {
        setSelectedTz(savedTimezone);
      }
    } catch (_) {}

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(TIMEZONE_STORAGE_KEY, selectedTz);
    } catch (_) {}
  }, [selectedTz]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const syncProfile = () => setProfileVersion((value) => value + 1);
    window.addEventListener('storage', syncProfile);
    window.addEventListener('dy3-profile-updated', syncProfile);
    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('dy3-profile-updated', syncProfile);
    };
  }, []);

  const handleLogout = async () => {
    if (logoutBusy) return;
    setLogoutBusy(true);
    try {
      await dispatch(
        CommonActions.logoutCaller(() => {
          setIsLogoutModalOpen(false);
          navigate('/login');
        })
      );
    } finally {
      setLogoutBusy(false);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((current) => (current === dropdownName ? null : dropdownName));
    if (dropdownName === 'timezone') {
      setTimezoneQuery('');
    }
  };

  const selectedTimezone = timezoneOptions.current.find((timezone) => timezone.value === selectedTz) || timezoneOptions.current[0];
  const selectedTimezoneCode = currentTime
    ? getDynamicTimezoneCode(selectedTz, selectedTimezone?.code || 'UTC', currentTime)
    : selectedTimezone?.code || 'UTC';
  const dateStr = currentTime
    ? new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', timeZone: selectedTz }).format(currentTime).toUpperCase()
    : '--';
  const timeStr = currentTime
    ? new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: selectedTz }).format(currentTime)
    : '--:--:-- --';
  const filteredTimezones = timezoneOptions.current.filter((timezone) => {
    const query = timezoneQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      timezone.name.toLowerCase().includes(query) ||
      timezone.code.toLowerCase().includes(query) ||
      timezone.value.toLowerCase().includes(query) ||
      timezone.aliases?.some((alias) => alias.includes(query))
    );
  });

  return (
    <>
      <header ref={headerRef} className="relative z-[1200] flex h-[78px] shrink-0 items-center justify-between border-b border-white/5 bg-[linear-gradient(90deg,#09001A_0%,#0A1240_42%,#071224_100%)] px-4 py-3 text-white shadow-[0_20px_40px_rgba(1,3,14,0.28)] sm:px-5 lg:px-6">
        <div className="flex min-w-0 items-center space-x-2 sm:space-x-4 lg:space-x-0">
          <button
            type="button"
            onClick={onSidebarToggle}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:border-[#F26522]/40 hover:bg-[#F26522]/10 hover:text-[#F26522] focus:outline-none lg:hidden"
            aria-label={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
            title={isSidebarOpen ? 'Close Sidebar' : 'Open Sidebar'}
          >
            {isSidebarOpen ? <PanelLeftClose className="h-[18px] w-[18px]" /> : <PanelLeftOpen className="h-[18px] w-[18px]" />}
          </button>

          <div className="flex min-w-0 items-center lg:w-[290px]">
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="flex cursor-pointer items-center group focus:outline-none"
            >
              <div className="relative flex min-w-0 items-center gap-1.5 sm:gap-2 lg:min-w-[220px]">
                <img src="/dy-globe-only.png" alt="DataPlus globe" className="relative z-10 h-11 w-auto shrink-0 self-center drop-shadow-[0_0_10px_rgba(242,101,34,0.22)] sm:h-[3.1rem] lg:h-[3.5rem]" />
                <span className="relative z-10 inline-flex min-w-0 flex-col items-stretch justify-center gap-0.5 leading-none sm:gap-1 lg:gap-1">
                  <span className="portal-brand-font inline-flex w-max max-w-full min-w-0 items-baseline text-[16px] font-extrabold tracking-[0.08em] sm:text-[20px] lg:text-[22px]">
                    <span className="text-[#ffffff]">DATA</span>
                    <span className="text-[#F26522]">PLUS</span>
                  </span>
                  <span className="flex w-max min-w-0 items-center gap-0.5 whitespace-nowrap text-[9px] font-medium leading-none tracking-[0.12em] text-[#ffffff] sm:gap-1 sm:text-[10px] lg:text-[11px]">
                    <span className="shrink-0">Powered</span>
                    <span className="shrink-0">by</span>
                    <span className="shrink-0 font-bold tracking-tight">
                      Data<span className="text-[1.08em] font-extrabold">Y</span>og
                    </span>
                  </span>
                </span>
              </div>
            </button>
          </div>

          <div className="absolute left-[290px] top-1/2 hidden h-12 w-px -translate-y-1/2 bg-white/10 lg:block" />

          <div className="relative hidden lg:ml-6 lg:flex lg:flex-shrink-0 lg:items-center lg:gap-4">
            <button
              type="button"
              onClick={onSidebarToggle}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-gray-300 transition-all duration-300 hover:border-[#F26522]/40 hover:bg-[#F26522]/10 hover:text-[#F26522] focus:outline-none ${isSidebarOpen ? '' : 'ring-1 ring-[#F26522]/35'}`}
              aria-label={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              {isSidebarOpen ? <PanelLeftClose className="h-[18px] w-[18px]" /> : <PanelLeftOpen className="h-[18px] w-[18px]" />}
            </button>

            <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('timezone')}
              className={`group flex items-center gap-3 rounded-[8px] px-3 py-1.5 transition-all focus:outline-none ${
                activeDropdown === 'timezone'
                  ? 'border border-[#F26522]/50 bg-[#F26522]/10 shadow-[0_0_15px_rgba(242,101,34,0.15)]'
                  : 'border border-white/10 bg-white/5 hover:bg-[#F26522]/10 hover:border-[#F26522]/50'
              }`}
            >
              <CalendarDays className={`h-4 w-4 transition-all duration-300 ${activeDropdown === 'timezone' ? 'text-[#F26522]' : 'text-gray-300 group-hover:text-[#F26522]'}`} />
              <div className="flex flex-col text-left leading-none">
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">{dateStr}</span>
                <span className="font-mono text-xs font-medium text-white">{timeStr} <span className="ml-1 font-mono font-bold text-[#F26522]">{selectedTimezoneCode}</span></span>
              </div>
            </button>

            {activeDropdown === 'timezone' ? (
              <div className="absolute left-0 top-full z-50 mt-3 w-[20.5rem] overflow-hidden rounded-[12px] border border-[#F26522]/30 bg-[#0B101E]/95 shadow-[0_8px_32px_0_rgba(242,101,34,0.15)]">
                <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 text-[#F26522]">
                  <div className="flex items-center gap-2"><Globe className="h-4 w-4" /><span className="text-xs font-semibold">Select Timezone</span></div>
                  <button type="button" onClick={() => setActiveDropdown(null)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 transition-all hover:border-[#F26522]/40 hover:bg-[#F26522]/10 hover:text-[#F26522]"><X className="h-4 w-4" /></button>
                </div>
                <div className="px-4 py-3">
                  <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                    <Search className="h-4 w-4 text-white/40" />
                    <input type="text" value={timezoneQuery} onChange={(event) => setTimezoneQuery(event.target.value)} placeholder="Search timezone..." className="ml-2 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25" />
                  </div>
                </div>
                <div className="max-h-80 space-y-1 overflow-y-auto px-2 pb-3">
                  {filteredTimezones.map((tz) => (
                    <button key={tz.value} type="button" onClick={() => { setSelectedTz(tz.value); setActiveDropdown(null); setTimezoneQuery(''); }} className="group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-200 transition-colors hover:bg-[#F26522]/10 hover:text-[#F26522]">
                      <div className="min-w-0 text-left"><span className="block truncate font-medium">{tz.name}</span><span className="block truncate text-[11px] text-white/35">{tz.value}</span></div>
                      <span className="ml-3 text-xs font-semibold text-[#F26522] opacity-80">{tz.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center space-x-2 sm:space-x-5">
          <div className={`hidden min-w-0 items-center gap-3 rounded-[8px] border px-3 py-1.5 text-sm font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] lg:flex ${HEADER_SESSION_STATUS.tone}`}>
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${HEADER_SESSION_STATUS.dot}`} />
            <span className="max-w-[min(240px,18vw)] truncate whitespace-nowrap">{HEADER_SESSION_STATUS.text}</span>
          </div>

          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-white/75 transition-all duration-200 hover:border-[#F26522]/45 hover:bg-[#F26522]/10 hover:text-[#F26522] md:inline-flex"
          >
            <Radio className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/10 bg-white/5 text-white/75 transition-all duration-200 hover:border-[#F26522]/45 hover:bg-[#F26522]/10 hover:text-[#F26522]"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F26522]" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('profile')}
              className={`group flex h-10 items-center gap-2 rounded-[8px] border px-1.5 pr-3 text-left transition-all duration-300 ${
                activeDropdown === 'profile'
                  ? 'border-[#F26522]/50 bg-[#F26522]/10 shadow-[0_0_15px_rgba(242,101,34,0.15)]'
                  : 'border-white/10 bg-white/5 hover:border-[#F26522]/50 hover:bg-[#F26522]/10'
              }`}
            >
              <img src={profileImage} alt="User" className="h-9 w-9 rounded-[7px] border border-white/10 bg-white object-cover p-0.5" onError={(e) => { e.currentTarget.src = '/icon1.png'; }} />
              <div className="hidden min-w-0 sm:block">
                <p className="truncate text-xs font-bold text-white">{displayName}</p>
                <p className="mt-0.5 truncate text-[9px] font-bold uppercase tracking-[0.22em] text-white/45">{displayRole}</p>
              </div>
              <ChevronDown className={`hidden h-4 w-4 transition-transform duration-200 sm:block ${activeDropdown === 'profile' ? 'rotate-180 text-[#F26522]' : 'text-white/55'}`} />
            </button>

            {activeDropdown === 'profile' ? (
              <div onClick={(event) => event.stopPropagation()} className="absolute right-0 z-50 mt-3 w-56 rounded-[12px] border border-[#F26522]/30 bg-[#0B101E]/95 py-2 shadow-[0_8px_32px_0_rgba(242,101,34,0.15)] backdrop-blur-3xl sm:w-64">
                <div className="mt-2 space-y-1 px-2">
                  <button type="button" onClick={() => { setActiveDropdown(null); navigate('/profile'); }} className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-gray-200 transition-colors hover:bg-[#F26522]/10 hover:text-[#F26522]">
                    <User className="mr-3 h-[18px] w-[18px] text-gray-400 transition-all group-hover:scale-110 group-hover:text-[#F26522]" /> Profile
                  </button>
                  <button type="button" onClick={() => { setActiveDropdown(null); navigate('/home'); }} className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-gray-200 transition-colors hover:bg-[#F26522]/10 hover:text-[#F26522]">
                    <Bell className="mr-3 h-[18px] w-[18px] text-gray-400 transition-all group-hover:scale-110 group-hover:text-[#F26522]" /> Notifications
                  </button>
                  <button type="button" onClick={() => { setActiveDropdown(null); navigate('/home'); }} className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-gray-200 transition-colors hover:bg-[#F26522]/10 hover:text-[#F26522]">
                    <Sparkles className="mr-3 h-[18px] w-[18px] text-gray-400 transition-all group-hover:scale-110 group-hover:text-[#F26522]" /> Nexa AI
                  </button>
                </div>
                <div className="my-2 border-t border-white/10" />
                <div className="px-2 pb-2">
                  <button type="button" onClick={() => { setActiveDropdown(null); setIsLogoutModalOpen(true); }} className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300">
                    <LogOut className="mr-3 h-[18px] w-[18px] text-red-400 transition-all group-hover:scale-110 group-hover:text-red-300" /> Logout
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {isLogoutModalOpen
        ? createPortal(
            <div
              className="fixed inset-0 flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
              style={{ zIndex: 200000 }}
              role="presentation"
            >
              <div
                className="w-full max-w-sm rounded-2xl border-2 border-red-600/20 bg-[#FFF5F0] p-6 text-center shadow-[0_20px_60px_rgba(220,38,38,0.3)]"
                role="dialog"
                aria-modal="true"
                aria-labelledby="logout-dialog-title"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-200 bg-red-100 shadow-sm">
                  <LogOut className="h-6 w-6 text-red-600" />
                </div>
                <h3 id="logout-dialog-title" className="mb-2 text-xl font-extrabold text-gray-900">
                  Confirm Logout
                </h3>
                <p className="mb-6 text-sm font-medium text-gray-600">Are you sure you want to log out of DataPlus?</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={logoutBusy}
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="flex-1 rounded-[8px] border-2 border-gray-300 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={logoutBusy}
                    onClick={() => {
                      void handleLogout();
                    }}
                    className="flex-1 rounded-[8px] bg-red-600 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {logoutBusy ? 'Signing out…' : 'Yes, Logout'}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
};

export default TopBar;
