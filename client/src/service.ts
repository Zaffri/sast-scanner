import { API_URL } from "./config";

const sendApiRequest = async (
  endpoint: string,
  method: string,
  navigate?: Function | undefined,
  body?: Record<string, unknown> | FormData,
): Promise<Record<string, unknown> | { error: string; redirectToLogin: boolean }> => {
  try {
    let requestBody;
    let headers: Record<string, string> = {};

    if (body) {
      const isFormData = body instanceof FormData;
      requestBody = isFormData ? body : JSON.stringify(body);

      if (!isFormData) headers['Content-Type'] = 'application/json';
    }

    const config: RequestInit = {
      method: method,
      headers,
      credentials: 'include',
      ...(requestBody && { body: requestBody })
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
      // TODO: attempt refresh and req retry before login redirect
      if (navigate) navigate('/login');
    }

    const jsonResponse = await response.json(); 
    
    return {
      data: jsonResponse,
      error: response.status < 200 || response.status > 299
    };
  } catch(err) {
    console.error(err);
    return { error: 'Unexpected API error occurred', redirectToLogin: false };
  }
};

export { sendApiRequest };
