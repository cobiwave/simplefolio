import ScrollReveal from "scrollreveal";

export default function initScrollReveal(targetElements, defaultProps) {
  if (!targetElements.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const reveal = ScrollReveal({ reset: false });

  targetElements.forEach(({ element, animation }) => {
    reveal.reveal(element, Object.assign({}, defaultProps, animation));
  });
}
