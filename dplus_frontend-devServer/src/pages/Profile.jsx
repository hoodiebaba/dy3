import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Edit3, Eye, EyeOff, KeyRound, Mail, Phone, Save, ShieldCheck, User, UserCircle2 } from 'lucide-react';
import { SET_USER } from '../store/reducers/auth-reducer';
import AuthActions from '../store/actions/auth-actions';
import { isReadOnlyFrontendMode } from '../utils/url';

const EMPTY_PROFILE = {
  fullName: '',
  username: '',
  email: '',
  phone: '',
  title: 'Admin',
  avatar: '',
};

const readUser = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem('user') || 'null');
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
};

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [profile, setProfile] = useState(EMPTY_PROFILE);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPasswordLocked, setCurrentPasswordLocked] = useState(true);
  const [newPasswordLocked, setNewPasswordLocked] = useState(true);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const applyUserToForm = (user) => {
    if (!user || typeof user !== 'object') return;
    setProfile({
      fullName: user?.fullName || user?.name || '',
      username: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      title: user?.title || user?.rolename || 'Admin',
      avatar: user?.avatar || '',
    });
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setRefreshing(true);
      await dispatch(AuthActions.fetchMe());
      if (cancelled) return;
      applyUserToForm(readUser());
      setRefreshing(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    const onProfileSync = () => applyUserToForm(readUser());
    window.addEventListener('dy3-profile-updated', onProfileSync);
    window.addEventListener('storage', onProfileSync);
    return () => {
      window.removeEventListener('dy3-profile-updated', onProfileSync);
      window.removeEventListener('storage', onProfileSync);
    };
  }, []);

  const handleChange = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile((current) => ({ ...current, avatar: String(reader.result || '') }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (isReadOnlyFrontendMode) {
      setStatus('Read-only mode — changes are not saved.');
      window.setTimeout(() => setStatus(''), 2800);
      return;
    }

    if ((currentPassword || newPassword) && (!currentPassword || !newPassword)) {
      setStatus('Enter current and new password.');
      window.setTimeout(() => setStatus(''), 2800);
      return;
    }

    setSaving(true);
    const existing = readUser();
    const next = {
      ...existing,
      name: profile.fullName.trim() || existing?.name || 'DataPlus User',
      fullName: profile.fullName.trim() || existing?.fullName || 'DataPlus User',
      username: profile.username.trim() || existing?.username || 'admin',
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      title: profile.title || existing?.title || existing?.rolename || 'Admin',
      avatar: profile.avatar || existing?.avatar || '',
    };

    localStorage.setItem('user', JSON.stringify(next));
    dispatch(SET_USER(next));
    window.dispatchEvent(new Event('dy3-profile-updated'));

    const { serverSynced } = await dispatch(AuthActions.saveProfile(next));

    if (currentPassword || newPassword) {
      setStatus(
        serverSynced
          ? 'Profile saved. Password change still needs a server endpoint — not sent yet.'
          : 'Saved on this device. Password change needs backend support — not sent yet.'
      );
    } else if (serverSynced) {
      setStatus('Profile saved and synced with the server.');
    } else {
      setStatus('Saved on this device. Server did not accept PATCH /me (or API offline).');
    }

    setCurrentPassword('');
    setNewPassword('');
    setSaving(false);
    window.setTimeout(() => setStatus(''), 4200);
  };

  const saveDisabled = saving || refreshing || isReadOnlyFrontendMode;
  const saveButtonClass =
    'inline-flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-xl border border-[#F26522]/35 bg-[#F26522]/15 px-4 py-2.5 text-sm font-semibold text-[#F26522] transition-all hover:bg-[#F26522]/20 disabled:pointer-events-none disabled:opacity-45 sm:min-h-0 sm:w-auto sm:min-w-[160px] lg:min-w-[180px]';

  return (
    <div className="h-full w-full overflow-x-hidden p-3 sm:p-4 lg:p-6">
      <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-6">
        <section className="relative w-full overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(9,0,26,0.94)_0%,rgba(10,18,64,0.94)_50%,rgba(7,18,36,0.96)_100%)] p-4 pt-5 shadow-[0_24px_80px_rgba(3,8,24,0.45)] sm:rounded-[28px] sm:p-6 sm:pt-6 lg:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,101,34,0.16),transparent_22%),radial-gradient(circle_at_right,rgba(59,130,246,0.18),transparent_28%)]" />
          <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#F26522]">Profile</p>
              <div className="mt-3 flex min-w-0 flex-row items-start gap-3 sm:items-center sm:gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-visible rounded-[16px] border border-[#F26522]/30 bg-[#080F22] shadow-[0_20px_45px_rgba(0,0,0,0.35)] sm:h-20 sm:w-20 sm:rounded-[18px] lg:h-28 lg:w-28 lg:rounded-[22px]">
                  <img
                    src={profile?.avatar || '/icon1.png'}
                    alt={profile?.fullName || 'DataPlus User'}
                    className="h-full w-full rounded-[16px] object-cover sm:rounded-[18px] lg:rounded-[22px]"
                    onError={(e) => {
                      e.currentTarget.src = '/icon1.png';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isReadOnlyFrontendMode}
                    className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#081224] text-white/90 transition-all hover:bg-[#0d1730] hover:text-white disabled:opacity-40 sm:h-7 sm:w-7"
                    title="Edit profile image"
                  >
                    <Edit3 className="h-3.5 w-3.5 sm:h-3.5 sm:w-3.5" />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="break-words text-lg font-extrabold leading-tight tracking-[0.02em] text-white sm:text-xl md:text-2xl lg:text-3xl">
                    {profile?.fullName || 'DataPlus User'}
                  </h1>
                  <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] font-medium text-white/60 sm:text-xs md:mt-2 md:text-sm">
                    <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[#F26522] sm:h-4 sm:w-4" />
                    <span className="break-words">{String(profile?.title || 'Admin').toUpperCase()}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex w-full min-w-0 shrink-0 flex-col gap-2 lg:w-auto lg:max-w-[min(100%,20rem)] lg:items-end">
              <button type="button" onClick={handleSave} disabled={saveDisabled} className={saveButtonClass}>
                <Save className="h-4 w-4 shrink-0" />
                {refreshing ? 'Loading…' : saving ? 'Saving...' : 'Save Changes'}
              </button>
              {status ? (
                <p className="text-center text-xs leading-snug text-white/55 sm:text-sm lg:max-w-xs lg:text-right">{status}</p>
              ) : null}
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </section>

        <section className="w-full min-w-0 rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(9,0,26,0.94)_0%,rgba(10,18,64,0.94)_50%,rgba(7,18,36,0.96)_100%)] p-4 shadow-[0_24px_80px_rgba(3,8,24,0.45)] sm:rounded-[28px] sm:p-6 lg:p-8">
          <div className="mb-5 min-w-0 sm:mb-6">
            <h2 className="text-base font-bold tracking-[0.02em] text-white sm:text-lg">Account Settings</h2>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45"><UserCircle2 className="h-4 w-4 text-[#F26522]" />Full Name</span>
              <input type="text" value={profile?.fullName || ''} onChange={(e) => handleChange('fullName', e.target.value)} className="box-border w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#F26522]/45 sm:px-4" placeholder="Enter full name" />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45"><User className="h-4 w-4 text-[#F26522]" />Username</span>
              <input type="text" value={profile?.username || ''} onChange={(e) => handleChange('username', e.target.value)} className="box-border w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#F26522]/45 sm:px-4" placeholder="Enter username" />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45"><Mail className="h-4 w-4 text-[#F26522]" />Email ID</span>
              <input type="email" value={profile?.email || ''} onChange={(e) => handleChange('email', e.target.value)} className="box-border w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#F26522]/45 sm:px-4" placeholder="Enter email address" />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45"><Phone className="h-4 w-4 text-[#F26522]" />Mobile Number</span>
              <input type="tel" value={profile?.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} className="box-border w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#F26522]/45 sm:px-4" placeholder="Enter phone number" />
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45"><KeyRound className="h-4 w-4 text-[#F26522]" />Current Password</span>
              <div className="relative">
                <input type={showCurrentPassword ? 'text' : 'password'} readOnly={currentPasswordLocked} onFocus={() => setCurrentPasswordLocked(false)} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="box-border w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#F26522]/45 sm:px-4" placeholder="Enter current password" />
                <button type="button" onClick={() => setShowCurrentPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-[#F26522]">{showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </label>

            <label className="block min-w-0">
              <span className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45"><KeyRound className="h-4 w-4 text-[#F26522]" />New Password</span>
              <div className="relative">
                <input type={showNewPassword ? 'text' : 'password'} readOnly={newPasswordLocked} onFocus={() => setNewPasswordLocked(false)} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="box-border w-full min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-3 pr-11 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-[#F26522]/45 sm:px-4" placeholder="Enter new password" />
                <button type="button" onClick={() => setShowNewPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-[#F26522]">{showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
