import type { Project } from "../types";

export const sonataDatabase: Project = {
  title: "19th-Century Sonata Forms Research Database",
  slug: "sonata-forms-database",
  area: "development",
  kind: "research-database",
  status: "in-progress",
  featured: true,
  year: "2026",
  summary:
    "A React and Contentful research platform for browsing, editing, and producing sonata-form analyses.",
  description:
    "A full-stack research database for Theorizing Sonata Form in European Concert Music, 1815-1914, a project focused on a large corpus of nineteenth-century sonata forms. I am rebuilding the database as a modern web application so the project can preserve its existing analytical data, make that data easier to search, and continue producing new analyses.",
  role:
    "Full-stack developer responsible for the React frontend, Contentful data model, metadata editing workflows, protected authoring tools, authentication, API routes, and deployment infrastructure.",
  context:
    "The original research project analyzes sonata forms in European instrumental music between 1815 and 1914. The database needs to serve both as a public research resource and as an internal authoring environment for analysts, editors, and project administrators.",
  problem:
    "The project has to represent detailed music-theoretical analysis, bibliographic metadata, and editorial status in a way that is searchable, maintainable, and usable by people with different roles. It also has to support future analytical work rather than simply preserve a static archive.",
  approach: [
    "Structured the data around normalized entities including compositions, composers, places, publishers, users, analyses, and analytical sections.",
    "Built React views for browsing compositions, filtering large result sets, and navigating relationships between metadata and analyses.",
    "Developed admin interfaces for editing metadata records while preserving the links between entities and analytical content.",
    "Used Contentful as the content backend and routed write operations through Netlify Functions to keep management tokens off the client.",
    "Implemented Auth0-based authentication and authorization for protected authoring and editorial workflows.",
    "Separated public browsing, metadata editing, and analysis-authoring flows so the application can grow without becoming one large admin interface.",
  ],
  outcome:
    "The project is becoming a maintainable research platform: a public database for exploring nineteenth-century sonata-form analyses and a protected workspace for creating, editing, and reviewing new analytical data.",
  tags: [
    "React",
    "TypeScript",
    "Contentful",
    "Netlify Functions",
    "Auth0",
    "Research Databases",
    "Structured Data",
  ],
  image: '/assets/19csf.png',
};