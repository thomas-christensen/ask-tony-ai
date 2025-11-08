import { cursor } from './cursor-agent';
import {
  PLANNER_PROMPT,
  DATA_PROMPT,
  DATA_GENERATION_PROMPT,
  WIDGET_GENERATION_PROMPT
} from './widget-prompts';
import {
  validateWidgetSchema,
  validatePlanSchema,
  validateDataSchema,
  validateWidgetData
} from './widget-validator';
import { extractJSON } from './json-extractor';
import type { Widget, WidgetResponse, PlanResult, DataResult } from './widget-schema';
import { agentLogger } from './agent-logger';

export async function queryAgentStream(
  userMessage: string,
  onUpdate: (update: any) => void,
  model?: string
): Promise<void> {
  try {
    const modelToUse = model || process.env.CURSOR_MODEL || 'composer-1';
    
    onUpdate({ 
      type: 'progress', 
      phase: 'planning', 
      message: 'Thinking',
      progress: 10
    });
    
    const plan = await planWidget(userMessage, modelToUse);
    agentLogger.info('Plan generated', { step: 'planning', details: plan });

    const planValidation = validatePlanSchema(plan);
    if (!planValidation.valid) {
      throw new Error(`Invalid plan: ${planValidation.errors.join(', ')}`);
    }
    
    onUpdate({ type: 'plan', plan: planValidation.plan });
    
    let dataResult: DataResult | null = null;

    if (plan.dataSource === 'web-search') {
      agentLogger.info('Fetching web data', {
        step: 'data',
        details: { searchQuery: plan.searchQuery, widgetType: plan.widgetType }
      });
      onUpdate({
        type: 'progress',
        phase: 'searching',
        message: 'Fetching data',
        progress: 40
      });

      dataResult = await fetchData(plan, userMessage, modelToUse);
    } else {
      agentLogger.info('Generating example data', {
        step: 'data',
        details: { widgetType: plan.widgetType, dataStructure: plan.dataStructure }
      });
      onUpdate({
        type: 'progress',
        phase: 'preparing',
        message: 'Generating data',
        progress: 40
      });

      dataResult = await generateMockData(plan, userMessage, modelToUse);
    }
    
    agentLogger.info('Data ready', { step: 'data', details: dataResult });

    const dataValidation = validateDataSchema(dataResult);
    if (!dataValidation.valid) {
      agentLogger.warn(
        `Data validation reported ${dataValidation.errors.length} issue(s)`,
        { step: 'data', details: dataValidation.errors }
      );
    }
    
    onUpdate({ type: 'data', dataResult });
    
    onUpdate({ 
      type: 'progress', 
      phase: 'generating', 
      message: 'Generating UI',
      progress: 70
    });
    
    const widget = await generateWidget(plan, dataResult, userMessage, modelToUse);
    agentLogger.info('Widget generated', { step: 'widget', details: widget });

    onUpdate({ 
      type: 'progress', 
      phase: 'validating', 
      message: 'Validating',
      progress: 90
    });
    
    const widgetValidation = validateWidgetSchema(widget);
    if (!widgetValidation.valid) {
      throw new Error(`Widget validation failed: ${widgetValidation.errors.join(', ')}`);
    }
    
    const dataCheck = validateWidgetData(widgetValidation.widget!);
    if (!dataCheck.valid) {
      agentLogger.warn(
        `Widget data validation reported ${dataCheck.errors.length} issue(s)`,
        { step: 'validation', details: dataCheck.errors }
      );
    }
    
    onUpdate({
      type: 'complete',
      response: {
        widget: widgetValidation.widget,
        source: dataResult?.source || null
      }
    });
    
  } catch (error) {
    agentLogger.error('Agent orchestration failed', {
      step: 'orchestration',
      details: error
    });
    onUpdate({
      type: 'complete',
      response: {
        textResponse: error instanceof Error ? error.message : 'Error generating widget',
        error: true
      }
    });
  }
}

async function planWidget(query: string, model: string): Promise<PlanResult> {
  const result = await cursor.generateStream({
    prompt: query,
    systemPrompt: PLANNER_PROMPT,
    model,
    force: true
  });
  
  if (!result.success) {
    throw new Error('Planning failed: ' + (result.error || 'Unknown error'));
  }
  
  return extractJSON(result.finalText);
}

async function fetchData(plan: PlanResult, query: string, model: string): Promise<DataResult> {
  const promptWithContext = DATA_PROMPT
    .replace('{widgetType}', plan.widgetType)
    .replace('{dataStructure}', plan.dataStructure);
  
  const result = await cursor.generateStreamWithCallback({
    prompt: `Extract structured data for: ${query}\nSearch query: ${plan.searchQuery}`,
    systemPrompt: promptWithContext,
    model,
    force: true
  }, (event) => {
    if (event.type === 'tool_call' && event.subtype === 'started') {
      agentLogger.info('Web search started', { step: 'data' });
    }
  });
  
  if (!result.success) {
    agentLogger.warn('Data fetching failed; using fallback', {
      step: 'data',
      details: result.error
    });
    return {
      data: {},
      source: null,
      confidence: 'low'
    };
  }
  
  return extractJSON(result.finalText);
}

async function generateMockData(plan: PlanResult, query: string, model: string): Promise<DataResult> {
  const promptWithContext = DATA_GENERATION_PROMPT
    .replace('{widgetType}', plan.widgetType)
    .replace('{dataStructure}', plan.dataStructure);
  
  const result = await cursor.generateStream({
    prompt: `Generate realistic data for: "${query}"
Widget type: ${plan.widgetType}
Key entities: ${plan.keyEntities.join(', ')}`,
    systemPrompt: promptWithContext,
    model,
    force: true
  });
  
  if (!result.success) {
    agentLogger.warn('Mock data generation failed; using empty fallback', {
      step: 'data',
      details: result.error
    });
    return {
      data: {},
      source: null,
      confidence: 'low'
    };
  }
  
  return extractJSON(result.finalText);
}

async function generateWidget(
  plan: PlanResult, 
  data: DataResult | null, 
  query: string, 
  model: string
): Promise<Widget> {
  const result = await cursor.generateStream({
    prompt: `USER: "${query}"
Widget type: ${plan.widgetType}
Data structure: ${plan.dataStructure}
Available data: ${JSON.stringify(data?.data || {})}

Generate a widget JSON configuration that displays this data.`,
    systemPrompt: WIDGET_GENERATION_PROMPT,
    model,
    force: true
  });
  
  if (!result.success) {
    throw new Error('Widget generation failed: ' + (result.error || 'Unknown error'));
  }
  
  return extractJSON(result.finalText);
}

/**
 * Legacy function for backward compatibility
 */
export async function queryAgent(
  userMessage: string,
  model?: string
): Promise<WidgetResponse> {
  return new Promise((resolve) => {
    queryAgentStream(userMessage, (update) => {
      if (update.type === 'complete') {
        resolve(update.response);
      }
    }, model);
  });
}

