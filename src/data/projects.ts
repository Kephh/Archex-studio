export type ProjectStatus = 'live' | 'reserved';

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  label: string;
  route: string | null;
  indexable: boolean;
}

export const projects: Project[] = [
  {
    id: 'archex-web',
    title: 'Archex Web',
    status: 'live',
    label: 'First project',
    route: '/archex-web/',
    indexable: false,
  },
  {
    id: 'reserved-01',
    title: 'Future work',
    status: 'reserved',
    label: 'Future position 01',
    route: null,
    indexable: false,
  },
  {
    id: 'reserved-02',
    title: 'Future work',
    status: 'reserved',
    label: 'Future position 02',
    route: null,
    indexable: false,
  },
  {
    id: 'reserved-03',
    title: 'Future work',
    status: 'reserved',
    label: 'Future position 03',
    route: null,
    indexable: false,
  },
];
