import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

interface AnimationConfig {
  element: string;
  animation: {
    delay?: number;
    distance?: string;
    origin?: string;
    duration?: number;
  };
}

const isMobile = () => window.innerWidth <= 768;

const animationConfigs: AnimationConfig[] = [
  {
    element: ".section-title",
    animation: {
      delay: 0.3,
      distance: "0px",
      origin: "bottom",
      duration: 1,
    },
  },
  {
    element: ".hero-title",
    animation: {
      delay: 0.5,
      origin: isMobile() ? "bottom" : "left",
      duration: 1,
    },
  },
  {
    element: ".hero-cta",
    animation: {
      delay: 1,
      origin: isMobile() ? "bottom" : "left",
      duration: 1,
    },
  },
  {
    element: ".about-wrapper__image",
    animation: {
      delay: 0.6,
      origin: "bottom",
      duration: 1,
    },
  },
  {
    element: ".about-wrapper__info",
    animation: {
      delay: 1,
      origin: isMobile() ? "bottom" : "left",
      duration: 1,
    },
  },
  {
    element: ".project-wrapper__text",
    animation: {
      delay: 0.5,
      origin: isMobile() ? "bottom" : "left",
      duration: 1,
    },
  },
  {
    element: ".project-wrapper__image",
    animation: {
      delay: 1,
      origin: isMobile() ? "bottom" : "right",
      duration: 1,
    },
  },
  {
    element: ".contact-wrapper",
    animation: {
      delay: 0.8,
      origin: "bottom",
      duration: 1,
    },
  },
];

const getOriginPosition = (origin: string, distance: number) => {
  switch (origin) {
    case "left":
      return { x: -distance, y: 0 };
    case "right":
      return { x: distance, y: 0 };
    case "top":
      return { x: 0, y: -distance };
    case "bottom":
      return { x: 0, y: distance };
    default:
      return { x: 0, y: distance };
  }
};

export const initScrollAnimations = () => {
  // Show hidden elements initially for GSAP to animate them
  const loadHiddenElements = document.querySelectorAll(".load-hidden");
  loadHiddenElements.forEach((el) => {
    (el as HTMLElement).style.visibility = "visible";
  });

  animationConfigs.forEach((config) => {
    const elements = document.querySelectorAll(config.element);
    const distance = parseInt(config.animation.distance || "30px");
    const origin = config.animation.origin || "bottom";
    const delay = config.animation.delay || 0;
    const duration = config.animation.duration || 1;

    const { x, y } = getOriginPosition(origin, distance);

    elements.forEach((element) => {
      // Set initial state
      gsap.set(element, {
        opacity: 0,
        x,
        y,
      });

      // Create scroll-triggered animation
      gsap.to(element, {
        opacity: 1,
        x: 0,
        y: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });
    });
  });
};
