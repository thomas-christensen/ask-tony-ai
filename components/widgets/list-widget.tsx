'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import NumberFlow from '@number-flow/react';
import { cn } from '@/lib/utils';
import type { ListData, Interaction } from '@/lib/widget-schema';

interface ListWidgetProps {
  data: ListData;
  interactions?: Interaction[];
}

export function ListWidget({ data, interactions }: ListWidgetProps) {
  const [filterText, setFilterText] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

  const hasFilterInteraction = interactions?.some(i => i.type === 'filter');
  const hasSortInteraction = interactions?.some(i => i.type === 'sort');

  const processedItems = useMemo(() => {
    let items = [...(data.items || [])];

    // Filter
    if (hasFilterInteraction && filterText) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(filterText.toLowerCase()) ||
        item.description?.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sort
    if (hasSortInteraction && sortOrder !== 'default') {
      items.sort((a, b) => {
        const comparison = a.title.localeCompare(b.title);
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    return items;
  }, [data.items, filterText, sortOrder, hasFilterInteraction, hasSortInteraction]);

  const toggleSort = () => {
    setSortOrder(prev => {
      if (prev === 'default') return 'asc';
      if (prev === 'asc') return 'desc';
      return 'default';
    });
  };

  return (
    <div className="w-full p-6 space-y-4">
      {(data.title || data.subtitle || hasFilterInteraction || hasSortInteraction) && (
        <div className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            {data.title && (
              <h3 className="text-base font-semibold tracking-tight">{data.title}</h3>
            )}
            {data.subtitle && (
              <p className="text-sm text-muted-foreground">{data.subtitle}</p>
            )}
          </div>
          {(hasFilterInteraction || hasSortInteraction) && (
            <div className="flex items-center gap-2">
              {hasSortInteraction && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSort}
                  className="h-8 w-8 p-0"
                >
                  {sortOrder === 'default' && <Icons.ArrowUpDown className="h-4 w-4" />}
                  {sortOrder === 'asc' && <Icons.ArrowUp className="h-4 w-4" />}
                  {sortOrder === 'desc' && <Icons.ArrowDown className="h-4 w-4" />}
                </Button>
              )}
            </div>
          )}
        </div>
      )}
      {hasFilterInteraction && (
        <div className="relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Filter items..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="space-y-3">
        {processedItems.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No items found
          </div>
        ) : (
          processedItems.map((item, index) => {
            const IconComponent = item.icon ? (Icons as any)[item.icon] : null;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                {IconComponent && (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    {item.badge && (
                      <Badge variant="secondary" className="flex-shrink-0">
                        {typeof item.badge === 'number' ? (
                          <NumberFlow value={item.badge} />
                        ) : (
                          item.badge
                        )}
                      </Badge>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  )}
                  {item.value && (
                    <p className="text-sm font-medium mt-1">
                      {typeof item.value === 'number' ? (
                        <NumberFlow value={item.value} />
                      ) : (
                        item.value
                      )}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}

