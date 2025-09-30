import { useState, useEffect } from 'react';

const STORAGE_KEY = 'elevenlabs-config';

export interface ElevenLabsConfig {
  agentId: string;
  apiKey?: string; // Optional for future use
}

export const useElevenLabsConfig = () => {
  const [config, setConfig] = useState<ElevenLabsConfig>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse ElevenLabs config from localStorage:', error);
      }
    }
    return { agentId: '' };
  });

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  const updateConfig = (newConfig: Partial<ElevenLabsConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const clearConfig = () => {
    setConfig({ agentId: '' });
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    config,
    updateConfig,
    clearConfig,
    hasAgentId: Boolean(config.agentId),
  };
};
