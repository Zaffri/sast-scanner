import { Link, useNavigate } from 'react-router'
import PageHeader from '../components/PageHeader'
import { useEffect, useState } from 'react'
import { sendApiRequest } from '../service';
import { PROJECT_STATUS_MAPPING } from '../constants';
import type { Project } from '../types/shared';

function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    sendApiRequest<Project[]>('/project/', 'GET').then((response) => {
      console.log(response);

      if (response.redirectToLogin) {
        navigate('/login');
        return;
      }

      if ('error' in response) {
        // TODO: show user feedback
        return;
      }

      setProjects(response.data);
    });
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <PageHeader
        title='Your projects'
        button={
          <Link to="/project/new">
            <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors">
              New project
            </button>
          </Link>
        }
      />

      <div className="h-full rounded-xl flex items-center justify-center">

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-6">Name</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Issues found</th>
                <th className="py-3 px-6 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
              {projects.map((project) => (
                <tr className="hover:bg-gray-50/50 transition-colors" key={project.id}>
                  <td className="py-4 px-6 font-medium text-gray-900">{project.project_name}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PROJECT_STATUS_MAPPING[project.status].style}`}>
                      {PROJECT_STATUS_MAPPING[project.status].label}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-mono text-gray-600">{project.checks.length}</td>
                  <td className="py-4 px-6 text-right font-mono text-gray-600">
                    <Link to={`/project/${project.id}`}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default ProjectList
