import type { Project } from "../types";

export const lattice: Project = {
  title: "Ratio Lattice Visualizer",
  slug: "ratio-lattice-visualizer",
  area: "music-theory",
  kind: "visualization-tool",
  status: "live",
  featured: true,
  year: "2025",
  summary:
    "An interactive 3D lattice for exploring just-intonation ratios through prime factors.",
  description:
    "An interactive React and Three.js visualization that represents musical ratios as points in a spatial lattice. Each ratio is positioned according to its prime-factor structure, making it possible to compare intervals, chords, and harmonic regions visually.",
  role:
    "Designer and developer responsible for the ratio logic, 3D rendering, interaction controls, lattice modes, and explanatory framing.",
  context:
    "In just intonation, musical intervals can be understood as frequency ratios, and those ratios can be decomposed into prime factors. A lattice makes those relationships spatial: moving in one direction can correspond to powers of 3, another to powers of 5, another to powers of 7, and so on.",
  problem:
    "Prime-factor relationships are central to many theories of just intonation, but they are difficult to compare when they appear only as fractions or cents values. The project needed a way to make those relationships visible, navigable, and adjustable in real time.",
  approach: [
    "Built a React interface for exploring ratio sets in an interactive 3D environment.",
    "Used Three.js to render ratios as points in a spatial lattice with adjustable scale, rotation, and layout.",
    "Mapped ratios to coordinates through prime-factor decomposition, allowing harmonic relationships to appear as spatial relationships.",
    "Added multiple lattice modes for moving between focused local views and broader harmonic regions.",
    "Created controls for changing the visual layout without separating the diagram from the underlying theoretical model.",
  ],
  outcome:
    "The tool provides an exploratory model of harmonic space where just-intonation ratios can be compared as both numerical relationships and spatial structures.",
  tags: [
    "React",
    "JavaScript",
    "Three.js",
    "SVG",
    "Just Intonation",
    "3D Visualization",
    "Music Theory",
  ],
  image: "/assets/lattice.png",
  links: [
    {
      label: "Live tool",
      href: "https://amusictheorist-just-intonation-tools.netlify.app/lattice",
    },
    {
      label: "Source code",
      href: "https://github.com/amusictheorist/just_intonation_tools",
    },
  ],
};