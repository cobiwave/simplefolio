import type { Project } from "../types";

export const ermic: Project = {
  title: "ERMiC Online Biographical Dictionary",
  slug: "ermic-online-biographical-dictionary",
  area: "development",
  kind: "research-database",
  status: "live",
  featured: true,
  year: "2025",
  summary:
    "A React and Contentful biographical dictionary for European refugee musicians in Canada.",
  description:
    "A public research website for the European Refugee Musicians in Canada project. The site lets readers browse and search structured biographical entries, making a large body of scholarly content easier to navigate online.",
  role:
    "Web developer responsible for the React application, Contentful data model, search and browse interfaces, frontend architecture, testing setup, deployment, and support for the project team’s editorial workflow.",
  context:
    "ERMiC documents European refugee musicians who settled in Canada and contributed to Canadian musical life. The project needed a public-facing website that could present biographical research clearly while remaining manageable for editors and researchers working in the CMS.",
  problem:
    "The main challenge was to turn a structured research dataset into a usable public resource. Readers needed simple ways to find people, browse entries, and move through related information, while the project team needed a maintainable content workflow behind the site.",
  approach: [
    "Built a React application for browsing, searching, and displaying structured biographical entries.",
    "Modelled the content in Contentful so researchers could manage entries through a CMS rather than editing code.",
    "Fetched data from Contentful’s GraphQL API and shaped it for frontend search, filtering, and navigation.",
    "Created reusable frontend utilities and state-management patterns for rendering large sets of interconnected records.",
    "Added Jest tests around key frontend logic to make the application easier to maintain.",
    "Supported the research team’s editorial workflow by helping translate scholarly content into structured web data.",
  ],
  outcome:
    "The project launched as a public online biographical dictionary with a searchable interface, a maintainable CMS backend, and a structure that allows the research team to continue adding and editing entries.",
  tags: [
    "React",
    "JavaScript",
    "Contentful",
    "GraphQL",
    "Tailwind CSS",
    "Jest",
    "Research Databases",
  ],
  image: "/assets/ermic.png",
  links: [
    {
      label: "Project details",
      href: "/projects/ermic-online-biographical-dictionary",
    },
    {
      label: "Live site",
      href: "https://ermic.ca",
    },
    {
      label: "Source code",
      href: "https://github.com/amusictheorist/ERMiC",
    },
  ],
};