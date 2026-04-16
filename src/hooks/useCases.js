import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesService } from '../api/cases.service';

export function useCases(filters = {}) {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn:  () => casesService.getAll(filters),
    // After interceptor: payload = { cases: [...] }
    // Access in components as: data?.cases
  });
}

export function useCase(id) {
  return useQuery({
    queryKey: ['case', id],
    queryFn:  () => casesService.getById(id),
    enabled:  !!id,
    // Access as: data?.case
  });
}

export function useSubmitCase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: casesService.submit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cases'] }),
    // Response: { case: { id, tracking_code, ... } }
  });
}