import { calculator } from './projects/calculator';
import { cognitive } from './projects/cognitive';
import { ermic } from './projects/ermic';
import { lattice } from './projects/lattice';
import { somers } from './projects/somers';
import { sonataDatabase } from './projects/sonataDatabase';
import { spiral } from './projects/spiral';
import { tonnetz } from './projects/tonnetz';
import type { Project } from './types';

export type {
  Project,
  ProjectArea,
  ProjectKind,
  ProjectStatus
} from './types';

export const projects: Project[] = [
  sonataDatabase,
  ermic,
  spiral,
  lattice,
  tonnetz,
  somers,
  calculator,
  cognitive
];