// ContrastContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the context
type ContrastContextType = {
    isInverted: boolean;
    toggleContrast: () => void;
};

// Create the context with default values
const ContrastContext = createContext<ContrastContextType | undefined>(undefined);

// Create the provider component
export const ContrastProvider = ({ children }: { children: ReactNode }) => {
    const [isInverted, setIsInverted] = useState<boolean>(false);

    // Function to toggle the contrast value
    const toggleContrast = () => {
        setIsInverted((prev) => !prev);
    };

    return (
        <ContrastContext.Provider value={{ isInverted, toggleContrast }}>
            {children}
        </ContrastContext.Provider>
    );
};

// Custom hook to use the contrast context
export const useContrast = () => {
    const context = useContext(ContrastContext);
    if (context === undefined) {
        throw new Error('useContrast must be used within a ContrastProvider');
    }
    return context;
};
