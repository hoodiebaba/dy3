import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ child }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const checkAuth = localStorage.getItem('auth');
  const isProfileRoute = location.pathname === '/profile';

  useEffect(() => {
    if (checkAuth === 'false') {
      navigate('/');
    }
  }, [checkAuth, navigate]);

  return (
    <div
      className={`min-w-0 min-h-0 flex-1 overflow-y-auto overflow-x-hidden ${isProfileRoute ? 'bg-[linear-gradient(180deg,#09001A_0%,#0A1240_38%,#071224_100%)]' : 'bg-[#f3eee6]'}`}
      style={{ fontFamily: '"Aptos", "Aptos Display", "Segoe UI", Arial, sans-serif' }}
    >
      {child}
    </div>
  );
};

export default Layout;
