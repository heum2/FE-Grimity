import { useEffect, useCallback } from "react";

export function useCustomBack(customBack: () => void) {
  const browserPreventEvent = useCallback(() => {
    history.pushState(null, "", location.href);
    customBack();
  }, [customBack]);

  useEffect(() => {
    const handlePopstate = () => {
      browserPreventEvent();
    };

    history.pushState(null, "", location.href);

    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [browserPreventEvent]);
}

// import { useEffect, useRef } from "react";

// export function useCustomBack(customBack: () => void) {
//   const initialUrlRef = useRef(window.location.href);

//   useEffect(() => {
//     initialUrlRef.current = window.location.href;

//     const handlePopstate = (e: PopStateEvent) => {
//       customBack();
//       initialUrlRef.current = window.location.href;
//     };

//     history.pushState(null, "", window.location.href);

//     window.addEventListener("popstate", handlePopstate);
//     return () => {
//       window.removeEventListener("popstate", handlePopstate);
//     };
//   }, [customBack]);
// }
