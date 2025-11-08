"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CubeIcon } from "@/components/icons";

export function BackButton() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBackClick = () => {
    setIsNavigating(true);
    router.push("/");
  };

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex flex-row gap-2 items-center"
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-muted-foreground"
              >
                <CubeIcon />
              </motion.div>
              <div className="text-base text-muted-foreground animate-shimmer-text">
                Loading home...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={handleBackClick}
        disabled={isNavigating}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-0 p-0 font-inherit"
      >
        ← Back to home
      </button>
    </>
  );
}

