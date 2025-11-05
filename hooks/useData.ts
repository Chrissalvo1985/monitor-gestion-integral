
import { useContext } from 'react';
import { DataContext, IDataContext } from '../context/DataContext';

export const useData = (): IDataContext => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
