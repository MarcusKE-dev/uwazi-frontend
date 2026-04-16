export const ROUTES = {
  LOGIN:        '/login',
  REGISTER:     '/register',
  DASHBOARD:    '/dashboard',
  CASES:        '/cases',
  CASE_DETAIL:  (id) => `/cases/${id}`,
  SUBMIT_CASE:  '/cases/submit',
  TRACK:        '/track',
  ANALYTICS:    '/analytics',
  ADMIN:        '/admin',
  NOT_FOUND:    '*',
  // Future: FORGOT_PASSWORD, RESET_PASSWORD — add when backend builds these
};