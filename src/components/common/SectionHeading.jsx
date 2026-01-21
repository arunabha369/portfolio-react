import React from 'react';
export default function SectionHeading({
  subHeading,
  heading
}) {
  return <div className="text-left w-full">
    <p className="text-secondary text-sm">{subHeading}</p>
    <h2 className="text-2xl font-bold">{heading}</h2>
  </div>;
}