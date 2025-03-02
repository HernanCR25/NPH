export interface Route {
  title: string;
  path: string;
  icon?: string;
  children?: Route[];
}
