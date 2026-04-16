import client from './client';

export const casesService = {
  getAll:       (params) => client.get('/cases', { params }),
  getById:      (id)     => client.get(`/cases/${id}`),
  track:        (code)   => client.get(`/cases/track/${code}`),
  submit:       (data)   => client.post('/cases', data),
  updateStatus: (id, d)  => client.patch(`/cases/${id}/status`, d),
};
