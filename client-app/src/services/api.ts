import type { QcProtocolDto } from '../types/protocol';
import type { QuizDto } from '../types/quiz';
import type { LabExperimentDto } from '../types/lab';
import type { AiScenarioDto } from '../types/ai';

const API_BASE = '/api';

function getActiveLanguage(lang?: string): string {
  if (lang) return lang;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('i18nextLng') || 'en';
  }
  return 'en';
}

function getHeaders(lang?: string): HeadersInit {
  return {
    'Accept-Language': getActiveLanguage(lang),
    'Content-Type': 'application/json'
  };
}

export const apiService = {
  async getProtocols(frequency?: string, lang?: string): Promise<QcProtocolDto[]> {
    const l = getActiveLanguage(lang);
    let url = `${API_BASE}/qcprotocols?lang=${encodeURIComponent(l)}`;
    if (frequency) {
      url += `&frequency=${encodeURIComponent(frequency)}`;
    }
    const response = await fetch(url, { headers: getHeaders(l) });
    if (!response.ok) {
      throw new Error(`Failed to fetch protocols: ${response.statusText}`);
    }
    return response.json();
  },

  async getProtocolById(id: string, lang?: string): Promise<QcProtocolDto> {
    const l = getActiveLanguage(lang);
    const response = await fetch(`${API_BASE}/qcprotocols/${id}?lang=${encodeURIComponent(l)}`, {
      headers: getHeaders(l)
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch protocol: ${response.statusText}`);
    }
    return response.json();
  },

  async getQuizzes(category?: string, lang?: string): Promise<QuizDto[]> {
    const l = getActiveLanguage(lang);
    let url = `${API_BASE}/quizzes?lang=${encodeURIComponent(l)}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    const response = await fetch(url, { headers: getHeaders(l) });
    if (!response.ok) {
      throw new Error(`Failed to fetch quizzes: ${response.statusText}`);
    }
    return response.json();
  },

  async getQuizById(id: string, lang?: string): Promise<QuizDto> {
    const l = getActiveLanguage(lang);
    const response = await fetch(`${API_BASE}/quizzes/${id}?lang=${encodeURIComponent(l)}`, {
      headers: getHeaders(l)
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz: ${response.statusText}`);
    }
    return response.json();
  },

  async getLabs(lang?: string): Promise<LabExperimentDto[]> {
    const l = getActiveLanguage(lang);
    const response = await fetch(`${API_BASE}/labs?lang=${encodeURIComponent(l)}`, {
      headers: getHeaders(l)
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch labs: ${response.statusText}`);
    }
    return response.json();
  },

  async getAiScenarios(lang?: string): Promise<AiScenarioDto[]> {
    const l = getActiveLanguage(lang);
    const response = await fetch(`${API_BASE}/aiscenarios?lang=${encodeURIComponent(l)}`, {
      headers: getHeaders(l)
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch AI scenarios: ${response.statusText}`);
    }
    return response.json();
  }
};
