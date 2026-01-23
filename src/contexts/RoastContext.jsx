import React, { createContext, useContext, useState } from 'react';

const RoastContext = createContext({});

export const useRoast = () => useContext(RoastContext);

export const RoastProvider = ({ children }) => {
    const [latestRoast, setLatestRoast] = useState(null);

    const value = {
        latestRoast,
        setLatestRoast
    };

    return (
        <RoastContext.Provider value={value}>
            {children}
        </RoastContext.Provider>
    );
};
