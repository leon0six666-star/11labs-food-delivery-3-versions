import { useState, useEffect } from 'react';

const STORAGE_KEY = 'elevenlabs-config';

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export interface ElevenLabsConfig {
  agentId: string;
  apiKey?: string; // Optional for future use
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Agent ID validation - ElevenLabs Agent IDs are typically 20 characters alphanumeric
export const validateAgentId = (agentId: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!agentId || agentId.trim().length === 0) {
    errors.push('Agent ID is required');
    return { isValid: false, errors, warnings };
  }

  const trimmed = agentId.trim();

  // Check length
  if (trimmed.length < 15) {
    errors.push('Agent ID seems too short (expected ~20 characters)');
  } else if (trimmed.length > 30) {
    errors.push('Agent ID seems too long (expected ~20 characters)');
  } else if (trimmed.length !== 20) {
    warnings.push(`Agent ID length is ${trimmed.length} characters (typically 20)`);
  }

  // Check format - should be alphanumeric
  if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
    errors.push('Agent ID should only contain letters and numbers');
  }

  // Check for common mistakes
  if (trimmed.includes(' ')) {
    errors.push('Agent ID should not contain spaces');
  }

  if (trimmed.toLowerCase() === 'your_agent_id_here' || trimmed.toLowerCase() === 'agent_id') {
    errors.push('Please replace with your actual ElevenLabs Agent ID');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// API Key validation (optional)
export const validateApiKey = (apiKey?: string): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!apiKey || apiKey.trim().length === 0) {
    // API Key is optional, so empty is valid
    return { isValid: true, errors, warnings };
  }

  const trimmed = apiKey.trim();

  // ElevenLabs API keys typically start with 'xi_'
  if (!trimmed.startsWith('xi_')) {
    warnings.push('ElevenLabs API keys typically start with "xi_"');
  }

  if (trimmed.length < 10) {
    errors.push('API Key seems too short');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

export const useElevenLabsConfig = () => {
  const [storageAvailable] = useState(isLocalStorageAvailable());
  const [config, setConfig] = useState<ElevenLabsConfig>(() => {
    // Initialize from localStorage if available
    if (!storageAvailable) {
      console.warn('localStorage is not available. Configuration will not persist.');
      return { agentId: '' };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to parse ElevenLabs config from localStorage:', error);
    }
    return { agentId: '' };
  });

  // Save to localStorage whenever config changes (if available)
  useEffect(() => {
    if (!storageAvailable) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save config to localStorage:', error);
    }
  }, [config, storageAvailable]);

  const updateConfig = (newConfig: Partial<ElevenLabsConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const clearConfig = () => {
    setConfig({ agentId: '' });
    if (storageAvailable) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (error) {
        console.error('Failed to clear config from localStorage:', error);
      }
    }
  };

  return {
    config,
    updateConfig,
    clearConfig,
    hasAgentId: Boolean(config.agentId),
    storageAvailable, // Expose storage availability to components
  };
};
