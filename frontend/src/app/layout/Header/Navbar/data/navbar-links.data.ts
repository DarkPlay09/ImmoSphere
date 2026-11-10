import type { NavbarLink } from '../models/navbar-links.model';

export const NAVBAR_LINKS: NavbarLink[] = [
  {
    id: 'buy',
    label: 'Acheter',
    route: '/properties',
    queryParams: { transaction: 'sale' },
  },
  {
    id: 'rent',
    label: 'Louer',
    route: '/properties',
    queryParams: { transaction: 'rent' },
  },
  {
    id: 'agencies',
    label: 'Agences',
    route: null,
  },
  {
    id: 'notaries',
    label: 'Notaires',
    route: null,
  },
  {
    id: 'services',
    label: 'Services',
    route: null,
  },
];
