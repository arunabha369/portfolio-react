import React, { lazy, Suspense } from 'react';

const dynamic = (importFunc, options = {}) => {
    const LazyComponent = lazy(importFunc);
    const Loading = options.loading;

    return (props) => (
        <Suspense fallback={Loading ? <Loading /> : null}>
            <LazyComponent {...props} />
        </Suspense>
    );
};

export default dynamic;
