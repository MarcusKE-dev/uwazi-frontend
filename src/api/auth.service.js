import client from './client';

export const authService = {
  // POST /auth/register → payload: { user, accessToken }
  register: (data)  => client.post('/auth/register', data),

  // POST /auth/login → payload: { user, accessToken }
  login:    (data)  => client.post('/auth/login', data),

  // POST /auth/logout (requires Bearer token)
  logout:   ()      => client.post('/auth/logout'),

  // GET /auth/me → payload: { user }
  me:       ()      => client.get('/auth/me'),

  // NOTE: forgot-password, reset-password, verify-email are NOT in MVP backend
  // Do not call those endpoints — they return 404. Add them in a future phase.
};