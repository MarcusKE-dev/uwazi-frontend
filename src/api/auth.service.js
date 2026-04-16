import client from './client';

export const authService = {
  register:       (data) => client.post('/auth/register', data),
  login:          (data) => client.post('/auth/login', data),
  logout:         ()     => client.post('/auth/logout'),
  refresh:        ()     => client.post('/auth/refresh'),
  forgotPassword: (data) => client.post('/auth/forgot-password', data),
  resetPassword:  (data) => client.post('/auth/reset-password', data),
  me:             ()     => client.get('/auth/me'),
};
