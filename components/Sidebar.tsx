import React from 'react';
import { ViewType } from '../types';
import { VIEWS } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="clip">
          <rect width="100" height="100" rx="20" />
        </clipPath>
      </defs>
      <g clipPath="url(#clip)">
        <rect x="0" y="0" width="48" height="48" fill="#0055B8" rx="10"/>
        <rect x="52" y="0" width="48" height="48" fill="#FF7E2D" rx="10"/>
        <rect x="0" y="52" width="48" height="48" fill="#0055B8" rx="10"/>
        <rect x="52" y="52" width="48" height="48" fill="#0055B8" rx="10"/>
      </g>
    </svg>
  );
  

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const { currentUser, isAdmin, logout } = useAuth();

  const visibleViews = VIEWS.filter(view => {
    // Mostrar 'users' solo a administradores
    if (view.id === 'users') {
      return isAdmin;
    }
    return true;
  });

  return (
    <aside className="w-64 bg-white p-4 space-y-4 flex flex-col border-r border-gray-200">
      <div className="flex items-center space-x-3 p-2 mb-4">
        <Logo />
        <h1 className="text-xl font-bold text-gray-800">Monitor MGI</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {visibleViews.map(({ id, name, icon }) => (
            <li key={id}>
              <button
                onClick={() => setActiveView(id)}
                className={`w-full flex items-center space-x-4 p-3 rounded-lg text-left transition-all duration-300 font-semibold ${
                  activeView === id
                    ? 'bg-blue-50 text-[#003F8C]'
                    : 'text-[#6C7684] hover:bg-blue-50 hover:text-[#003F8C]'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-300 ${activeView === id ? 'text-[#0055B8]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {icon}
                </svg>
                <span>{name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-2 border-t border-gray-200 space-y-2">
         <div className="flex items-center space-x-3">
            <img className="h-10 w-10 rounded-full bg-[#0055B8] flex items-center justify-center text-white font-bold" src={`https://ui-avatars.com/api/?name=${currentUser?.name}&background=0055B8&color=fff`} alt="User" />
            <div className="flex-1">
                <p className="font-semibold text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{isAdmin ? 'Administrador' : 'Usuario'}</p>
            </div>
         </div>
         <button
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Cerrar Sesión</span>
         </button>
      </div>
    </aside>
  );
};