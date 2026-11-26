export interface NavbarLink {
  id: string;
  label: string;
  route: string | null;
  queryParams?: Record<string, string>;
}
