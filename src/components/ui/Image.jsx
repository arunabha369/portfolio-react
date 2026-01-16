import React from 'react';

const Image = ({ src, alt, className, style, width, height, priority, fill, ...props }) => {
    // Handle Next.js static import object if present
    const imageSrc = typeof src === 'object' && src !== null && 'src' in src ? src.src : src;

    const fillStyles = fill ? {
        position: 'absolute',
        height: '100%',
        width: '100%',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        color: 'transparent',
    } : {
        maxWidth: '100%',
        height: 'auto'
    };

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            style={{
                ...style,
                ...fillStyles
            }}
            width={width}
            height={height}
            loading={priority ? "eager" : "lazy"}
            {...props}
        />
    );
};

export default Image;
