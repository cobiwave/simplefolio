import type { Project } from "../types";

export const somers: Project = {
  title: "Harry Somers at 100 Symposium Website",
  slug: "harry-somers-symposium",
  area: "development",
  kind: "static-site",
  status: "live",
  featured: true,
  year: "2025",
  summary:
    "A static event website for a symposium commemorating Harry Somers, held at the University of Toronto.",
  description:
    "A responsive Eleventy and Tailwind CSS website for Harry Somers at 100: Reflections on His Life and Legacy, a University of Toronto symposium marking the centennial of Canadian composer Harry Somers.",
  role:
    "Web developer responsible for the site structure, page templates, responsive layout, registration flow, Netlify form handling, deployment, and ongoing content updates.",
  context:
    "The symposium needed a clear public website where visitors could find event details, read about the program, register, access resources, and navigate between the academic symposium and related recital information.",
  problem:
    "The site had to present practical event information clearly while remaining easy to update as the schedule, registration details, and program materials changed.",
  approach: [
    "Built a static Eleventy site with reusable templates for event pages and shared layout elements.",
    "Used Tailwind CSS to create a responsive design that works well for schedules, text-heavy pages, and mobile navigation.",
    "Set up Netlify deployment and form handling for registration submissions and notifications.",
    "Organized the site around practical visitor tasks: learning about the event, checking the schedule, registering, finding recital details, and accessing resources.",
  ],
  outcome:
    "The site launched as a lightweight public event website with clear navigation, registration support, and a structure that could be updated as symposium information changed.",
  tags: [
    "Eleventy",
    "Tailwind CSS",
    "Netlify",
    "Static Site",
    "Responsive Design",
  ],
  image: "/assets/somers.png",
  links: [
    {
      label: "Live site",
      href: "https://harry-somers-symposium.netlify.app",
    },
    {
      label: "Source code",
      href: "https://github.com/amusictheorist/harry-somers-symposium",
    },
  ],
};