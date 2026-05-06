import type { Project } from "../types";

export const calculator: Project = {
  title: "Set Calculator",
  slug: "set-calculator",
  area: "music-theory",
  kind: "music-theory-tool",
  status: "unstable",
  featured: false,
  year: "2025",
  summary:
    "An experimental calculator for comparing just-intonation pitch sets.",
  description:
    "A work-in-progress tool for analyzing just-intonation pitch sets across different theoretical models. The project grew out of my academic work on harmonic complexity, pitch-space/pitch-class-space distinctions, and the problem of representing musical sets outside twelve-tone equal temperament.",
  role:
    "Designer and developer responsible for the theoretical model, calculation logic, React interface, and Python/Django backend.",
  context:
    "Much of my academic work deals with how musical sets can be represented and compared in just intonation. In that context, a set may need to be understood not only as a collection of pitch classes, but also as a collection of specific ratios, partials, or positions in a larger harmonic space.",
  problem:
    "Many familiar tools for set analysis assume twelve-tone equal temperament. This project experiments with how a calculator might work when the input material is made of just-intonation ratios and when different definitions of equivalence produce different analytical results.",
  approach: [
    "Built an experimental React frontend for entering and comparing pitch sets.",
    "Used a Python/Django backend to handle calculation-heavy theoretical operations.",
    "Explored distinctions between pitch space and pitch-class space in the representation of just-intonation sets.",
    "Tested ways of comparing sets across different harmonic-complexity and equivalence models.",
    "Kept the project outside the featured portfolio section because the interface and implementation are not currently stable.",
  ],
  outcome:
    "The project remains an unstable prototype, but it helped clarify the computational requirements for future tools based on just-intonation set theory and harmonic-complexity models.",
  tags: [
    "React",
    "JavaScript",
    "Python",
    "Django",
    "Just Intonation",
    "Music Theory",
    "Experimental",
  ],
  image: "/assets/set-calculator.jpg",
  links: [
    {
      label: "Live tool",
      href: "https://amusictheorist-just-intonation-tools.netlify.app/calculator",
    },
    {
      label: "Source code",
      href: "https://github.com/amusictheorist/just_intonation_tools",
    }
  ],
};