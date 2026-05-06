import type { Project } from "../types";

export const cognitive: Project = {
  title: "Cognitive Learning Tools Website",
  slug: "cognitive-learning-tools",
  area: "development",
  kind: "static-site",
  status: "in-progress",
  featured: true,
  year: "2026",
  summary:
    "A responsive Astro website for a private practice supporting children, teens, and families.",
  description:
    "A static website for Cognitive Learning Tools, a private practice offering educational and developmental support services. The site is built with Astro and Tailwind CSS and is designed around clear navigation, accessible service descriptions, and a maintainable content structure.",
  role:
    "Web developer responsible for site structure, page templates, responsive layout, navigation, reusable Astro components, content organization, SEO metadata, and Netlify deployment setup.",
  context:
    "The practice needed a professional website that could explain its services clearly to parents, caregivers, and families without overwhelming visitors with clinical or overly promotional language.",
  problem:
    "The main challenge was to organize a large amount of service information in a way that felt approachable, specific, and easy to navigate. The site also needed to work well on mobile, support future content updates, and guide visitors toward booking a consultation.",
  approach: [
    "Built the site with Astro and Tailwind CSS for a fast, maintainable static architecture.",
    "Created reusable layout components for page introductions, calls to action, service sections, program pages, headers, and footers.",
    "Organized the site around visitor needs, including services, programs, supported audiences, and consultation booking.",
    "Designed responsive navigation and page layouts that work across desktop and mobile screen sizes.",
    "Refined the content structure so detailed service information could be presented clearly without making pages feel dense.",
    "Added SEO metadata and deployment configuration for a controlled soft launch.",
  ],
  outcome:
    "The project is in progress as a polished static website with a reusable component system, clearer content architecture, responsive layouts, and a structure ready for launch on Netlify.",
  tags: [
    "Astro",
    "Tailwind CSS",
    "Netlify",
    "Static Site",
    "Responsive Design",
    "SEO",
  ],
  image: "/assets/cognitive-learning-tools.png",
};