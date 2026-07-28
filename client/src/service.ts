import { API_URL } from "./config";

const sendApiRequest = async <T>(
  endpoint: string,
  method: string,
  body?: Record<string, unknown> | FormData,
): Promise<{ data: T; redirectToLogin: boolean;  } | { error: string; redirectToLogin: boolean; }> => {
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
      return { data: {} as T, redirectToLogin: true };
    }

    const jsonResponse = await response.json();

    if (response.status < 200 || response.status > 299) {
      throw new Error(`Bad response ${response.status}`);
    }
    
    return { data: jsonResponse, redirectToLogin: false };
  } catch(err) {
    console.error(err);
    return { error: 'Unexpected API error occurred', redirectToLogin: false };
  }
};

export { sendApiRequest };
