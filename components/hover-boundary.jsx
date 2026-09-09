"use client";

import { createContext, useContext, useEffect, useState } from "react";

const HoverEnabledContext = createContext(false);

export function useHoverEnabled() {
  return useContext(HoverEnabledContext);
}

/** Routes and navigation views each wait for fresh mouse movement. */
export function HoverBoundary({ viewKey, children, ...props }) {
  const [view, setView] = useState(viewKey);
  const [enabled, setEnabled] = useState(false);

  // Reset before the new view paints, without remounting its contents.
  if (view !== viewKey) {
    setView(viewKey);
    setEnabled(false);
  }

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) setEnabled(false);
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <HoverEnabledContext.Provider value={enabled}>
      <div
        {...props}
        data-hover-enabled={enabled}
        onPointerMoveCapture={(event) => {
          // Layout changes and clicks can place a stationary pointer over a
          // new control. Only actual mouse movement unlocks hover effects.
          if (
            !enabled &&
            event.pointerType === "mouse" &&
            (event.movementX !== 0 || event.movementY !== 0)
          ) {
            setEnabled(true);
          }
        }}
      >
        {children}
      </div>
    </HoverEnabledContext.Provider>
  );
}
