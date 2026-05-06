import type { Project } from "../../data/projects";

export const statusLabels: Record<Project["status"], string> = {
live: "Live",
  "in-progress": "In progress",
  archived: "Archived",
  unstable: "Unstable",
};

export const kindLabels: Record<Project["kind"], string> = {
  "research-database": "Research database",
  "web-application": "Web application",
  "visualization-tool": "Visualization tool",
  "static-site": "Static site",
  "music-theory-tool": "Music theory tool",
};

export function getProjectAreaLabel(area: Project['area']) {
  return area === 'development' ? 'Development' : 'Music Theory';
}