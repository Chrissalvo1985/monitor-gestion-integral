import React, { useMemo, useEffect, useState } from 'react';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { Gerencia, ViewType } from '../types';

interface FilterBarProps {
  activeView: ViewType;
}

export const FilterBar: React.FC<FilterBarProps> = ({ activeView }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const { 
        clients, 
        users,
        selectedClientId, 
        setSelectedClientId,
        selectedResponsibleId,
        setSelectedResponsibleId,
        selectedGerencia,
        setSelectedGerencia
    } = useData();
    
    const { currentUser, isAdmin } = useAuth();

    // Obtener clientes filtrados según permisos y jerarquía
    const availableClients = useMemo(() => {
        let filtered = clients;
        
        // PRIMERO: Filtrar por permisos del usuario (si no es admin)
        if (!isAdmin && currentUser?.assigned_clients) {
            if (currentUser.assigned_clients.length > 0) {
                filtered = filtered.filter(c => currentUser.assigned_clients!.includes(c.id));
            } else {
                // Usuario sin clientes asignados, no mostrar ninguno
                filtered = [];
            }
        }
        
        // DESPUÉS: Filtrar por gerencia
        if (selectedGerencia && selectedGerencia !== 'all') {
            filtered = filtered.filter(c => c.gerencia === selectedGerencia);
        }
        
        // FINALMENTE: Filtrar por responsable
        if (selectedResponsibleId && selectedResponsibleId !== 'all') {
            filtered = filtered.filter(c => c.owner_user_id === selectedResponsibleId);
        }
        
        return filtered;
    }, [clients, selectedGerencia, selectedResponsibleId, isAdmin, currentUser]);

    // Obtener responsables únicos filtrados por permisos y gerencia
    const responsibleUsers = useMemo(() => {
        let filteredClients = clients;
        
        // PRIMERO: Filtrar por permisos del usuario (si no es admin)
        if (!isAdmin && currentUser?.assigned_clients) {
            if (currentUser.assigned_clients.length > 0) {
                filteredClients = filteredClients.filter(c => currentUser.assigned_clients!.includes(c.id));
            } else {
                filteredClients = [];
            }
        }
        
        // DESPUÉS: Si hay gerencia seleccionada, filtrar clientes por gerencia
        if (selectedGerencia && selectedGerencia !== 'all') {
            filteredClients = filteredClients.filter(c => c.gerencia === selectedGerencia);
        }
        
        const responsibleIds = new Set(filteredClients.map(c => c.owner_user_id));
        return users.filter(u => responsibleIds.has(u.id));
    }, [clients, users, selectedGerencia, isAdmin, currentUser]);

    // Validar y resetear valores cuando cambian las dependencias
    useEffect(() => {
        // Validar responsable según gerencia
        if (selectedGerencia && selectedGerencia !== 'all' && selectedResponsibleId && selectedResponsibleId !== 'all') {
            const clientsInGerencia = clients.filter(c => c.gerencia === selectedGerencia);
            const responsibleIdsInGerencia = new Set(clientsInGerencia.map(c => c.owner_user_id));
            
            if (!responsibleIdsInGerencia.has(selectedResponsibleId)) {
                setSelectedResponsibleId('all');
            }
        }
    }, [selectedGerencia, clients, selectedResponsibleId, setSelectedResponsibleId]);

    useEffect(() => {
        // Validar cliente según gerencia y responsable
        if (selectedClientId && selectedClientId !== 'all') {
            const isValidClient = availableClients.some(c => c.id === selectedClientId);
            if (!isValidClient) {
                setSelectedClientId('all');
            }
        }
    }, [availableClients, selectedClientId, setSelectedClientId]);

    const handleClientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedClientId(e.target.value);
    };

    const handleResponsibleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedResponsibleId(e.target.value);
    };

    const handleGerenciaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedGerencia(e.target.value);
    };

    // Obtener gerencias únicas de los clientes disponibles
    const gerencias = useMemo(() => {
        // Filtrar clientes según permisos del usuario
        let filteredClients = clients;
        if (!isAdmin && currentUser?.assigned_clients) {
            if (currentUser.assigned_clients.length > 0) {
                filteredClients = filteredClients.filter(c => currentUser.assigned_clients!.includes(c.id));
            } else {
                filteredClients = [];
            }
        }
        
        // Obtener gerencias únicas de los clientes disponibles
        const availableGerencias = new Set(filteredClients.map(c => c.gerencia));
        return Object.values(Gerencia).filter(g => availableGerencias.has(g));
    }, [clients, isAdmin, currentUser]);

    // Obtener valores seleccionados para mostrar en el botón
    const getSelectedValues = () => {
        const clientName = selectedClientId && selectedClientId !== 'all' 
            ? availableClients.find(c => c.id === selectedClientId)?.name || 'Todos'
            : 'Todos';
        const responsibleName = selectedResponsibleId && selectedResponsibleId !== 'all'
            ? responsibleUsers.find(u => u.id === selectedResponsibleId)?.name || 'Todos'
            : 'Todos';
        const gerenciaName = selectedGerencia && selectedGerencia !== 'all'
            ? selectedGerencia
            : 'Todas';
        
        return { clientName, responsibleName, gerenciaName };
    };

    const { clientName, responsibleName, gerenciaName } = getSelectedValues();
    const hasActiveFilters = (selectedClientId && selectedClientId !== 'all') || 
                            (selectedResponsibleId && selectedResponsibleId !== 'all') || 
                            (selectedGerencia && selectedGerencia !== 'all');

    // Ocultar filtros en estas vistas - check after all hooks
    const viewsWithoutFilters: ViewType[] = ['lab', 'process', 'users'];
    if (viewsWithoutFilters.includes(activeView)) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-2 sm:mb-6">
            {/* Botón para móvil */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full sm:hidden flex items-center justify-between p-2 text-left hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">
                        {hasActiveFilters ? 'Filtros activos' : 'Filtros'}
                    </span>
                </div>
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Contenido de filtros */}
            <div className={`${isOpen ? 'block' : 'hidden'} sm:block p-2 sm:p-4`}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-700 sm:mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                        <span>Filtros:</span>
                    </div>
                    <div className="flex-1 sm:flex-initial sm:w-full sm:max-w-xs">
                        <label htmlFor="client-select" className="block text-xs font-medium text-gray-700 mb-1">Cliente</label>
                        <select
                            id="client-select"
                            value={selectedClientId || 'all'}
                            onChange={handleClientChange}
                            className="bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 sm:p-2.5 font-semibold"
                        >
                            <option value="all">Todos los Clientes</option>
                            {availableClients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 sm:flex-initial sm:w-full sm:max-w-xs">
                        <label htmlFor="responsible-select" className="block text-xs font-medium text-gray-700 mb-1">Responsable</label>
                        <select
                            id="responsible-select"
                            value={selectedResponsibleId || 'all'}
                            onChange={handleResponsibleChange}
                            className="bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 sm:p-2.5 font-semibold"
                        >
                            <option value="all">Todos los Responsables</option>
                            {responsibleUsers.map(user => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 sm:flex-initial sm:w-full sm:max-w-xs">
                        <label htmlFor="gerencia-select" className="block text-xs font-medium text-gray-700 mb-1">Gerencia</label>
                        <select
                            id="gerencia-select"
                            value={selectedGerencia || 'all'}
                            onChange={handleGerenciaChange}
                            className="bg-white border border-gray-300 text-gray-900 text-xs sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 sm:p-2.5 font-semibold"
                        >
                            <option value="all">Todas las Gerencias</option>
                            {gerencias.map(gerencia => (
                                <option key={gerencia} value={gerencia}>{gerencia}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

