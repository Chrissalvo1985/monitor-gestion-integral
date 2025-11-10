import React from 'react';
import { ViewType } from '../types';
import { VIEWS } from '../constants';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
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
  

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, isOpen, onClose }) => {
  const { currentUser, isAdmin, hasAssignedClients, logout } = useAuth();

  // Vistas permitidas sin clientes asignados
  const allowedViewsWithoutClients: ViewType[] = ['process', 'lab'];

  const visibleViews = VIEWS.filter(view => {
    // Ocultar 'users' para no administradores
    if (view.id === 'users') {
      return isAdmin;
    }
    return true;
  });

  const isViewDisabled = (viewId: ViewType): boolean => {
    // Los admins nunca están bloqueados
    if (isAdmin) return false;
    
    // Si no tiene clientes asignados, solo permitir vistas específicas
    if (!hasAssignedClients) {
      return !allowedViewsWithoutClients.includes(viewId);
    }
    
    return false;
  };

  const handleViewChange = (view: ViewType) => {
    setActiveView(view);
    onClose();
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white p-4 space-y-4 flex flex-col border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        h-full overflow-hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-2 mb-4">
          <div className="flex items-center space-x-3">
            <Logo />
            <h1 className="text-xl font-bold text-gray-800">Monitor MGI</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-gray-700"
            aria-label="Cerrar menú"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul className="space-y-2">
            {visibleViews.map(({ id, name, icon }) => {
              const disabled = isViewDisabled(id);
              return (
                <li key={id}>
                  <button
                    onClick={() => !disabled && handleViewChange(id)}
                    disabled={disabled}
                    className={`w-full flex items-center space-x-4 p-3 rounded-lg text-left transition-all duration-300 font-semibold ${
                      disabled
                        ? 'text-gray-400 cursor-not-allowed opacity-50'
                        : activeView === id
                          ? 'bg-blue-50 text-[#003F8C]'
                          : 'text-[#6C7684] hover:bg-blue-50 hover:text-[#003F8C]'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-colors duration-300 ${activeView === id && !disabled ? 'text-[#0055B8]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {icon}
                    </svg>
                    <span>{name}</span>
                    {disabled && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-2 border-t border-gray-200 space-y-2">
           <div className="flex items-center space-x-3">
              <img className="h-10 w-10 rounded-full bg-[#0055B8] flex items-center justify-center text-white font-bold" src={`https://ui-avatars.com/api/?name=${currentUser?.name}&background=0055B8&color=fff`} alt="User" />
              <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{currentUser?.name}</p>
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
    </>
  );
};