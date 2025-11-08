/**
 * Validators for data structures and AI-generated code
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate multi-dataset format for charts
 */
export function validateMultiDatasetFormat(data: any): ValidationResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Data must be an object' };
  }

  if (!Array.isArray(data.labels)) {
    return { valid: false, error: 'labels must be an array' };
  }

  if (!Array.isArray(data.datasets)) {
    return { valid: false, error: 'datasets must be an array' };
  }

  if (data.datasets.length === 0) {
    return { valid: false, error: 'datasets cannot be empty' };
  }

  for (let i = 0; i < data.datasets.length; i++) {
    const dataset = data.datasets[i];
    
    if (!dataset.name || typeof dataset.name !== 'string') {
      return { valid: false, error: `Dataset ${i} must have a name` };
    }

    if (!Array.isArray(dataset.values)) {
      return { valid: false, error: `Dataset ${i} values must be an array` };
    }

    if (dataset.values.length !== data.labels.length) {
      return { valid: false, error: `Dataset ${i} values length must match labels length` };
    }

    if (!dataset.values.every((v: any) => typeof v === 'number')) {
      return { valid: false, error: `Dataset ${i} values must all be numbers` };
    }
  }

  return { valid: true };
}

/**
 * Validate single dataset format for charts
 */
export function validateSingleDatasetFormat(data: any): ValidationResult {
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Data must be an array' };
  }

  if (data.length === 0) {
    return { valid: false, error: 'Data cannot be empty' };
  }

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    
    if (!item || typeof item !== 'object') {
      return { valid: false, error: `Item ${i} must be an object` };
    }

    const hasLabel = 'label' in item || 'x' in item || 'date' in item;
    const hasValue = 'value' in item || 'y' in item || 'price' in item;

    if (!hasLabel) {
      return { valid: false, error: `Item ${i} must have a label field (label, x, or date)` };
    }

    if (!hasValue) {
      return { valid: false, error: `Item ${i} must have a value field (value, y, or price)` };
    }
  }

  return { valid: true };
}

/**
 * Sanitize AI-generated component code
 * Removes potentially dangerous patterns
 */
export function sanitizeComponentCode(code: string): ValidationResult {
  const dangerousPatterns = [
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /XMLHttpRequest/gi,
    /fetch\s*\(/gi,
    /import\s+.*\s+from/gi,
    /require\s*\(/gi,
    /window\./gi,
    /document\./gi,
    /localStorage/gi,
    /sessionStorage/gi,
    /indexedDB/gi,
    /__proto__/gi,
    /constructor\s*\(/gi,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        valid: false,
        error: `Code contains potentially dangerous pattern: ${pattern.source}`,
      };
    }
  }

  // Check for basic React component structure
  if (!code.includes('function') && !code.includes('=>')) {
    return {
      valid: false,
      error: 'Code must contain a function or arrow function',
    };
  }

  return { valid: true };
}

/**
 * Validate component config object
 */
export function validateComponentConfig(config: any): ValidationResult {
  if (!config) {
    return { valid: true }; // Config is optional
  }

  if (typeof config !== 'object') {
    return { valid: false, error: 'Config must be an object' };
  }

  // Validate colors array if present
  if (config.colors && !Array.isArray(config.colors)) {
    return { valid: false, error: 'colors must be an array' };
  }

  // Validate theme
  const validThemes = ['default', 'vibrant', 'minimal', 'dark'];
  if (config.theme && !validThemes.includes(config.theme)) {
    return { valid: false, error: `theme must be one of: ${validThemes.join(', ')}` };
  }

  // Validate size
  const validSizes = ['sm', 'md', 'lg'];
  if (config.size && !validSizes.includes(config.size)) {
    return { valid: false, error: `size must be one of: ${validSizes.join(', ')}` };
  }

  // Validate grouping
  const validGroupings = ['grouped', 'stacked'];
  if (config.grouping && !validGroupings.includes(config.grouping)) {
    return { valid: false, error: `grouping must be one of: ${validGroupings.join(', ')}` };
  }

  return { valid: true };
}

/**
 * Validate entire AgentResponse object
 */
export function validateAgentResponse(response: any): ValidationResult {
  if (!response || typeof response !== 'object') {
    return { valid: false, error: 'Response must be an object' };
  }

  if (!response.componentType || typeof response.componentType !== 'string') {
    return { valid: false, error: 'componentType is required and must be a string' };
  }

  if (response.textResponse !== undefined && typeof response.textResponse !== 'string') {
    return { valid: false, error: 'textResponse must be a string' };
  }

  // Validate config if present
  if (response.config) {
    const configValidation = validateComponentConfig(response.config);
    if (!configValidation.valid) {
      return configValidation;
    }
  }

  return { valid: true };
}

