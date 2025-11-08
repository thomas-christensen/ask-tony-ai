"use client";

import { motion } from "framer-motion";
import { ComponentConfig } from "@/lib/agent-wrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

interface ComparisonRow {
  feature: string;
  option1: string;
  option2: string;
  winner?: 1 | 2 | null;
}

interface ComparisonTableProps {
  data: ComparisonRow[];
  config?: ComponentConfig;
}

export const ComparisonTable = ({ data, config = {} }: ComparisonTableProps) => {
  if (!data || data.length === 0) {
    return null;
  }

  const highlightDifferences = config.highlightDifferences ?? true;
  const showWinner = config.showWinner ?? true;
  const variant = config.variant || "default";
  const color1 = config.colors?.[0] || "#0ea5e9";
  const color2 = config.colors?.[1] || "#22c55e";

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Feature
                </TableHead>
                <TableHead
                  className="text-xs font-semibold uppercase tracking-wider text-center"
                  style={{ color: color1 }}
                >
                  Option 1
                </TableHead>
                <TableHead
                  className="text-xs font-semibold uppercase tracking-wider text-center"
                  style={{ color: color2 }}
                >
                  Option 2
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => {
                const isDifferent =
                  highlightDifferences && row.option1 !== row.option2;

                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TableCell className="text-sm font-medium text-foreground">
                      {row.feature}
                    </TableCell>
                    <TableCell
                      className={`text-sm text-center ${
                        isDifferent && row.winner === 1
                          ? "font-semibold"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          showWinner && row.winner === 1
                            ? `${color1}15`
                            : "transparent",
                        color:
                          isDifferent && row.winner === 1
                            ? color1
                            : undefined,
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {showWinner && row.winner === 1 && (
                          <span className="text-base">✓</span>
                        )}
                        <span className="text-foreground">
                          {row.option1}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-sm text-center ${
                        isDifferent && row.winner === 2
                          ? "font-semibold"
                          : ""
                      }`}
                      style={{
                        backgroundColor:
                          showWinner && row.winner === 2
                            ? `${color2}15`
                            : "transparent",
                        color:
                          isDifferent && row.winner === 2
                            ? color2
                            : undefined,
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {showWinner && row.winner === 2 && (
                          <span className="text-base">✓</span>
                        )}
                        <span className="text-foreground">
                          {row.option2}
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

