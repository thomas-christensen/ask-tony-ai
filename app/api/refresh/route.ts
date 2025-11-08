import { NextRequest, NextResponse } from "next/server";
import { fetchData, generateMockData } from "@/lib/agent-wrapper";
import { queryMockDatabase } from "@/lib/mock-database";
import { rateLimiter } from "@/lib/rate-limiter";
import type { PlanResult } from "@/lib/widget-schema";

export async function POST(request: NextRequest) {
  try {
    const { plan, query, dataMode, widgetId } = await request.json();

    if (!plan || !query || !widgetId) {
      return NextResponse.json(
        { error: "Missing required fields: plan, query, widgetId" },
        { status: 400 }
      );
    }

    const ip = request.headers.get("x-forwarded-for") ||
                request.headers.get("x-real-ip") ||
                "unknown";

    if (!rateLimiter.checkIPLimit(ip)) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many refresh requests from this IP. Limit: 100 per hour."
        },
        { status: 429 }
      );
    }

    const widgetCheck = rateLimiter.checkWidgetLimit(widgetId);
    if (!widgetCheck.allowed) {
      return NextResponse.json(
        {
          error: "Widget refresh limit exceeded",
          message: widgetCheck.reason,
          paused: true
        },
        { status: 429 }
      );
    }

    const typedPlan = plan as PlanResult;
    const model = process.env.CURSOR_MODEL || 'composer-1';

    let dataSource = typedPlan.dataSource;
    if (dataMode === 'web-search') {
      dataSource = 'web-search';
    } else if (dataMode === 'example-data') {
      dataSource = 'example-data';
    } else if (dataMode === 'mock-database') {
      dataSource = 'mock-database';
    }

    let dataResult;
    switch (dataSource) {
      case 'mock-database':
        console.debug('Refreshing with mock database', { query });
        dataResult = await queryMockDatabase(typedPlan, query, model);
        break;
      case 'web-search':
        console.debug('Refreshing with web search', { query });
        dataResult = await fetchData(typedPlan, query, model);
        break;
      case 'example-data':
      default:
        console.debug('Refreshing with example data', { query });
        dataResult = await generateMockData(typedPlan, query, model);
        break;
    }

    const refreshedAt = new Date().toISOString();

    return NextResponse.json({
      data: dataResult.data,
      source: dataResult.source,
      confidence: dataResult.confidence,
      refreshedAt,
      remainingRefreshes: rateLimiter.getRemainingRefreshes(widgetId)
    });

  } catch (error) {
    console.error("Refresh endpoint error:", error);
    return NextResponse.json(
      { 
        error: "Refresh failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

