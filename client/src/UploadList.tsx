import { Link } from 'react-router'

function UploadList() {
  return (
    <>
      <div className="flex items-center justify-between w-full py-4">
        <h2 className="text-xl font-bold">Your uploads</h2>

        <Link to="/upload">
          <button type="button" className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-700 transition-colors">
            New upload
          </button>
        </Link>
      </div>

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
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 font-medium text-gray-900">Upload 1</td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Processed
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-mono text-gray-600">142</td>
                <td className="py-4 px-6 text-right font-mono text-gray-600">
                  View
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </>
  )
}

export default UploadList
