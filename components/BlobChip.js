import { useEffect, useState } from 'react';

let svgAdded = false;

export default function BlobChip({ 
  children, 
  active = false, 
  onClick, 
  ...props 
}) {
  const [shouldRenderSvg, setShouldRenderSvg] = useState(false);

  useEffect(() => {
    if (!svgAdded) {
      setShouldRenderSvg(true);
      svgAdded = true;
    }
  }, []);

  return (
    <>
      <button
        className={`chip ${active ? 'active' : ''}`}
        onClick={onClick}
        aria-pressed={active}
        {...props}
      >
        {children}
        <span className="chip__inner">
          <span className="chip__blobs">
            <span className="chip__blob"></span>
            <span className="chip__blob"></span>
            <span className="chip__blob"></span>
            <span className="chip__blob"></span>
          </span>
        </span>
      </button>
      
      {/* SVG Filter - chỉ render một lần duy nhất */}
      {shouldRenderSvg && (
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{position: 'absolute', width: 0, height: 0}}>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
              <feColorMatrix 
                in="blur" 
                mode="matrix" 
                values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" 
                result="goo"
              ></feColorMatrix>
              <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
            </filter>
          </defs>
        </svg>
      )}
    </>
  );
}