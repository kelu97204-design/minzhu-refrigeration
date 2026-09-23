// Keep public assets valid on both a root domain and GitHub project Pages.
export const asset = (path) => import.meta.env.BASE_URL + path.replace(/^\//, '');
