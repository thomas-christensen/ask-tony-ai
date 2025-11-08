'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import type { Widget, ContainerConfig } from '@/lib/widget-schema';

interface ContainerWidgetProps {
  config: ContainerConfig;
  children: Widget[];
  renderWidget: (widget: Widget) => React.ReactNode;
}

export function ContainerWidget({ config, children, renderWidget }: ContainerWidgetProps) {
  const [activeTab, setActiveTab] = useState(config.labels?.[0] || '0');

  if (config.variant === 'tabs') {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-lg bg-muted/20 overflow-hidden p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full gap-1" style={{ gridTemplateColumns: `repeat(${children.length}, 1fr)` }}>
              {children.map((_, index) => {
                const label = config.labels?.[index] || `Tab ${index + 1}`;
                return (
                  <TabsTrigger key={index} value={label} className="text-sm">
                    {label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {children.map((child, index) => {
              const label = config.labels?.[index] || `Tab ${index + 1}`;
              return (
                <TabsContent key={index} value={label} className="mt-4 space-y-4">
                  {renderWidget(child)}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </motion.div>
    );
  }

  if (config.variant === 'accordion') {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-lg bg-muted/20 overflow-hidden p-6">
          <Accordion type="single" collapsible defaultValue={config.defaultExpanded ? "0" : undefined} className="space-y-2">
            {(children || []).map((child, index) => {
              const label = config.labels?.[index] || `Section ${index + 1}`;
              return (
                <AccordionItem key={index} value={String(index)} className="border-none bg-muted/30 rounded-lg px-4">
                  <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                    {label}
                  </AccordionTrigger>
                  <AccordionContent className="pt-4">
                    {renderWidget(child)}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </motion.div>
    );
  }

  if (config.variant === 'card-with-sections') {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="rounded-lg bg-muted/20 overflow-hidden">
          <div className="p-0">
            {(children || []).map((child, index) => (
              <div key={index}>
                {index > 0 && <Separator />}
                <div className="p-6">
                  {config.labels?.[index] && (
                    <h3 className="font-semibold text-sm mb-3">{config.labels[index]}</h3>
                  )}
                  {renderWidget(child)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default: simple card wrapper
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rounded-lg bg-muted/20 overflow-hidden">
        <div className="space-y-4 p-6">
          {(children || []).map((child, index) => (
            <div key={index}>
              {renderWidget(child)}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

