import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalPortalProps {
  children: React.ReactNode;
  selector?: string;
}

function ModalPortal({ children, selector = "#modal-root" }: ModalPortalProps) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let portalRoot = document.querySelector(selector) as HTMLElement;
    if (!portalRoot) {
      portalRoot = document.createElement("div");
      portalRoot.setAttribute("id", selector.replace("#", ""));
      document.body.appendChild(portalRoot);
    }
    setEl(portalRoot);
  }, [selector]);

  if (!el) return null;

  return createPortal(children, el);
}

export default ModalPortal;
