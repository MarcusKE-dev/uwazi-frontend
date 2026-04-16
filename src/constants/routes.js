export const ROUTES = {
  LOGIN:           '/login',
  REGISTER:        '/register',
  FORGOT_PASSWORD: '/forgot-password',
  DASHBOARD:       '/dashboard',
  ANALYTICS:       '/analytics',
  CASES:           '/cases',
  SUBMIT_CASE:     '/cases/submit',
  CASE_DETAIL:     (id) => `/cases/${id}`,
  TRACK:           '/track',
  ADMIN:           '/admin',
};
