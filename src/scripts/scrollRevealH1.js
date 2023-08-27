export default function exScrollReveal(targetElements, defaultProps) {
    if (!targetElements.length) return;
  
    ScrollReveal({ reset: true });
  
    targetElements.forEach(({ element, animation }) => {
      ScrollReveal().reveal(element, Object.assign({}, defaultProps, animation));
    });
  }
  