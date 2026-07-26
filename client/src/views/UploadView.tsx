import { useParams } from 'react-router'
import PageHeader from '../components/PageHeader';

function UploadView() {
  const params = useParams()
  const uploadId = params['id']

  if (!uploadId) return 'Invalid request!';

  return (
    <>
      <PageHeader title='Summary' />

      <div className="mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 pb-4">
              <h2 className="font-bold text-gray-900">Upload Name ({ uploadId })</h2>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                Processing
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1 pb-4">Started: July 26, 2026 at 00:00 AM</p>
            <p className="text-sm text-gray-500 mt-1 pb-4">Scan duration: 35 seconds</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">High Severity</p>
                <p className="text-2xl font-bold mt-1">1</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Medium Severity</p>
                <p className="text-2xl font-bold mt-1">1</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Low Severity</p>
                <p className="text-2xl font-bold mt-1">1</p>
              </div>
            </div>
          </div>

          {/* <button type="button" className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
              Refresh Status
            </button> */}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">Findings</h2>
            <span className="text-xs font-medium px-2.5 py-1 bg-gray-200 text-gray-700 rounded-full">3 Findings</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="py-3 px-6">Severity</th>
                  <th className="py-3 px-6">Finding Type</th>
                  <th className="py-3 px-6">File</th>
                  <th className="py-3 px-6">Line(s)</th>
                  {/** TODO: future addition - add expand arrow for showing snippet of code affected */}
                  {/* <th className="py-3 px-6 text-right">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      HIGH
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">type...</td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-600">/folder-1/file.js</td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-600">10-12</td>
                  {/* <td className="py-4 px-6 text-right">
                    <button type="button" className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Details</button>
                  </td> */}
                </tr>

                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      MEDIUM
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">type...</td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-600">/folder-1/file.js</td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-600">10-12</td>
                  {/* <td className="py-4 px-6 text-right">
                    <button type="button" className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Details</button>
                  </td> */}
                </tr>

                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      LOW
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">type...</td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-600">/folder-1/file.js</td>
                  <td className="py-4 px-6 font-mono text-xs text-gray-600">10-12</td>
                  {/* <td className="py-4 px-6 text-right">
                    <button type="button" className="text-blue-600 hover:text-blue-800 font-medium text-xs">View</button>
                  </td> */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadView
