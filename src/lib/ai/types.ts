// =================================================================
// TRIPLE MOTIVE MINIMAL AI ABSTRACTION INTERFACE (PHASE 1)
// Provider-Agnostic Interface for Future OpenAI / Claude / Grok Routing
// =================================================================

import { AIMessage, AICompletionRequest, AICompletionResponse } from '../../types';

export interface IAIEngineAdapter {
  complete(request: AICompletionRequest): Promise<AICompletionResponse>;
}

// Lightweight Phase 1 client stub (prevents exposing keys in frontend)
export class ClientAIEngineStub implements IAIEngineAdapter {
  async complete(request: AICompletionRequest): Promise<AICompletionResponse> {
    const provider = request.provider || 'openai';
    const model = request.model || (provider === 'anthropic' ? 'claude-3-5-sonnet' : 'gpt-4o');

    // Phase 1: Local stub response for early prototyping without exposed backend routes
    return {
      content: `[Triple Motive ${provider.toUpperCase()} AI Engine] Synthesizing context for ${request.messages.length} prompts. Complete server-side pipeline will be activated in the AI milestone.`,
      provider,
      model,
      usage: {
        promptTokens: 150,
        completionTokens: 42,
      },
    };
  }
}

export const aiEngine = new ClientAIEngineStub();
