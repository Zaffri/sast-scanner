export type Check = {
  id: number;
  check_name: string;
  impact_severity: 'HIGH' | 'MEDIUM' | 'LOW';
  found_in_file: string;
  upload: number;
};

export type Project = {
  id: number;
  user: number;
  file_name: string;
  project_name: string;
  original_file_name: string;
  status: 'REJECTED' | 'PENDING' | 'PROCESSED';
  checks: Check[];
  uploaded_at: string;
  scanned_at: string;
};
