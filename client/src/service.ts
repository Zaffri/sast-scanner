import { API_URL } from "./config";

const sendApiRequest = async (
  endpoint: string,
  method: string,
  body?: Record<string, unknown> | FormData,
) => {
  try {
    let requestBody;
    let headers: Record<string, string> = {};

    if (body) {
      const isFormData = body instanceof FormData;
      requestBody = isFormData ? body : JSON.stringify(body);

      if (!isFormData) headers['Content-Type'] = 'application/json';
    }

    const config = {
      method: method,
      headers,
      Credential: true,
      ...(requestBody && { body: requestBody })
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const jsonResponse = await response.json(); 
    
    return jsonResponse;
  } catch(err) {
    console.error(err);
    return { error: 'Unexpected API error occurred' };
  }
};

export { sendApiRequest };
