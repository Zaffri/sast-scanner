import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { sendApiRequest } from '../service';

function UploadNew() {
  const [form, setForm] = useState<{
    file: File | undefined,
    name: string
  }>({
    file: undefined,
    name: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'file' && e.target.files) {
      const file = e.target.files[0]

      setForm((prev) => ({
        ...prev,
        file
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const uploadFile = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.file || !form.name) {
      // TODO: show user feedback
      console.log('Missing form name or file');
      return;
    }

    const payload = new FormData();
    // payload.append('name', form.name); // TODO: add later
    payload.append('file_upload', form.file)

    const response = await sendApiRequest('/', 'POST', payload);

    if ('error' in response) {
      console.log(response);
    }

    // Redirect...
    // setForm({ name: '', file: undefined });
  };

  return (
    <>
      <PageHeader title='Upload codebase' />

      <form
        onSubmit={uploadFile}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>

          <input 
            type="text"
            id="name" 
            name="name" 
            placeholder="Enter upload name"
            onChange={handleInputChange}
            className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>

          <input 
            type="file" 
            id="file" 
            name="file"
            onChange={handleInputChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2.5 px-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          Submit
        </button>
      </form>
    </>
  )
}

export default UploadNew
