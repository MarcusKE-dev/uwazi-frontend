import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../api/analytics.service';

export function useAnalyticsStats() {
  return useQuery({
    queryKey: ['analytics-stats'],
    queryFn:  analyticsService.getStats,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCountyBreakdown() {
  return useQuery({
    queryKey: ['analytics-counties'],
    queryFn:  analyticsService.byCounty,
  });
}
