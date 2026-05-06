/**
 * Phase H — Model Context Protocol (MCP) primitives.
 *
 * Visual surface for the MCP ecosystem: configured servers, their
 * connection lifecycle, exposed capabilities, resources, prompts, and
 * the JSON-RPC log stream. Pair with any client that speaks the MCP
 * spec — the components are render-only and don't dictate the
 * underlying transport implementation.
 */

export * from './mcp-capability-badge/index.js';
export * from './mcp-connection-status/index.js';
export * from './mcp-server-card/index.js';
export * from './mcp-server-list/index.js';
export * from './mcp-resource-browser/index.js';
export * from './mcp-prompt-library/index.js';
export * from './mcp-log-stream/index.js';
