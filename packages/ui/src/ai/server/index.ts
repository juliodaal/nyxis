/**
 * Server-only exports for `nyxis-ui/ai`. Import from `nyxis-ui/ai/server`
 * inside route handlers / loaders / actions. None of these run in the
 * browser; the bundle is intentionally separate from the client surface.
 */
export {
  createChatHandler,
  createCompletionHandler,
  type CreateChatHandlerOptions,
} from './create-chat-handler.js';

export { createModel, type CreateModelOptions } from '../adapters/create-model.js';
