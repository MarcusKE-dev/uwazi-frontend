import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { casesService } from '../api/cases.service';

export function useCases(filters = {}) {
  return useQuery({
    queryKey: ['cases', filters],
    queryFn:  () => casesService.getAll(filters),
    placeholderData: (prev) => prev,
  });
}

export function useCase(id) {
  return useQuery({
    queryKey: ['case', id],
    queryFn:  () => casesService.getById(id),
    enabled:  !!id,
  });
}

export function useSubmitCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: casesService.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
