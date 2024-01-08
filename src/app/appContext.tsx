import React from 'react';

interface RefreshIndexContextType {
    totalRecords: number;
    refreshIndex: () => Promise<void>;
}
const defaultContext: RefreshIndexContextType = {
    totalRecords: 0,
    refreshIndex: () => Promise.resolve(),
};

const AppContext = React.createContext<RefreshIndexContextType>(defaultContext);

export default AppContext;