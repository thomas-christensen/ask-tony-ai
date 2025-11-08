import { notFound } from "next/navigation";
import { Message } from "@/components/message";
import { AnswerSessionCache } from "@/components/answer-session-cache";
import { getAnswer } from "@/lib/answer-store";
import { renderWidgetResponse } from "@/lib/widget-renderer";
import { BackButton } from "./back-button";

type AnswerPageParams = {
  params: {
    id: string;
  };
};

export default function AnswerPage({ params }: AnswerPageParams) {
  const answer = getAnswer(params.id);

  if (!answer) {
    notFound();
  }

  return (
    <div className="flex flex-row justify-center pb-20 min-h-screen bg-background">
      <AnswerSessionCache answer={answer} />

      <div className="flex flex-col w-full">
        <div className="sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="flex items-start py-3 max-w-[500px] mx-auto w-full md:w-[500px]">
            <BackButton />
          </div>
        </div>

        <div className="flex flex-col gap-2 items-center pt-16 px-4">
          <Message role="user" content={answer.query} />
          <Message
            role="assistant"
            answerId={answer.id}
            content={renderWidgetResponse(
              answer.response,
              answer.plan,
              answer.query,
              answer.dataMode
            )}
          />
        </div>
      </div>
    </div>
  );
}
