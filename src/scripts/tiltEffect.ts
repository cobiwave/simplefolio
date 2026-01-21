interface TiltOptions {
  max: number;
  perspective: number;
  scale: number;
  speed: number;
  glare: boolean;
  maxGlare: number;
}

class VanillaTilt {
  private element: HTMLElement;
  private settings: TiltOptions;
  private reverse: boolean;
  private glare: HTMLElement | null = null;
  private glareValue: HTMLElement | null = null;

  constructor(element: HTMLElement, settings: Partial<TiltOptions> = {}) {
    this.element = element;
    this.settings = {
      max: settings.max || 15,
      perspective: settings.perspective || 1000,
      scale: settings.scale || 1.05,
      speed: settings.speed || 300,
      glare: settings.glare || false,
      maxGlare: settings.maxGlare || 0.5,
    };
    this.reverse = false;

    if (this.settings.glare) {
      this.prepareGlare();
    }

    this.addEventListeners();
  }

  private prepareGlare() {
    const glarePrerender = document.createElement("div");
    glarePrerender.classList.add("js-tilt-glare");

    const glareElement = document.createElement("div");
    glareElement.classList.add("js-tilt-glare-inner");

    glarePrerender.appendChild(glareElement);
    this.element.appendChild(glarePrerender);

    this.glare = glarePrerender;
    this.glareValue = glareElement;

    // Apply glare styles
    Object.assign(this.glare.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      borderRadius: "inherit",
    });

    Object.assign(this.glareValue!.style, {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "200%",
      height: "200%",
      background: "linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
      transform: "rotate(180deg) translate(-50%, -50%)",
      transformOrigin: "0% 0%",
      opacity: "0",
    });
  }

  private addEventListeners() {
    this.element.addEventListener("mouseenter", this.onMouseEnter.bind(this));
    this.element.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.element.addEventListener("mouseleave", this.onMouseLeave.bind(this));
  }

  private onMouseEnter() {
    this.element.style.willChange = "transform";
    this.element.style.transition = `transform ${this.settings.speed}ms cubic-bezier(.03,.98,.52,.99)`;
  }

  private onMouseMove(event: MouseEvent) {
    const rect = this.element.getBoundingClientRect();
    const width = this.element.offsetWidth;
    const height = this.element.offsetHeight;

    const px = (event.clientX - rect.left) / width;
    const py = (event.clientY - rect.top) / height;

    const tiltX = (this.reverse ? -1 : 1) * (this.settings.max / 2 - px * this.settings.max);
    const tiltY = (this.reverse ? -1 : 1) * (py * this.settings.max - this.settings.max / 2);

    this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})`;

    if (this.settings.glare && this.glareValue) {
      const glarePos = (event.clientX - rect.left) / width * 100;
      const glareOpacity = this.settings.maxGlare * (py > 0.5 ? 1 - py : py) * 2;
      this.glareValue.style.opacity = glareOpacity.toString();
      this.glareValue.style.transform = `rotate(180deg) translate(-50%, -50%) translateX(${glarePos}%)`;
    }
  }

  private onMouseLeave() {
    this.element.style.willChange = "auto";
    this.element.style.transform = `perspective(${this.settings.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

    if (this.settings.glare && this.glareValue) {
      this.glareValue.style.opacity = "0";
    }
  }

  public destroy() {
    this.element.removeEventListener("mouseenter", this.onMouseEnter);
    this.element.removeEventListener("mousemove", this.onMouseMove);
    this.element.removeEventListener("mouseleave", this.onMouseLeave);
    
    if (this.glare) {
      this.element.removeChild(this.glare);
    }
  }
}

export const initTiltEffect = () => {
  const elements = document.querySelectorAll<HTMLElement>("[data-tilt]");
  
  elements.forEach((element) => {
    const max = parseInt(element.getAttribute("data-tilt-max") || "15");
    const glare = element.getAttribute("data-tilt-glare") === "true";
    const maxGlare = parseFloat(element.getAttribute("data-tilt-max-glare") || "0.5");

    new VanillaTilt(element, {
      max,
      glare,
      maxGlare,
      perspective: 1000,
      scale: 1.02,
      speed: 300,
    });
  });
};
