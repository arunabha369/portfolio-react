import React, { useEffect } from 'react';

const Script = ({ src, strategy, ...props }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;

        // Copy data attributes
        Object.keys(props).forEach(key => {
            if (key.startsWith('data-')) {
                script.setAttribute(key, props[key]);
            }
        });

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [src]);

    return null;
};

export default Script;
