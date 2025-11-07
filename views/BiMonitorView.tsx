import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { BiClientPanel, ImplementationStatus, BiPanel } from '../types';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { BiPanelModal } from '../components/BiPanelModal';
import { BiPanelCreateModal } from '../components/BiPanelCreateModal';
import { filterClients } from '../utils/calculations';

const BiMonitorView: React.FC = () => {
    const { clients, biPanels, biClientPanels, users, selectedClientId, selectedResponsibleId, selectedGerencia } = useData();
    const { isAdmin } = useAuth();
    const [editingPanel, setEditingPanel] = useState<{clientPanel: BiClientPanel, panelInfo: BiPanel} | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const gridRef = useRef<HTMLDivElement>(null);
    const [maxRowHeight, setMaxRowHeight] = useState<number>(300);

    const handleEdit = (clientPanel: BiClientPanel) => {
        const panelInfo = biPanels.find(p => p.id === clientPanel.panel_id);
        if (panelInfo) {
            setEditingPanel({ clientPanel, panelInfo });
        }
    };
    
    const filteredClients = useMemo(() => {
        return filterClients(clients, selectedClientId, selectedResponsibleId, selectedGerencia);
    }, [clients, selectedClientId, selectedResponsibleId, selectedGerencia]);

    // Verificar si todos los filtros están en "all"
    const allFiltersAreAll = useMemo(() => {
        return (selectedClientId === 'all' || !selectedClientId) && 
               (selectedResponsibleId === 'all' || !selectedResponsibleId) && 
               (selectedGerencia === 'all' || !selectedGerencia);
    }, [selectedClientId, selectedResponsibleId, selectedGerencia]);
    
    const clientPanels = useMemo(() => {
        if (filteredClients.length === 0 || allFiltersAreAll) return [];
        const filteredClientIds = new Set(filteredClients.map(c => c.id));
        return biClientPanels.filter(p => filteredClientIds.has(p.client_id));
    }, [biClientPanels, filteredClients, allFiltersAreAll]);

    // Calcular altura máxima de fila para que quepan todas las tarjetas sin scroll
    useEffect(() => {
        if (clientPanels.length === 0) {
            setMaxRowHeight(300);
            return;
        }

        const getCols = () => {
            const width = window.innerWidth;
            if (width >= 1536) return 5;
            if (width >= 1280) return 4;
            if (width >= 1024) return 3;
            if (width >= 768) return 2;
            return 1;
        };

        let timeoutIds: ReturnType<typeof setTimeout>[] = [];
        let resizeObserver: ResizeObserver | null = null;
        let isMounted = true;

        const updateMaxHeight = () => {
            if (!isMounted) return;
            
            const grid = gridRef.current;
            if (!grid) return;

            // Esperar a que el layout se complete
            requestAnimationFrame(() => {
                if (!isMounted) return;
                
                requestAnimationFrame(() => {
                    if (!isMounted) return;
                    
                    const grid = gridRef.current;
                    if (!grid) return;
                    
                    const containerHeight = grid.clientHeight || grid.offsetHeight;
                    if (containerHeight === 0) {
                        const retryTimeout = setTimeout(updateMaxHeight, 150);
                        timeoutIds.push(retryTimeout);
                        return;
                    }

                    const cols = getCols();
                    const rows = Math.ceil(clientPanels.length / cols);
                    const gap = 24; // gap-6 = 24px
                    
                    if (rows > 0 && containerHeight > 0) {
                        const totalGapHeight = gap * (rows - 1);
                        const availableHeight = containerHeight - totalGapHeight;
                        const calculatedHeight = Math.floor(availableHeight / rows);
                        
                        // Límites: mínimo 280px, máximo 400px (altura razonable para una tarjeta)
                        // Si hay pocas filas (1-2), usar altura más conservadora
                        // Si hay muchas filas (3+), calcular para que quepan todas
                        const minHeight = 280;
                        const maxHeight = rows <= 2 ? 380 : 400; // Más conservador cuando hay pocas filas
                        const finalHeight = Math.max(minHeight, Math.min(maxHeight, calculatedHeight));
                        
                        if (isMounted) {
                            setMaxRowHeight(finalHeight);
                        }
                    } else {
                        if (isMounted) {
                            setMaxRowHeight(320);
                        }
                    }
                });
            });
        };

        const handleResize = () => {
            const resizeTimeout = setTimeout(updateMaxHeight, 50);
            timeoutIds.push(resizeTimeout);
        };

        const setupObserver = () => {
            if (gridRef.current && !resizeObserver) {
                resizeObserver = new ResizeObserver(handleResize);
                resizeObserver.observe(gridRef.current);
            }
        };

        const initialTimeout = setTimeout(updateMaxHeight, 150);
        timeoutIds.push(initialTimeout);
        
        const observerTimeout = setTimeout(setupObserver, 200);
        timeoutIds.push(observerTimeout);
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            isMounted = false;
            timeoutIds.forEach(id => clearTimeout(id));
            timeoutIds = [];
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [clientPanels.length]);

    return (
        <div className="h-full flex flex-col space-y-4 sm:space-y-6 min-h-0">
            <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de BI</h1>
                {isAdmin && (
                    <button onClick={() => setCreateModalOpen(true)} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base whitespace-nowrap" disabled={filteredClients.length !== 1}>
                        + Crear Panel BI
                    </button>
                )}
            </div>
            
            {filteredClients.length > 0 && !allFiltersAreAll ? (
                <div className="flex-1 flex flex-col min-h-0">
                    <h2 className="flex-shrink-0 text-lg sm:text-xl font-bold mb-4 text-gray-700">
                        {filteredClients.length === 1 
                            ? `Paneles de BI para ${filteredClients[0].name}`
                            : `Paneles de BI (${filteredClients.length} clientes)`}
                    </h2>
                    <div 
                        ref={gridRef}
                        className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 min-h-0 items-start"
                        style={{ gridAutoRows: `minmax(280px, ${maxRowHeight}px)` }}
                    >
                        {clientPanels.map(cp => {
                            const panelInfo = biPanels.find(p => p.id === cp.panel_id);
                            const owner = users.find(u => u.id === cp.owner_user_id);
                            const client = clients.find(c => c.id === cp.client_id);
                            if (!panelInfo) return null;

                            const isOverdue = cp.target_date && new Date(cp.target_date) < new Date() && cp.status !== ImplementationStatus.IMPLEMENTADO;
                            const isImplemented = cp.status === ImplementationStatus.IMPLEMENTADO;

                            return (
                                <Card key={cp.id} className="flex flex-col overflow-hidden p-3 sm:p-4" style={{ maxHeight: `${maxRowHeight}px` }}>
                                    <div className="flex-shrink-0 flex justify-between items-start mb-1.5">
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 truncate max-w-full">
                                                    {client?.name || 'N/A'}
                                                </span>
                                                {panelInfo.area && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                                        {panelInfo.area}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-sm font-bold text-gray-800 line-clamp-1">{panelInfo.name}</h3>
                                        </div>
                                        <StatusBadge status={cp.status} />
                                    </div>
                                    
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-1 flex-shrink-0">{panelInfo.short_desc}</p>
                                    
                                    <div className="flex-1 flex flex-col justify-end min-h-0 overflow-hidden">
                                        <div className="mb-1.5">
                                            <div className="flex justify-between mb-0.5 text-xs font-medium text-gray-700">
                                                <span>Progreso</span><span>{cp.progress_pct}%</span>
                                            </div>
                                            <ProgressBar progress={cp.progress_pct} />
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-1.5 mb-1.5 text-xs text-gray-600">
                                            <div>
                                                <p className="font-semibold text-gray-700 text-xs">Owner</p>
                                                <p className="truncate text-xs">{owner?.name || 'N/A'}</p>
                                            </div>
                                            {cp.target_date ? (
                                                <div>
                                                    <p className="font-semibold text-gray-700 text-xs">Fecha Obj.</p>
                                                    <p className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                                                        {new Date(cp.target_date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="font-semibold text-gray-700 text-xs">Actualización</p>
                                                    <p className="text-xs">{new Date(cp.last_update).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</p>
                                                </div>
                                            )}
                                        </div>

                                        {isOverdue && (
                                            <div className="px-1.5 py-1 mb-1.5 text-xs text-red-700 bg-red-50 rounded font-medium text-center border border-red-200">
                                                ⚠️ Vencida
                                            </div>
                                        )}

                                        {cp.notes && maxRowHeight > 320 && (
                                            <div className="px-1.5 py-1 mb-1.5 bg-gray-50 rounded border border-gray-200">
                                                <p className="text-xs font-semibold text-gray-700 mb-0.5">Notas:</p>
                                                <p className="text-xs text-gray-600 line-clamp-1">{cp.notes}</p>
                                            </div>
                                        )}

                                        <div className="flex flex-col gap-1.5 pt-1.5 border-t border-gray-200 flex-shrink-0">
                                            {panelInfo.embed_url && (
                                                <a 
                                                    href={panelInfo.embed_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="w-full text-center bg-[#0055B8] text-white py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#003F8C] transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    {isImplemented ? 'Abrir' : 'Ver Panel'}
                                                </a>
                                            )}
                                            {isAdmin && (
                                                <button 
                                                    onClick={() => handleEdit(cp)} 
                                                    className="w-full bg-indigo-600 text-white py-1.5 px-2 rounded text-xs font-semibold shadow-sm hover:bg-indigo-700 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                        {clientPanels.length === 0 && 
                            <Card className="col-span-full">
                                <p className="text-center text-gray-500 py-8">No hay paneles de BI asignados a este cliente. ¡Crea el primero!</p>
                            </Card>
                        }
                    </div>
                </div>
            ) : (
                 <Card>
                    <p className="text-center text-gray-500 py-8">Por favor, seleccione un cliente en la barra superior para gestionar sus paneles de BI.</p>
                </Card>
            )}
            <BiPanelModal isOpen={!!editingPanel} panelData={editingPanel} onClose={() => setEditingPanel(null)} />
            <BiPanelCreateModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
        </div>
    );
};

export default BiMonitorView;