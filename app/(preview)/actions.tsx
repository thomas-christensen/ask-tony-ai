"use server";

import { queryAgent } from "@/lib/agent-wrapper";
import type { WidgetResponse } from "@/lib/widget-schema";

export const sendMessage = async (message: string): Promise<WidgetResponse> => {
  try {
    // Query the cursor agent
    const response = await queryAgent(message);
    return response;
  } catch (error) {
    console.error("Error in sendMessage:", error);

    // Return error response
    return {
      error: true,
      textResponse: "Sorry, I encountered an error processing your request. Please try again.",
    };
  }
};
