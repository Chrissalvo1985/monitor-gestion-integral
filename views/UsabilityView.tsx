
import React, { useState } from 'react';
import { Card } from '../components/Card';
import { useData } from '../hooks/useData';
import { ProgressBar } from '../components/ProgressBar';
import { UsabilityFormModal } from '../components/UsabilityFormModal';

const UsabilityView: React.FC = () => {
    const { clients, techPlatforms, techUsability } = useData();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingContext, setEditingContext] = useState<{ clientId: string; platformId: string; } | null>(null);

    const handleOpenModal = (clientId: string, platformId: string) => {
        setEditingContext({ clientId, platformId });
        setModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Monitor de Usabilidad</h1>
            <Card>
                <h2 className="text-xl font-bold mb-4 text-gray-700">Porcentaje de Uso por Cliente y Sistema</h2>
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 sticky left-0 bg-gray-50 z-10 min-w-[200px] text-left">Cliente</th>
                                {techPlatforms.map(platform => (
                                    <th key={platform.id} scope="col" className="px-6 py-3 text-center min-w-[200px]">{platform.display_name}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map(client => (
                                <tr key={client.id} className="bg-white border-b hover:bg-gray-50 group">
                                    <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap sticky left-0 bg-white group-hover:bg-gray-50 z-10 text-left">
                                        {client.name}
                                    </th>
                                    {techPlatforms.map(platform => {
                                        const usabilityRecord = techUsability.find(tu => tu.client_id === client.id && tu.platform_id === platform.id);
                                        const usagePct = usabilityRecord?.usage_pct ?? 0;

                                        return (
                                            <td key={platform.id} className="px-6 py-4">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <div className="flex-grow">
                                                        <ProgressBar progress={usagePct} />
                                                        <div className="text-xs text-center mt-1 text-gray-500">
                                                            {usabilityRecord ? `${usabilityRecord.usage_count.toLocaleString('es-CL')} / ${client.headcount.toLocaleString('es-CL')}` : `0 / ${client.headcount.toLocaleString('es-CL')}`}
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-gray-800 w-10 text-right">{usagePct}%</span>
                                                    <button onClick={() => handleOpenModal(client.id, platform.id)} className="text-blue-600 hover:text-blue-800" title="Editar Usabilidad">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <UsabilityFormModal 
                isOpen={isModalOpen}
                onClose={() => { setModalOpen(false); setEditingContext(null); }}
                context={editingContext}
            />
        </div>
    );
};

export default UsabilityView;