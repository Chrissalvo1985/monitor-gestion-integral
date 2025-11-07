
import React, { useState, useMemo } from 'react';
import { Card } from '../components/Card';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { ClientExperience, CollaboratorExperiencePlan, ImplementationStatus } from '../types';
import { ClientExperienceModal } from '../components/ClientExperienceModal';
import { CollaboratorExperiencePlanModal } from '../components/CollaboratorExperiencePlanModal';
import { StatusBadge } from '../components/StatusBadge';
import { ProgressBar } from '../components/ProgressBar';
import { filterClients } from '../utils/calculations';
import { Pagination } from '../components/Pagination';
import { usePagination } from '../hooks/usePagination';

const NpsCard: React.FC<{ experience: ClientExperience | undefined; onEdit: () => void; isAdmin: boolean }> = ({ experience, onEdit, isAdmin }) => {
    const score = experience?.nps_score ?? null;
    let bgColor = 'bg-gray-100';
    let textColor = 'text-gray-800';
    let label = 'Sin Datos';

    if (score !== null) {
        if (score > 50) {
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            label = 'Promotor';
        } else if (score >= 0) {
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            label = 'Pasivo';
        } else {
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            label = 'Detractor';
        }
    }

    return (
        <Card className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 ${bgColor}`}>
            <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-700">Experiencia Cliente (NPS)</h3>
                <p className="text-xs sm:text-sm text-gray-500">Última encuesta: {experience ? new Date(experience.last_survey_date).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 mt-4 sm:mt-0">
                <div className="text-center">
                    <p className={`text-3xl sm:text-5xl font-bold ${textColor}`}>{score ?? 'N/A'}</p>
                    <p className={`text-xs sm:text-sm font-semibold ${textColor}`}>{label}</p>
                </div>
                {isAdmin && (
                    <button onClick={onEdit} className="text-blue-600 hover:text-blue-800 flex-shrink-0" title="Editar NPS">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                        </svg>
                    </button>
                )}
            </div>
        </Card>
    );
};

const ExperienceView: React.FC = () => {
    const { selectedClientId, selectedResponsibleId, selectedGerencia, clients, clientExperiences, collaboratorExperiencePlans, processAreas, users, deleteCollaboratorExperiencePlan } = useData();
    const { isAdmin } = useAuth();

    const [isNpsModalOpen, setNpsModalOpen] = useState(false);
    const [isPlanModalOpen, setPlanModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState<CollaboratorExperiencePlan | null>(null);

    const filteredClients = useMemo(() => {
        return filterClients(clients, selectedClientId, selectedResponsibleId, selectedGerencia);
    }, [clients, selectedClientId, selectedResponsibleId, selectedGerencia]);

    const selectedClientExperience = useMemo(() => {
        if (filteredClients.length !== 1) return undefined;
        return clientExperiences.find(ce => ce.client_id === filteredClients[0].id);
    }, [clientExperiences, filteredClients]);

    const selectedClientPlans = useMemo(() => {
        if (filteredClients.length === 0) return [];
        const filteredClientIds = new Set(filteredClients.map(c => c.id));
        return collaboratorExperiencePlans.filter(cep => filteredClientIds.has(cep.client_id));
    }, [collaboratorExperiencePlans, filteredClients]);

    const {
        currentPage,
        totalPages,
        itemsPerPage,
        paginatedItems: paginatedPlans,
        totalItems,
        goToPage,
        handleItemsPerPageChange,
    } = usePagination(selectedClientPlans, 10);

    const handleEditPlan = (plan: CollaboratorExperiencePlan) => {
        setEditingPlan(plan);
        setPlanModalOpen(true);
    };

    const handleCreatePlan = () => {
        setEditingPlan(null);
        setPlanModalOpen(true);
    };
    
    const handleDeletePlan = (planId: string) => {
        if (window.confirm('¿Está seguro de que desea eliminar este plan?')) {
            deleteCollaboratorExperiencePlan(planId);
        }
    };

    const selectedClientName = filteredClients.length === 1 ? filteredClients[0].name : undefined;

    return (
        <div className="space-y-4 sm:space-y-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Gestión de Experiencias</h1>

            {filteredClients.length === 1 ? (
                <div className="space-y-4 sm:space-y-6">
                    <NpsCard experience={selectedClientExperience} onEdit={() => setNpsModalOpen(true)} isAdmin={isAdmin} />
                    
                    <Card className="overflow-hidden flex flex-col lg:max-h-[calc(100vh-380px)]">
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 flex-shrink-0">
                            <h2 className="text-lg sm:text-xl font-bold text-gray-700">Planes de Experiencia Colaborador ({selectedClientName})</h2>
                            {isAdmin && (
                                <button onClick={handleCreatePlan} className="bg-gradient-to-r from-[#FF7E2D] to-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all text-sm sm:text-base whitespace-nowrap">
                                    + Crear Plan
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto overflow-y-auto -mx-4 sm:mx-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex-1 min-h-0">
                            <div className="inline-block min-w-full align-middle">
                                <table className="min-w-full text-sm text-left text-gray-500 divide-y divide-gray-200">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-3 sm:px-6 py-3 min-w-[120px]">Área</th>
                                            <th scope="col" className="px-3 sm:px-6 py-3 min-w-[150px]">Plan</th>
                                            <th scope="col" className="px-3 sm:px-6 py-3 min-w-[100px]">Estado</th>
                                            <th scope="col" className="px-3 sm:px-6 py-3 min-w-[150px]">Progreso</th>
                                            <th scope="col" className="px-3 sm:px-6 py-3 min-w-[120px]">Owner</th>
                                            <th scope="col" className="px-3 sm:px-6 py-3 min-w-[120px]">Fecha Obj.</th>
                                            <th scope="col" className="px-3 sm:px-6 py-3 min-w-[100px]">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {paginatedPlans.map(plan => {
                                            const area = processAreas.find(a => a.id === plan.area_id);
                                            const owner = users.find(u => u.id === plan.owner_user_id);
                                            return (
                                                <tr key={plan.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{area?.display_name || 'N/A'}</td>
                                                    <th scope="row" className="px-3 sm:px-6 py-4 font-medium text-gray-900">{plan.plan_name}</th>
                                                    <td className="px-3 sm:px-6 py-4"><StatusBadge status={plan.status} /></td>
                                                    <td className="px-3 sm:px-6 py-4 min-w-[150px]"><ProgressBar progress={plan.progress_pct} /></td>
                                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{owner?.name || 'N/A'}</td>
                                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">{plan.target_date ? new Date(plan.target_date).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="px-3 sm:px-6 py-4">
                                                        {isAdmin && (
                                                            <div className="flex space-x-2">
                                                                <button onClick={() => handleEditPlan(plan)} className="text-blue-600 hover:text-blue-800" title="Editar">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                                </button>
                                                                <button onClick={() => handleDeletePlan(plan.id)} className="text-red-600 hover:text-red-800" title="Eliminar">
                                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                            </div>
                            {selectedClientPlans.length === 0 && <p className="text-center text-gray-500 py-8">No hay planes de experiencia para este cliente.</p>}
                        </div>
                        {selectedClientPlans.length > 0 && (
                            <div className="flex-shrink-0 mt-4 pt-4 border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={goToPage}
                                    onItemsPerPageChange={handleItemsPerPageChange}
                                />
                            </div>
                        )}
                    </Card>
                </div>
            ) : (
                 <Card>
                    <p className="text-center text-gray-500 py-8">Por favor, seleccione un cliente en la barra superior para gestionar sus experiencias.</p>
                </Card>
            )}

            <ClientExperienceModal 
                isOpen={isNpsModalOpen} 
                onClose={() => setNpsModalOpen(false)}
                experience={selectedClientExperience}
            />
            <CollaboratorExperiencePlanModal
                isOpen={isPlanModalOpen}
                onClose={() => setPlanModalOpen(false)}
                plan={editingPlan}
            />
        </div>
    );
};

export default ExperienceView;
