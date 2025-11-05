import React, { useState } from 'react';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { ProcessSurveyStatus, ProcessSurvey, ProcessArea } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { useData } from '../hooks/useData';
import { useAuth } from '../hooks/useAuth';
import { ProcessSurveyModal } from '../components/ProcessSurveyModal';

const ProcessMonitorView: React.FC = () => {
    const { processAreas, processSurveys, users, addProcessSurvey } = useData();
    const { isAdmin } = useAuth();
    const [editingSurvey, setEditingSurvey] = useState<ProcessSurvey | null>(null);

    const handleCreate = (areaId: string) => {
        const newSurvey: Omit<ProcessSurvey, 'id' | 'last_update'> = {
            area_id: areaId,
            status: ProcessSurveyStatus.NO_INICIADO,
            mapeo_proceso_pct: 0,
            procedimientos_pct: 0,
            controles_pct: 0,
            evidencias_pct: 0,
            owner_user_id: users[0]?.id || '',
        };
        addProcessSurvey(newSurvey);
    };

    const handleEdit = (survey: ProcessSurvey) => {
        setEditingSurvey(survey);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Gestión de Procesos</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processAreas.map(area => {
                    const survey = processSurveys.find(s => s.area_id === area.id);
                    const owner = users.find(u => u.id === survey?.owner_user_id);
                    
                    return (
                        <Card key={area.id}>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold">{area.display_name}</h3>
                                <StatusBadge status={survey?.status || ProcessSurveyStatus.NO_INICIADO} />
                            </div>
                            
                            {survey ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        <div>
                                            <p>Mapeo</p>
                                            <ProgressBar progress={survey.mapeo_proceso_pct} />
                                        </div>
                                        <div>
                                            <p>Procedimientos</p>
                                            <ProgressBar progress={survey.procedimientos_pct} />
                                        </div>
                                        <div>
                                            <p>Controles</p>
                                            <ProgressBar progress={survey.controles_pct} />
                                        </div>
                                        <div>
                                            <p>Evidencias</p>
                                            <ProgressBar progress={survey.evidencias_pct} />
                                        </div>
                                    </div>
                                    <div className="text-sm pt-2 border-t border-gray-200">
                                        <p><strong>Owner:</strong> {owner?.name || 'N/A'}</p>
                                        <p><strong>Última Act.:</strong> {new Date(survey.last_update).toLocaleDateString()}</p>
                                    </div>
                                    {isAdmin && (
                                        <button onClick={() => handleEdit(survey)} className="w-full mt-2 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold">
                                            Editar Levantamiento
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                    <p className="mb-4">No se ha iniciado el levantamiento para esta área.</p>
                                    {isAdmin && (
                                        <button onClick={() => handleCreate(area.id)} className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold">
                                            Iniciar Levantamiento
                                        </button>
                                    )}
                                </div>
                            )}
                        </Card>
                    );
                })}
            </div>
            <ProcessSurveyModal isOpen={!!editingSurvey} survey={editingSurvey} onClose={() => setEditingSurvey(null)} />
        </div>
    );
};

export default ProcessMonitorView;