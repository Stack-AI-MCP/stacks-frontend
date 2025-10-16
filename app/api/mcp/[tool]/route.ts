import type { NextRequest } from "next/server";
import { ChatSDKError } from "@/lib/errors";

// MCP Server configuration
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:3001";
const MCP_SERVER_TOKEN = process.env.MCP_SERVER_TOKEN;

// Mock data for development/testing
const mockResponses: Record<string, any> = {
  arkadiko_get_swap_pair: {
    success: true,
    data: {
      tokenX: "wstx-token",
      tokenY: "usda-token", 
      lpToken: "arkadiko-swap-token-wstx-token-usda-token",
      name: "WSTX-USDA",
      reserveX: "1000000000",
      reserveY: "2000000000",
      totalSupply: "1500000000"
    },
    message: "Retrieved swap pair wstx-token/usda-token"
  },
  arkadiko_get_vault_info: {
    success: true,
    data: {
      id: 1,
      owner: "SP1...",
      collateralType: "wstx-token",
      collateralAmount: "1000000000",
      debtAmount: "500000000",
      collateralizationRatio: "200.00",
      liquidationPrice: "1.50",
      status: "active"
    },
    message: "Retrieved vault info"
  },
  arkadiko_get_stake_info: {
    success: true,
    data: {
      staker: "SP1...",
      amount: "1000000000",
      reward: "50000000",
      cooldownPeriod: 144
    },
    message: "Retrieved stake info"
  }
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ tool: string }> }
) {
  try {
    const { tool } = await params;
    const body = await request.json();

    // Validate tool name
    if (!tool) {
      return new ChatSDKError(
        "bad_request:api",
        "Tool name is required"
      ).toResponse();
    }

    // For development, return mock data
    if (process.env.NODE_ENV === "development" || !MCP_SERVER_TOKEN) {
      const mockResponse = mockResponses[tool];
      if (mockResponse) {
        console.log(`[MCP API] Using mock response for tool: ${tool}`);
        return Response.json(mockResponse);
      } else {
        return new ChatSDKError(
          "not_found:api",
          `Tool '${tool}' not found in mock responses`
        ).toResponse();
      }
    }

    // TODO: Implement actual MCP server connection
    // This would connect to the running MCP server instance
    const mcpResponse = await fetch(`${MCP_SERVER_URL}/tools/${tool}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MCP_SERVER_TOKEN}`,
      },
      body: JSON.stringify(body)
    });

    if (!mcpResponse.ok) {
      throw new Error(`MCP server error: ${mcpResponse.statusText}`);
    }

    const data = await mcpResponse.json();
    return Response.json(data);

  } catch (error) {
    const { tool } = await params;
    console.error(`Error in MCP API bridge for tool ${tool}:`, error);
    return new ChatSDKError(
      "offline:api",
      `Failed to execute tool ${tool}: ${error instanceof Error ? error.message : 'Unknown error'}`
    ).toResponse();
  }
}
