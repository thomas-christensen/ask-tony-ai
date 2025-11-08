"use client";

import { OptionABasic } from "./loaders/option-a-basic";

interface ProgressiveSkeletonProps {
  stage: number;
  plan: any;
  dataResult: any;
  userQuery: string;
}

/**
 * Progressive Skeleton Loader
 * 
 * Renders a shimmer skeleton with dynamic morphing layouts that evolve
 * through loading stages, then seamlessly transitions to the final UI.
 * 
 * Stage progression:
 * 1. Generic random layout (analyzing/planning)
 * 2. Different random layout (after planning) - morphs smoothly
 * 3. Intent-based layout (after data fetching) - morphs to match component type
 */
export function ProgressiveSkeleton({
  stage,
  plan,
  dataResult,
  userQuery,
}: ProgressiveSkeletonProps) {
  return (
    <OptionABasic 
      stage={stage}
      plan={plan}
      dataResult={dataResult}
      userQuery={userQuery}
    />
  );
}

