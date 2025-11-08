"use client";

import { OptionABasic } from "./loaders/option-a-basic";

interface ProgressiveSkeletonProps {
  stage: number;
  plan: any;
  dataResult: any;
  userQuery: string;
}

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

