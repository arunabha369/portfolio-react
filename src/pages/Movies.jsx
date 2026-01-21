import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import React from 'react';

export default function Movies() {
    return (
        <Container className="mt-16">
            <SectionHeading subHeading="Personal" heading="Movies" />
            <div className="mt-8">
                <p className="text-neutral-500">Coming soon...</p>
            </div>
        </Container>
    );
}
