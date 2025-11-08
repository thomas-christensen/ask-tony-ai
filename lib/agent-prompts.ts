/**
 * Agent Prompts - Re-exports for backward compatibility
 * 
 * This file now re-exports from widget-prompts.ts
 * The old code generation prompts have been replaced with widget generation prompts
 */

export {
  PLANNER_PROMPT,
  DATA_PROMPT,
  DATA_GENERATION_PROMPT,
  WIDGET_GENERATION_PROMPT as RENDERER_PROMPT
} from './widget-prompts';

// Legacy export for backward compatibility
export const CRITIC_PROMPT = `Deprecated - No longer used in widget-based system`;
export const getRendererPrompt = () => 'Deprecated - Use WIDGET_GENERATION_PROMPT instead';
