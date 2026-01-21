import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({ href, to, children, ...props }) => {
    return (
        <RouterLink to={href || to} {...props}>
            {children}
        </RouterLink>
    );
};

export default Link;
