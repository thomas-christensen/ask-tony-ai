"use client";

import { motion } from "framer-motion";
import { Markdown } from "./markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CodeView = ({
  language,
  code,
}: {
  language: string;
  code: string;
}) => {
  if (!code) {
    return null;
  }

  // Format as markdown code block
  const markdownCode = `\`\`\`${language}\n${code}\n\`\`\``;

  return (
    <motion.div
      className="md:max-w-[452px] max-w-[calc(100dvw-80px)] w-full pb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-semibold text-muted-foreground">
            {language}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[300px]">
            <div className="p-3">
              <Markdown>{markdownCode}</Markdown>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
};

