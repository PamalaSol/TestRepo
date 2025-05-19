import React, { useEffect } from 'react';

function DisableZoom() {
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '=')) {
                e.preventDefault();
            }
        };

        // Add event listeners when the component mounts
        window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
        window.addEventListener('keydown', handleKeyDown);

        // Clean up by removing event listeners when the component unmounts
        return () => {
            window.removeEventListener('wheel', handleWheel, { capture: true });
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return null;
}

export default DisableZoom;
