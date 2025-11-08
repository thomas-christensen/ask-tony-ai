"use client";

import { useRef, useState, useEffect } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import { Message } from "@/components/message";
import { useScrollToBottom } from "@/components/use-scroll-to-bottom";
import { motion } from "framer-motion";
import { MasonryIcon, VercelIcon, CubeIcon } from "@/components/icons";
import Link from "next/link";
import { ModelSelector } from "@/components/model-selector";
import { DataModeToggle, type DataMode } from "@/components/data-mode-toggle";
import { renderWidgetResponse } from "@/lib/widget-renderer";
import type { DataResult, PlanResult, WidgetResponse } from "@/lib/widget-schema";
import { LoadingState } from "@/lib/loading-states";
import { LoadingIndicator } from "@/components/loading-indicator";
import { ProgressiveSkeleton } from "@/components/progressive-skeleton";
import { generateAnswerId } from "@/lib/answer-utils";
import { sendMessage } from "./actions";
import type { StoredAnswerRecord } from "@/lib/answer-store";

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: WidgetResponse;
  plan?: PlanResult | null;
  query?: string;
  dataMode?: 'web-search' | 'example-data';
  answerId?: string;
}

type AgentEvent = {
  message: string;
  timestamp: number;
};

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Array<MessageItem>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('composer-1');
  const [dataMode, setDataMode] = useState<DataMode | undefined>(undefined);

  const [planInfo, setPlanInfo] = useState<PlanResult | null>(null);
  const [dataInfo, setDataInfo] = useState<DataResult | null>(null);
  const [currentQuery, setCurrentQuery] = useState<string>("");

  const [agentEvents, setAgentEvents] = useState<AgentEvent[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const modelParam = searchParams.get('model');
    const dataModeParam = searchParams.get('dataMode');
    
    if (modelParam) {
      setSelectedModel(modelParam);
    }
    if (dataModeParam === 'web-search' || dataModeParam === 'example-data') {
      setDataMode(dataModeParam);
    }
  }, []);

  useEffect(() => {
    try {
      const savedMessages = sessionStorage.getItem('conversation-messages');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load saved messages:', e);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      try {
        sessionStorage.setItem('conversation-messages', JSON.stringify(messages));
      } catch (e) {
        console.warn('Failed to save messages to sessionStorage:', e);
      }
    }
  }, [messages]);


  const suggestedActions = [
    {
      title: "Show me",
      label: "our MRR growth over time",
      action: "Show me our MRR growth over time",
    },
    {
      title: "Display",
      label: "total active users by plan",
      action: "How many active users do we have by plan type?",
    },
    {
      title: "Compare",
      label: "user growth this month",
      action: "Show me user growth this month",
    },
    {
      title: "Analyze",
      label: "our most used features",
      action: "What are our most used features?",
    },
  ];

  const handleSubmit = async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);
    setLoadingState({ phase: 'analyzing', message: 'Understanding your question', progress: 5, subtext: 'Analyzing intent and requirements' });

    setPlanInfo(null);
    setDataInfo(null);
    setCurrentQuery(userMessage);
    setAgentEvents([]);

    setMessages((prevMessages: MessageItem[]) => [
      ...prevMessages,
      { id: `user-${Date.now()}`, role: "user", content: userMessage },
    ]);
    setInput("");

    try {
      const response = await fetch("/api/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage, model: selectedModel, dataMode }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No reader available");
      }

      let finalResponse: WidgetResponse | null = null;
      let capturedPlan: PlanResult | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === "progress") {
                setLoadingState(data);
              } else if (data.type === "agent_event") {
                setAgentEvents((prevEvents: AgentEvent[]) => [...prevEvents, { message: data.message, timestamp: data.timestamp }]);
              } else if (data.type === "plan" && data.plan) {
                setPlanInfo(data.plan as PlanResult);
                capturedPlan = data.plan as PlanResult;
              } else if (data.type === "data" && data.dataResult) {
                setDataInfo(data.dataResult as DataResult);
              } else if (data.type === "complete" && data.response) {
                finalResponse = data.response;
              } else if (data.type === "error") {
                throw new Error(data.message);
              }
            } catch (e) {
              console.warn("Failed to parse SSE data:", e);
            }
          }
        }
      }

      if (finalResponse) {
        let answerIdFromServer: string | null = null;
        let storedAnswerRecord: StoredAnswerRecord | null = null;

        try {
          const storeResponse = await fetch("/api/answers/store", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              payload: {
                query: userMessage,
                response: finalResponse,
                plan: capturedPlan,
                dataMode,
              },
            }),
          });

          if (storeResponse.ok) {
            const storeData = await storeResponse.json();
            if (storeData && typeof storeData.answerId === "string") {
              answerIdFromServer = storeData.answerId;
            }
            if (storeData && storeData.answer && typeof storeData.answer === "object") {
              storedAnswerRecord = storeData.answer as StoredAnswerRecord;
            }
          } else {
            console.warn("Failed to persist answer on server:", await storeResponse.text());
          }
        } catch (error) {
          console.warn("Error calling /api/answers/store:", error);
        }

        const answerRecord: StoredAnswerRecord =
          storedAnswerRecord ??
          ({
            id: answerIdFromServer ?? generateAnswerId(),
            query: userMessage,
            response: finalResponse,
            plan: capturedPlan ?? null,
            ...(dataMode ? { dataMode } : {}),
            createdAt: Date.now(),
          } as StoredAnswerRecord);

        try {
          sessionStorage.setItem(answerRecord.id, JSON.stringify(answerRecord));
        } catch (e) {
          console.warn('Failed to persist answer to sessionStorage:', e);
        }

        setMessages((prevMessages: MessageItem[]) => [
          ...prevMessages,
          { 
            id: `assistant-${Date.now()}`, 
            role: "assistant", 
            content: "", 
            response: finalResponse,
            plan: answerRecord.plan,
            query: answerRecord.query,
            dataMode: answerRecord.dataMode ?? dataMode,
            answerId: answerRecord.id
          },
        ]);
      } else {
        throw new Error("No response received");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages: MessageItem[]) => [
        ...prevMessages,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          content: "",
          response: {
            textResponse: "Sorry, something went wrong. Please try again.",
            error: true
          },
        },
      ]);
    } finally {
      setIsLoading(false);
      setLoadingState(null);
      setPlanInfo(null);
      setDataInfo(null);
    }
  };

  return (    
    <div className="flex flex-row justify-center pb-20 h-dvh bg-background">
      <div className="flex flex-col justify-between">
        
        <div
          ref={messagesContainerRef}        
          className="flex flex-col gap-2 h-full w-dvw items-center overflow-y-scroll pt-16"
        >
          {messages.map((message: MessageItem, index: number) => {
            const isEndOfGroup = 
              message.role === "assistant" && 
              index < messages.length - 1 && 
              messages[index + 1].role === "user";
            
            return (
              <motion.div 
                key={message.id} 
                className={isEndOfGroup ? "mb-4" : ""}
              >
                <Message
                  role={message.role}
                  content={
                    message.response
                      ? renderWidgetResponse(message.response, message.plan, message.query, message.dataMode)
                      : message.content
                  }
                  answerId={message.answerId}
                />
              </motion.div>
            );
          })}
          {isLoading && loadingState && (
            <>
              <LoadingIndicator loadingState={loadingState} agentEvents={agentEvents} />
              {(loadingState.phase === 'designing' || 
                loadingState.phase === 'generating' || 
                loadingState.phase === 'validating' || 
                loadingState.phase === 'reviewing') && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-row gap-2 px-4 md:px-0 w-full md:w-[500px] first-of-type:pt-20"
                >
                  <div className="size-[24px] flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <ProgressiveSkeleton
                      stage={
                        loadingState.phase === 'designing' ? 1 :
                        planInfo && !dataInfo ? 2 :
                        dataInfo ? 3 : 1
                      }
                      plan={planInfo}
                      dataResult={dataInfo}
                      userQuery={currentQuery}
                    />
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2 w-full px-4 md:px-0 mx-auto md:max-w-[500px] mb-4">
          {messages.length === 0 &&
            !isLoading &&
            suggestedActions.map((action, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.01 * index }}
                key={index}
                className={index > 1 ? "hidden sm:block" : "block"}
              >
                <button
                  onClick={() => void handleSubmit(action.action)}
                  disabled={isLoading}
                  className="w-full text-left bg-muted/20 hover:bg-muted/40 text-foreground rounded-lg p-2 text-sm transition-colors flex flex-col disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-medium">{action.title}</span>
                  <span className="text-muted-foreground">
                    {action.label}
                  </span>
                </button>
              </motion.div>
            ))}
        </div>

        <form
          className="flex flex-col gap-2 relative items-center w-full"
          onSubmit={async (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            await handleSubmit(input);
          }}
        >
          <div 
            className={`
              flex flex-col w-full md:max-w-[500px] max-w-[calc(100dvw-32px)]
              border rounded-lg transition-all duration-200 cursor-text
              ${isFocused 
                ? 'bg-white dark:bg-[#2A2A2A] border-border' 
                : 'bg-background border-border'
              }
            `}
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              className="bg-transparent px-3 pt-3 pb-2 w-full outline-none text-foreground placeholder-muted-foreground disabled:opacity-50"
              placeholder="Ask anything"
              value={input}
              onChange={(event: ChangeEvent<HTMLInputElement>) => setInput(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between gap-2 px-3 pb-3">
              <div className="flex items-center gap-2" onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <ModelSelector 
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  disabled={isLoading}
                />
                <DataModeToggle
                  dataMode={dataMode}
                  onDataModeChange={setDataMode}
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2">                
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  onClick={(e: MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                  className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
