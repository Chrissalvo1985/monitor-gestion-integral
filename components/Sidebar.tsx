import React from 'react';
import { ViewType } from '../types';
import { VIEWS } from '../constants';

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
  return (
    <aside className="w-64 bg-white p-4 space-y-4 flex flex-col border-r border-gray-200">
      <div className="flex items-center space-x-3 p-2 mb-4">
        <Logo />
        <h1 className="text-xl font-bold text-gray-800">Monitor MGI</h1>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {VIEWS.map(({ id, name, icon }) => (
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
      <div className="p-2 border-t border-gray-200">
         <div className="flex items-center space-x-3 mt-2">
            <img className="h-10 w-10 rounded-full" src="https://i.pravatar.cc/100?u=admin" alt="User" />
            <div>
                <p className="font-semibold text-gray-800">Admin</p>
                <p className="text-sm text-gray-500">admin@pervex.com</p>
            </div>
         </div>
      </div>
    </aside>
  );
};