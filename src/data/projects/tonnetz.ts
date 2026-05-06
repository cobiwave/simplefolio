import type { Project } from "../types";

export const tonnetz: Project = {
  title: "Transformational Tonnetz",
  slug: "transformational-tonnetz",
  area: "music-theory",
  kind: "music-theory-tool",
  status: "live",
  featured: true,
  year: "2025",
  summary:
    "An interactive Tonnetz for exploring transformations between major and minor triads.",
  description:
    "A React, TypeScript, and SVG web app for visualizing triadic relationships on a Tonnetz. The tool lets users select chords, show transformational relations, adjust the view, and trace paths through harmonic progressions.",
  role:
    "Designer and developer responsible for the Tonnetz model, SVG rendering, interaction design, TypeScript application structure, and deployment.",
  context:
    "The Tonnetz is a spatial model of tonal relationships. In neo-Riemannian and transformational theory, it is often used to show how major and minor triads relate through small voice-leading changes and transformations such as P, L, and R.",
  problem:
    "Transformational relationships can be hard to follow when they are described only with chord labels or abstract operations. The project needed a way to make those relations visible as paths through a harmonic space.",
  approach: [
    "Built a Vite and React application with TypeScript for clearer state, component, and data modelling.",
    "Rendered the Tonnetz as an SVG triangular tiling so chords, paths, labels, and transformations could update directly from application state.",
    "Added chord selection, transformation toggles, zoom controls, and path drawing for tracing progressions through the network.",
    "Designed the interface as a teaching and analysis tool rather than a playback or composition app.",
  ],
  outcome:
    "The tool gives students, analysts, and curious musicians a hands-on way to explore triadic transformations and visualize harmonic motion through the Tonnetz.",
  tags: [
    "React",
    "TypeScript",
    "Vite",
    "SVG",
    "Transformational Theory",
    "Music Theory",
  ],
  image: "/assets/tonnetz.png",
  links: [
    {
      label: "Live tool",
      href: "https://amusictheorist-tonnetz-webapp.netlify.app",
    },
    {
      label: "Source code",
      href: "https://github.com/amusictheorist/tonnetz-webapp",
    },
  ],
};