export const setDocumentViewportHeight = (): void => {
  document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
};
