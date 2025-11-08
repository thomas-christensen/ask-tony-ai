'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';
import type { FormData, FormField } from '@/lib/widget-schema';

interface FormWidgetProps {
  data: FormData;
  config?: { formType?: 'calculator' | 'converter' | 'input'; submitLabel?: string };
}

export function FormWidget({ data, config }: FormWidgetProps) {
  const [values, setValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    (data.fields || []).forEach(field => {
      initial[field.name] = field.defaultValue ?? (field.type === 'toggle' ? false : '');
    });
    return initial;
  });

  const [result, setResult] = useState<number | string | null>(null);

  // Auto-calculate for calculator type
  useEffect(() => {
    if (config?.formType === 'calculator' && data.calculation) {
      try {
        // Simple calculation evaluation (in production, use a proper expression parser)
        let expression = data.calculation;
        Object.entries(values).forEach(([key, value]) => {
          expression = expression.replace(new RegExp(key, 'g'), String(value || 0));
        });
        
        // Safe evaluation for basic math
        const calculated = Function(`"use strict"; return (${expression})`)();
        setResult(calculated);
      } catch (error) {
        console.error('Calculation error:', error);
        setResult(null);
      }
    }
  }, [values, data.calculation, config?.formType]);

  const updateValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'slider':
        return (
          <div key={field.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor={field.name}>{field.label}</Label>
              <span className="text-sm font-medium">{values[field.name]}</span>
            </div>
            <Slider
              id={field.name}
              value={[values[field.name] || field.min || 0]}
              onValueChange={([value]) => updateValue(field.name, value)}
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
            />
          </div>
        );

      case 'toggle':
        return (
          <div key={field.name} className="flex items-center justify-between">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Switch
              id={field.name}
              checked={values[field.name] || false}
              onCheckedChange={(checked) => updateValue(field.name, checked)}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Select
              value={values[field.name] || ''}
              onValueChange={(value) => updateValue(field.name, value)}
            >
              <SelectTrigger id={field.name}>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type="number"
              value={values[field.name] || ''}
              onChange={(e) => updateValue(field.name, parseFloat(e.target.value) || 0)}
              min={field.min}
              max={field.max}
              step={field.step}
            />
          </div>
        );

      case 'text':
      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              type="text"
              value={values[field.name] || ''}
              onChange={(e) => updateValue(field.name, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="w-full p-6 space-y-4">
      {(data.title || data.subtitle) && (
        <div className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            {data.title && (
              <h3 className="text-base font-semibold tracking-tight">{data.title}</h3>
            )}
            {data.subtitle && (
              <p className="text-sm text-muted-foreground">{data.subtitle}</p>
            )}
          </div>
        </div>
      )}
      <div className="space-y-4">
          {(data.fields || []).map(field => renderField(field))}

          {result !== null && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-6 pt-6 border-t border-border"
            >
              <div className="rounded-lg bg-primary/5 p-6 text-center space-y-2">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {data.resultLabel || 'Result'}
                </div>
                <div className="text-5xl font-bold text-primary">
                  {typeof result === 'number' ? (
                    <>
                      {data.resultPrefix && <span className="text-3xl mr-1">{data.resultPrefix}</span>}
                      <NumberFlow 
                        value={result} 
                        format={{ 
                          minimumFractionDigits: data.resultDecimals ?? 2,
                          maximumFractionDigits: data.resultDecimals ?? 2
                        }} 
                      />
                      {data.resultSuffix && <span className="text-3xl ml-1">{data.resultSuffix}</span>}
                    </>
                  ) : (
                    result
                  )}
                </div>
                {data.resultDescription && (
                  <div className="text-sm text-muted-foreground pt-2">
                    {data.resultDescription}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        {config?.formType === 'input' && (
          <Button className="w-full">
            {config.submitLabel || 'Submit'}
          </Button>
        )}
      </div>
    </div>
  );
}

