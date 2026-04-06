import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, UserCircle2 } from 'lucide-react';
import AuthActions from '../store/actions/auth-actions';

/** Same as DataYog login page (random field, mounted gate). */
function createStars(count, prefix, minSize, maxSize) {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}`,
    top: `${Math.random() * 210 - 55}%`,
    left: `${Math.random() * 210 - 55}%`,
    size: Number((Math.random() * (maxSize - minSize) + minSize).toFixed(2)),
    opacity: Number((Math.random() * 0.78 + 0.18).toFixed(2)),
    duration: `${(Math.random() * 5 + 3.5).toFixed(2)}s`,
    delay: `${(Math.random() * 7).toFixed(2)}s`,
  }));
}

const planets = [
  { id: 'mercury', size: 9, orbitSize: 450, duration: '16s', delay: '0s', tilt: '75deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #f5f5f4, #78716c 55%, #44403c)', glow: '0 0 18px rgba(245,245,244,0.35)' },
  { id: 'venus', size: 14, orbitSize: 620, duration: '22s', delay: '-2s', tilt: '74deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #fde68a, #f59e0b 58%, #b45309)', glow: '0 0 22px rgba(245,158,11,0.38)' },
  { id: 'earth', size: 15, orbitSize: 840, duration: '29s', delay: '-7s', tilt: '74deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #60a5fa, #38bdf8 42%, #22c55e 62%, #1d4ed8)', glow: '0 0 28px rgba(96,165,250,0.48)', moon: true },
  { id: 'mars', size: 11, orbitSize: 1050, duration: '37s', delay: '-3s', tilt: '73deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #fb7185, #ea580c 58%, #7c2d12)', glow: '0 0 18px rgba(234,88,12,0.38)' },
  { id: 'jupiter', size: 30, orbitSize: 1350, duration: '51s', delay: '-9s', tilt: '73deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #fef3c7, #f59e0b 42%, #92400e 74%)', glow: '0 0 34px rgba(245,158,11,0.36)' },
  { id: 'saturn', size: 26, orbitSize: 1650, duration: '66s', delay: '-12s', tilt: '72deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #fff7ed, #facc15 45%, #ca8a04 78%)', glow: '0 0 38px rgba(250,204,21,0.32)', ring: true, reverse: true },
  { id: 'uranus', size: 20, orbitSize: 1950, duration: '82s', delay: '-18s', tilt: '72deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #e0f2fe, #67e8f9 45%, #0ea5e9 76%)', glow: '0 0 30px rgba(103,232,249,0.3)' },
  { id: 'neptune', size: 20, orbitSize: 2200, duration: '96s', delay: '-24s', tilt: '71deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #60a5fa, #4338ca 42%, #1e3a8a 78%)', glow: '0 0 32px rgba(67,56,202,0.3)', reverse: true },
  { id: 'pluto', size: 7, orbitSize: 2450, duration: '112s', delay: '-31s', tilt: '70deg', top: '50%', left: '50%', color: 'linear-gradient(135deg, #e5e7eb, #9ca3af 65%, #6b7280)', glow: '0 0 14px rgba(229,231,235,0.3)' },
];

/** Pixel match to DataYog backdrop; GPU hints reduce resize / blend flicker (no visual change). */
function LoginDataYogBackdrop({ farStars, midStars, nearStars }) {
  const starLayerClass =
    'absolute left-1/2 top-1/2 h-[240vh] w-[240vw] -translate-x-1/2 -translate-y-1/2 [backface-visibility:hidden]';
  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_16%),radial-gradient(circle_at_14%_84%,rgba(242,101,34,0.09),transparent_18%),radial-gradient(circle_at_88%_38%,rgba(59,130,246,0.14),transparent_24%)]" />
      <div className={`${starLayerClass} opacity-55`} style={{ animation: 'orbit360 280s linear infinite' }}>
        {farStars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{ top: star.top, left: star.left, width: `${star.size}px`, height: `${star.size}px`, opacity: star.opacity }}
          />
        ))}
      </div>
      <div className={starLayerClass} style={{ animation: 'orbit360Reverse 190s linear infinite' }}>
        {midStars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-[#dbeafe]"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: '0 0 12px rgba(255,255,255,0.38)',
              animation: `twinkle ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>
      <div className={starLayerClass} style={{ animation: 'orbit360 124s linear infinite' }}>
        {nearStars.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              top: star.top,
              left: star.left,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              boxShadow: star.size > 4 ? '0 0 24px rgba(255,255,255,0.95)' : '0 0 14px rgba(255,255,255,0.75)',
              animation: `twinkle ${star.duration} ease-in-out infinite`,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="login-sun-anchor">
        <div className="login-sun-body bg-gradient-to-br from-[#ffe8bf] via-[#F26522] to-[#7f2700]">
          <div
            className="login-sun-ring absolute inset-[-42px] rounded-full border border-[#F26522]/18"
            style={{ animation: 'orbitFlash 4.8s ease-in-out infinite' }}
          />
          <div
            className="login-sun-ring absolute inset-[-90px] rounded-full border border-[#fb923c]/10"
            style={{ animation: 'orbitFlash 6.2s ease-in-out infinite' }}
          />
        </div>
      </div>

      <div className="absolute inset-0 opacity-[0.86] [backface-visibility:hidden]" style={{ mixBlendMode: 'screen', transform: 'translateZ(0)' }}>
        <div
          className="login-backdrop-blur-blob absolute left-[-10%] top-[36%] h-[32rem] w-[32rem] rounded-full"
          style={{ background: 'rgba(162, 28, 175, 0.24)', filter: 'blur(130px)' }}
        />
        <div
          className="login-backdrop-blur-blob absolute right-[-10%] top-[18%] h-[40rem] w-[40rem] rounded-full"
          style={{ background: 'rgba(37, 99, 235, 0.24)', filter: 'blur(150px)' }}
        />
        <div
          className="login-backdrop-blur-blob absolute left-[26%] top-[2%] h-[24rem] w-[24rem] rounded-full"
          style={{ background: 'rgba(139, 92, 246, 0.16)', filter: 'blur(120px)' }}
        />
        <div
          className="login-backdrop-blur-blob absolute bottom-[-12%] left-[34%] h-[28rem] w-[28rem] rounded-full"
          style={{ background: 'rgba(242, 101, 34, 0.12)', filter: 'blur(150px)' }}
        />
      </div>

      <div
        className="absolute left-[72%] top-[8%] h-[2px] w-[180px] origin-top bg-gradient-to-r from-white via-cyan-200 to-transparent opacity-0"
        style={{ animation: 'cometFly 9s linear infinite', animationDelay: '1.8s' }}
      />
      <div
        className="absolute left-[86%] top-[26%] h-[2px] w-[130px] origin-top bg-gradient-to-r from-white via-indigo-200 to-transparent opacity-0"
        style={{ animation: 'cometFly 11s linear infinite', animationDelay: '5.6s' }}
      />

      {planets.map((planet) => (
        <div
          key={planet.id}
          className="absolute [backface-visibility:hidden]"
          style={{
            top: planet.top,
            left: planet.left,
            width: `${planet.orbitSize}px`,
            height: `${planet.orbitSize}px`,
            marginLeft: `${planet.orbitSize / -2}px`,
            marginTop: `${planet.orbitSize / -2}px`,
            animation: `${planet.reverse ? 'orbit360Reverse' : 'orbit360'} ${planet.duration} linear infinite`,
            animationDelay: planet.delay,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 rounded-full border border-white/[0.06]" style={{ transform: `rotateX(${planet.tilt}) rotateY(-18deg)`, animation: 'orbitFlash 10s ease-in-out infinite' }} />
          <div className="absolute left-1/2 top-0 -translate-x-1/2" style={{ transform: `translateY(-${planet.size / 2}px)` }}>
            <div
              className="planet-surface relative rounded-full"
              style={{
                width: `${planet.size}px`,
                height: `${planet.size}px`,
                '--planet-color': planet.color,
                '--spin-duration': `${Math.max(12, planet.size)}s`,
                boxShadow: planet.glow,
              }}
            >
              <div className="absolute inset-[18%] rounded-full bg-white/12 blur-[2px]" />
              {planet.ring ? (
                <div
                  className="absolute left-1/2 top-1/2 h-[36%] w-[190%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35"
                  style={{
                    transform: 'translate(-50%, -50%) rotateX(76deg) rotateY(-16deg)',
                    boxShadow: '0 0 12px rgba(255,255,255,0.16)',
                  }}
                />
              ) : null}
              {planet.moon ? (
                <div
                  className="absolute left-1/2 top-1/2 h-[230%] w-[230%] -translate-x-1/2 -translate-y-1/2"
                  style={{ animation: 'moonOrbit 4s linear infinite' }}
                >
                  <div className="absolute right-[-2px] top-1/2 h-[4px] w-[4px] -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.95)]" />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const username = watch('username');
  const password = watch('password');

  const farStars = useMemo(() => createStars(260, 'far', 0.7, 1.4), []);
  const midStars = useMemo(() => createStars(180, 'mid', 1.1, 2.5), []);
  const nearStars = useMemo(() => createStars(120, 'near', 2.2, 5.8), []);

  const onSubmit = async (data) => {
    if (!data.username?.trim() || !data.password) {
      setError('Username and password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await dispatch(
        AuthActions.signIn(
          { username: data.username.trim(), password: data.password },
          () => navigate('/home')
        )
      );
      if (result && result.ok === false && result.message) {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="login-shell relative isolate flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto overscroll-x-none bg-[#02030a] px-4 py-8 text-white"
      style={{ fontFamily: '"DatayogQuantico", Arial, Helvetica, sans-serif', letterSpacing: '0.02em' }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes orbit360 { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes orbit360Reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
            @keyframes planetSpin { from { background-position: 0% 50%; } to { background-position: -240% 50%; } }
            @keyframes twinkle { 0%,100% { opacity: .25; transform: scale(.76); } 50% { opacity: 1; transform: scale(1.32); } }
            @keyframes cometFly { 0% { transform: translate3d(0,0,0) rotate(-32deg); opacity: 0; } 8% { opacity: 1; } 100% { transform: translate3d(-1400px,900px,0) rotate(-32deg); opacity: 0; } }
            @keyframes sunPulseScale { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
            .login-sun-anchor {
              position: absolute;
              left: 50%;
              top: 50%;
              width: 80px;
              height: 80px;
              margin-left: -40px;
              margin-top: -40px;
              transform: translate3d(0, 0, 0);
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              isolation: isolate;
              contain: layout;
              pointer-events: none;
            }
            .login-sun-body {
              position: relative;
              width: 100%;
              height: 100%;
              border-radius: 50%;
              transform-origin: 50% 50%;
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              animation: sunPulseScale 5.5s ease-in-out infinite;
              box-shadow: 0 0 64px rgba(242, 101, 34, 0.55), 0 0 100px rgba(242, 101, 34, 0.22);
            }
            .login-sun-ring {
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              transform: translateZ(0);
            }
            @keyframes orbitFlash { 0%,100% { opacity: .12; } 50% { opacity: .38; } }
            @keyframes moonOrbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .nebula-bg { background: radial-gradient(circle at 18% 78%, rgba(168,85,247,0.22), transparent 18%), radial-gradient(circle at 82% 24%, rgba(59,130,246,0.26), transparent 22%), radial-gradient(circle at 50% 14%, rgba(255,255,255,0.06), transparent 18%), radial-gradient(ellipse at center, rgba(18,24,66,0.84) 0%, rgba(14,17,42,0.84) 26%, rgba(4,7,18,0.98) 76%, #02030a 100%); }
            .planet-surface { background: repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,.02) 4%, transparent 10%), linear-gradient(135deg, rgba(255,255,255,.16), transparent 45%), var(--planet-color); background-size: 240% 100%, 100% 100%, 100% 100%; animation: planetSpin var(--spin-duration, 18s) linear infinite; }
            .login-shell input { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; caret-color: #ffffff; font-family: inherit; }
            .login-shell input::placeholder { color: #64748b !important; -webkit-text-fill-color: #64748b !important; opacity: 1; }
            .login-shell input:-webkit-autofill, .login-shell input:-webkit-autofill:hover, .login-shell input:-webkit-autofill:focus, .login-shell input:-webkit-autofill:active { -webkit-text-fill-color: #ffffff !important; caret-color: #ffffff; border: 1px solid rgba(255,255,255,0.07) !important; -webkit-box-shadow: 0 0 0 1000px rgba(24, 30, 48, 0.92) inset !important; box-shadow: 0 0 0 1000px rgba(24, 30, 48, 0.92) inset !important; transition: background-color 999999s ease-in-out 0s; background-clip: content-box !important; }
            .login-shell input::selection { background: rgba(242,101,34,0.32); }
            main.login-shell {
              min-height: 100vh;
              min-height: 100dvh;
              -webkit-text-size-adjust: 100%;
              text-size-adjust: 100%;
            }
            .login-nebula-fix {
              transform: translateZ(0);
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
              contain: layout;
            }
            .login-card-glass {
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              transform: translateZ(0);
              isolation: isolate;
              /* No backdrop-filter: avoids Chrome/Safari repaint flicker on browser zoom */
              background: linear-gradient(155deg, rgba(32, 40, 62, 0.94) 0%, rgba(22, 28, 48, 0.96) 42%, rgba(14, 18, 32, 0.98) 100%);
              box-shadow:
                0 0 0 1px rgba(255, 255, 255, 0.045),
                inset 0 1px 0 0 rgba(255, 255, 255, 0.11),
                inset 0 0 80px 0 rgba(242, 101, 34, 0.03),
                0 28px 72px -12px rgba(0, 0, 0, 0.55),
                0 0 100px -30px rgba(242, 101, 34, 0.09);
            }
            .login-card-glass::before {
              content: "";
              position: absolute;
              inset: 0;
              z-index: 0;
              border-radius: inherit;
              pointer-events: none;
              background: linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, transparent 42%, rgba(0, 0, 0, 0.12) 100%);
            }
            .login-input-field {
              background: rgba(255, 255, 255, 0.045);
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.18);
              transition: box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
            }
            .login-input-field:focus {
              background: rgba(255, 255, 255, 0.06);
              box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.12), 0 0 0 2px rgba(242, 101, 34, 0.22);
            }
            .login-backdrop-blur-blob {
              transform: translateZ(0);
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
            }
            .login-shell-section {
              -webkit-backface-visibility: hidden;
              backface-visibility: hidden;
              transform: translateZ(0);
            }
          `,
        }}
      />

      <div className="login-nebula-fix nebula-bg pointer-events-none absolute inset-0 overflow-hidden">
        <LoginDataYogBackdrop farStars={farStars} midStars={midStars} nearStars={nearStars} />
      </div>

      <section className="login-shell-section relative z-10 mx-auto flex w-full max-w-[1180px] items-center justify-center">
        <div
          className="login-card-glass relative my-auto w-full max-w-[540px] rounded-[2rem] p-5 sm:overflow-hidden sm:rounded-[2.125rem] sm:p-8"
          style={{ WebkitFontSmoothing: 'antialiased', fontFamily: '"Aptos", "Aptos Display", "Segoe UI", Arial, sans-serif' }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-[1px] z-[1] rounded-[inherit] bg-[radial-gradient(120%_80%_at_50%_-20%,rgba(242,101,34,0.09),transparent_55%)]"
          />

          <div className="relative z-[2]">
            <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
              <div className="mb-3 flex items-center justify-center gap-0 opacity-[0.92]">
                <img
                  src="/dy-globe-only.png"
                  alt="DataPlus Globe"
                  className="h-11 w-auto drop-shadow-[0_4px_20px_rgba(242,101,34,0.35)] sm:h-14"
                />
                <img
                  src="/dy-white-orange.png"
                  alt="DataPlus"
                  className="-ml-1 h-[15px] w-auto sm:-ml-1.5 sm:h-5"
                />
              </div>

              <h1 className="portal-brand-font mt-0.5 text-[1.35rem] font-black tracking-[0.27em] sm:text-[1.68rem] sm:tracking-[0.29em]">
                <span className="inline-block text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">DATA</span>
                <span className="inline-block drop-shadow-[0_0_26px_rgba(242,101,34,0.42)]">
                  <span className="bg-gradient-to-b from-[#ffb07a] via-[#F26522] to-[#c2410c] bg-clip-text text-transparent">PLUS</span>
                </span>
              </h1>

              <div className="mt-5 flex w-full max-w-[220px] items-center gap-3 sm:max-w-[240px]">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/18" />
                <h2 className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.32em] text-white/50 sm:text-[11px]">Portal Access</h2>
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/18" />
              </div>
            </div>

            <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                  <UserCircle2 className="h-4 w-4 shrink-0 text-[#F26522]" strokeWidth={2} /> Username
                </span>
                <input
                  {...register('username', { required: 'Username is required.' })}
                  placeholder="Enter username"
                  autoComplete="username"
                  className="login-input-field w-full rounded-2xl border border-white/[0.07] px-4 py-3.5 text-sm text-white outline-none placeholder:text-slate-500"
                />
                {errors?.username?.message ? <p className="mt-2 text-xs text-red-300">{errors.username.message}</p> : null}
              </label>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
                  <LockKeyhole className="h-4 w-4 shrink-0 text-[#F26522]" strokeWidth={2} /> Password
                </span>
                <div className="relative">
                  <input
                    {...register('password', { required: 'Password is required.' })}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    autoComplete="current-password"
                    className="login-input-field w-full rounded-2xl border border-white/[0.07] px-4 py-3.5 pr-12 text-sm text-white outline-none placeholder:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/35 transition hover:text-[#F26522]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors?.password?.message ? <p className="mt-2 text-xs text-red-300">{errors.password.message}</p> : null}
              </label>

              {error ? (
                <div className="rounded-2xl border border-red-400/20 bg-red-950/35 px-4 py-3 text-sm text-red-200/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading || !username?.trim() || !password}
                className="w-full rounded-2xl bg-gradient-to-r from-[#ea580c] via-[#F26522] to-[#ff8a3d] px-4 py-3.5 text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_4px_24px_-2px_rgba(242,101,34,0.45)] transition-all duration-200 hover:brightness-[1.08] hover:shadow-[0_8px_32px_-4px_rgba(242,101,34,0.5)] disabled:cursor-not-allowed disabled:opacity-65 disabled:shadow-none"
              >
                {loading ? 'Signing In...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
