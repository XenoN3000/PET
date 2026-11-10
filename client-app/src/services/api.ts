import type { QcProtocolDto } from '../types/protocol';
import type { QuizDto } from '../types/quiz';

const API_BASE = '/api';

export const apiService = {
  async getProtocols(frequency?: string): Promise<QcProtocolDto[]> {
    const url = frequency ? `${API_BASE}/qcprotocols?frequency=${encodeURIComponent(frequency)}` : `${API_BASE}/qcprotocols`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch protocols: ${response.statusText}`);
    }
    return response.json();
  },

  async getProtocolById(id: string): Promise<QcProtocolDto> {
    const response = await fetch(`${API_BASE}/qcprotocols/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch protocol: ${response.statusText}`);
    }
    return response.json();
  },

  async getQuizzes(category?: string): Promise<QuizDto[]> {
    const url = category ? `${API_BASE}/quizzes?category=${encodeURIComponent(category)}` : `${API_BASE}/quizzes`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch quizzes: ${response.statusText}`);
    }
    return response.json();
  },

  async getQuizById(id: string): Promise<QuizDto> {
    const response = await fetch(`${API_BASE}/quizzes/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch quiz: ${response.statusText}`);
    }
    return response.json();
  }
};
