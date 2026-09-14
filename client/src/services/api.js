/**
 * API Service Client for CodePilot Backend
 */
const BASE_URL = "/api";

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.error || data.message || `API error with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
}

export const api = {
  async reviewCode(code, language) {
    const response = await fetch(`${BASE_URL}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    });
    return handleResponse(response);
  },

  async debugCode(code, language, errorMessage = "") {
    const response = await fetch(`${BASE_URL}/debug`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, errorMessage })
    });
    return handleResponse(response);
  },

  async optimizeCode(code, language) {
    const response = await fetch(`${BASE_URL}/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    });
    return handleResponse(response);
  },

  async generateTests(code, language) {
    const response = await fetch(`${BASE_URL}/tests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    });
    return handleResponse(response);
  },

  async askChat(code, language, userQuestion) {
    const response = await fetch(`${BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, userQuestion })
    });
    return handleResponse(response);
  },

  async getHealth() {
    try {
      const response = await fetch(`${BASE_URL}/health`);
      return await response.json();
    } catch {
      return { status: "offline", apiKeyConfigured: false };
    }
  }
};
