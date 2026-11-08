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
    label: 'Evidence pending',
    route: '/archex-web/',
    indexable: false,
  },
  {
    id: 'reserved-01',
    title: 'Reserved concept project 01',
    status: 'reserved',
    label: 'Reserved',
    route: null,
    indexable: false,
  },
  {
    id: 'reserved-02',
    title: 'Reserved concept project 02',
    status: 'reserved',
    label: 'Reserved',
    route: null,
    indexable: false,
  },
  {
    id: 'reserved-03',
    title: 'Reserved concept project 03',
    status: 'reserved',
    label: 'Reserved',
    route: null,
    indexable: false,
  },
];
