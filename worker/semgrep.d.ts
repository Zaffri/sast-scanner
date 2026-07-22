declare module 'semgrep-types' {
  export interface SemgrepLocation {
    line: number;
    col: number;
    offset: number;
  }

  export interface SemgrepFinding {
    check_id: string;
    path: string;
    start: SemgrepLocation;
    end: SemgrepLocation;
    extra: {
      message: string;
      severity: 'INFO' | 'WARNING' | 'ERROR';
      metadata?: {
        vulnerability_class?: string[];
        technology?: string[];
        cwe?: string[];
        owasp?: string[];
        [key: string]: unknown;
      };
      [key: string]: unknown;
    };
  }

  export interface SemgrepReport {
    results: SemgrepFinding[];
    errors: unknown[];
    paths: { scanned: string[] };
    version?: string;
  }
}