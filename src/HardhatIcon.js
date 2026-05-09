import React from 'react';

export default function ChambaLogo({ size = 36 }) {
    const scale = size / 42;
    return (
        <svg width={size} height={size} viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="42" height="42" rx="10" fill="#111" />
            <circle cx="13" cy="12" r="5" fill="white" />
            <path d="M7 28 Q7 20 13 20 Q19 20 19 28" fill="white" />
            <circle cx="29" cy="12" r="5" fill="#1D9E75" />
            <path d="M23 28 Q23 20 29 20 Q35 20 35 28" fill="#1D9E75" />
            <circle cx="21" cy="20" r="2" fill="white" />
        </svg>
    );
}