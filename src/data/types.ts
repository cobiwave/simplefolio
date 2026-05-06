export type ProjectArea = "development" | "music-theory";

export type ProjectStatus =
  | "live"
  | "in-progress"
  | "archived"
  | "unstable";

export type ProjectKind =
  | "research-database"
  | "web-application"
  | "visualization-tool"
  | "static-site"
  | "music-theory-tool";

export type Project = {
  title: string;
  slug: string;
  area: ProjectArea;
  kind: ProjectKind;
  status: ProjectStatus;
  featured: boolean;
  year: string;
  summary: string;
  description: string;
  tags: string[];
  image?: string;
  role?: string;
  context?: string;
  problem?: string;
  approach?: string[];
  outcome?: string;
  links?: {
    label: string;
    href: string;
  }[];
};