import React from 'react';

export const NoClientsAccess: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md p-8">
        <div className="mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-24 w-24 mx-auto text-gray-300" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Acceso Restringido
        </h2>
        <p className="text-gray-600 mb-4">
          No tienes clientes asignados a tu usuario. Para acceder a esta sección, necesitas que un administrador te asigne al menos un cliente.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">📌 Puedes acceder a:</p>
          <ul className="list-disc list-inside text-left space-y-1">
            <li>Monitor de Procesos</li>
            <li>Pervex Lab</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

