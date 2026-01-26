import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Movies() {
    return (
        <Container className="mt-16">
            <Helmet>
                <title>Movies | Arunabha Banerjee</title>
            </Helmet>
            <SectionHeading subHeading="Personal" heading="Movies" />
            <div className="mt-8">
                <p className="text-neutral-500">Coming soon...</p>
            </div>
        </Container>
    );
}
