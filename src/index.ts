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
			description: "Analyze financial data provided by the user.",
			inputSchema: z.object({
				financial_data: z.string().describe(
					"The financial data or information to analyze"
				),
			}),
		},
		async ({ financial_data }) => ({
			content: [
				{
					type: "text",
					text: `Financial data received for analysis: ${financial_data}`,
				},
			],
		}),
	);

	return server;
}

const handler = createMcpHandler(createServer);

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return handler(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
