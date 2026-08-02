import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

function createServer() {
	const server = new McpServer({
		name: "Financial Test",
		version: "1.0.0",
	});

	server.registerTool(
		"financial_test",
		{
			description:
				"Receive pre-calculated financial data from FinSight AI for financial analysis and summarization.",

			inputSchema: z.object({
				metadata: z.object({
					source: z.string(),
					companyName: z.string(),
					selectedPeriod: z.string(),
					calculatedAt: z.string(),
				}),

				metrics: z.object({
					period: z.string(),
					revenue: z.number(),
					netIncome: z.number(),
					grossMarginPct: z.number(),
					operatingMarginPct: z.number(),
					totalAssets: z.number(),
					totalDebt: z.number(),
					debtToEquityRatio: z.number(),
					interestExpense: z.number(),
					currentRatio: z.number(),
					workingCapital: z.number(),
					operatingCashFlow: z.number(),
					capex: z.number(),
					freeCashFlow: z.number(),
					peRatio: z.number(),
					marketCap: z.number(),
				}),

				historicalSeries: z.array(
					z.object({
						period: z.string(),
						revenue: z.number(),
						netIncome: z.number(),
						operatingCashFlow: z.number(),
						debtToEquity: z.number(),
						operatingMargin: z.number(),
					}),
				),

				query: z.string().optional(),
			}),
		},

		async ({ metadata, metrics, historicalSeries, query }) => {
			const financialData = {
				metadata,
				metrics,
				historicalSeries,
				query:
					query ||
					"Provide a professional financial summary of the supplied FinSight calculated data.",
			};

			return {
				content: [
					{
						type: "text",
						text: JSON.stringify(financialData, null, 2),
					},
				],
			};
		},
	);

	return server;
}

const handler = createMcpHandler(createServer);

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return handler(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
