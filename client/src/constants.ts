import type { Check, Project } from './types/shared';

export const PROJECT_STATUS_MAPPING: Record<Project['status'], { label: string, style: string }> = {
  REJECTED: { label: 'Rejected', style: 'bg-red-100 text-red-800' },
  PENDING: { label: 'Pending', style: 'bg-amber-100 text-amber-800' },
  PROCESSED: { label: 'Processed', style: 'bg-green-100 text-green-800' },
};

export const FINDING_STATUS_MAPPING: Record<Check['impact_severity'], { label: string, style: string }> = {
  LOW: { label: 'Low', style: 'bg-blue-100 text-blue-800' },
  MEDIUM: { label: 'Medium', style: 'bg-amber-100 text-amber-800' },
  HIGH: { label: 'High', style: 'bg-red-100 text-red-800' },
};

export const POLLING_DELAY = 2000;
