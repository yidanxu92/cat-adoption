'use client';
import { useEffect, useRef } from 'react';

const AnimatedText = () => {
  return (
    <svg viewBox="0 0 800 100" width="100%" height="100">
      
      <text
        x="50.1%"
        y="50.1%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fdb3d0"
        stroke="none"
        fontFamily="Fascinate Inline, cursive"
        fontSize="40"
        opacity="0"
      >
        <tspan>
          Searching for your perfect feline friend...
          <animate
            attributeName="opacity"
            values="0;1"
            dur="0.3s"
            begin="1.2s"
            fill="freeze"
          />
        </tspan>
      </text>

      {/* 主文本 */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        fontFamily="Fascinate Inline, cursive"
        fontSize="40"
      >
        <tspan>
          Searching for your perfect feline friend...
          <animate
            attributeName="stroke-dasharray"
            from="0 1000"
            to="1000 0"
            dur="1.5s"
            fill="freeze"
          />
          <animate
            attributeName="fill"
            values="transparent;#000000"
            dur="0.3s"
            begin="1.2s"
            fill="freeze"
          />
        </tspan>
      </text>
    </svg>
  );
};

export default AnimatedText; 