import { useNavigate, useParams } from 'react-router'
import PageHeader from '../components/PageHeader';
import { useEffect, useMemo, useRef, useState } from 'react';
import { sendApiRequest } from '../service';
import { FINDING_STATUS_MAPPING, POLLING_DELAY, PROJECT_STATUS_MAPPING } from '../constants';
import type { Project } from '../types/shared';
import { formatDateTime } from '../utils';

function ProjectView() {
  const params = useParams()
  const navigate = useNavigate();
  const uploadId = params['id'];
  const [project, setProject] = useState<Project | undefined>(undefined);
  const isFetching = useRef(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      const response = await sendApiRequest<Project>(`/project/${uploadId}/`, 'GET')

      if (response.redirectToLogin) {
        navigate('/login');
        return;
      }

      if ('error' in response) {
        // TODO: show user feedback
        return;
      }

      setProject(response.data);
      isFetching.current = false;
    };

    fetchProjectData();
    const intervalId = setInterval(fetchProjectData, POLLING_DELAY);
    return () => clearInterval(intervalId);
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    const defaultCounts = {
      low: 0,
      medium: 0,
      high: 0,
    };

    if (!project) return defaultCounts;

    return project?.checks.reduce((acc, check) => {
      if (check.impact_severity === 'LOW') acc.low++;
      if (check.impact_severity === 'MEDIUM') acc.medium++;
      if (check.impact_severity === 'HIGH') acc.high++;
      return acc;
    }, defaultCounts);
  }, [project]);

  const scanTimeInSeconds = useMemo(() => {
    if (!project?.scanned_at || !project?.uploaded_at) return '-';
    const uploadedAt = new Date(project.uploaded_at);
    const scannedAt = new Date(project.scanned_at);
    const millisecondDifference = scannedAt.getTime() - uploadedAt.getTime();
    const seconds = millisecondDifference / 1000;

    return `${seconds.toFixed(2)} seconds`;
  }, [project?.scanned_at, project?.uploaded_at]);
  
  if (!uploadId) return 'Invalid request!';
  if (!project) return 'loading...';

  return (
    <>
      <PageHeader title='Summary' />

      <div className="mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 pb-4">
              <h2 className="font-bold text-gray-900">{project.project_name}</h2>

              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${PROJECT_STATUS_MAPPING[project.status].style}`}>
                {PROJECT_STATUS_MAPPING[project.status].label}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 pb-4">Uploaded at: {formatDateTime(project.uploaded_at)}</p>
            <p className="text-sm text-gray-500 mt-1 pb-4">Scan duration: {scanTimeInSeconds}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-red-100 text-red-800 border border-red-400 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-red-800 uppercase tracking-wider">High Severity</p>
                <p className="text-2xl font-bold mt-1">{counts.high}</p>
              </div>
            </div>

            <div className="bg-amber-100 text-amber-600 border border-amber-400 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Medium Severity</p>
                <p className="text-2xl font-bold mt-1">{counts.medium}</p>
              </div>
            </div>

            <div className="bg-blue-100 text-blue-700 border border-blue-400 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Low Severity</p>
                <p className="text-2xl font-bold mt-1">{counts.low}</p>
              </div>
            </div>
          </div>

          {/* <button type="button" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Refresh Status
            </button> */}
        </div>

        {project.status === 'PENDING'&& (
          <div className="bg-white px-6 py-4 border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-center p-6">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>

            <p className="text-center animate-pulse">Your upload is being processed...</p>
          </div>
        )}

        {project.status !== 'PENDING' && (
          <Findings project={project} />
        )}
      </div>
    </>
  )
}

type FindingsProps = { project: Project };

function Findings({ project }: FindingsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <h2 className="text-lg font-semibold text-gray-900">Findings</h2>
        <span className="text-xs font-medium px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full">{project.checks.length} Findings</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
              <th className="py-3 px-6">Severity</th>
              <th className="py-3 px-6">Finding Type</th>
              <th className="py-3 px-6">File</th>
              {/* TODO: <th className="py-3 px-6">Line(s)</th> */}
              {/** TODO: future addition - add expand arrow for showing snippet of code affected */}
              {/* <th className="py-3 px-6 text-right">Actions</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {project.checks.map((check) => (
              <tr className="hover:bg-gray-50/50 transition-colors" key={check.id}>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${FINDING_STATUS_MAPPING[check.impact_severity].style}`}>
                    {FINDING_STATUS_MAPPING[check.impact_severity].label}
                  </span>
                </td>
                <td className="py-4 px-6 font-medium text-gray-900">{check.check_name}</td>
                <td className="py-4 px-6 font-mono text-xs text-gray-600">{check.found_in_file}</td>
                {/* <td className="py-4 px-6 font-mono text-xs text-gray-600">10-12</td> */}
                {/* <td className="py-4 px-6 text-right">
                  <button type="button" className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Details</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProjectView
