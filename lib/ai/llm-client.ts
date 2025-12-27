/**
 * LLM client wrapper for OpenAI/Anthropic
 */

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * LLM Client - Supports OpenAI and Anthropic
 */
export class LLMClient {
  private provider: "openai" | "anthropic";
  private apiKey: string;
  private baseURL?: string;

  constructor() {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:27',message:'LLMClient constructor ENTRY',data:{hasOpenAIKey:!!process.env.OPENAI_API_KEY,hasAnthropicKey:!!process.env.ANTHROPIC_API_KEY,hasOpenAIBaseURL:!!process.env.OPENAI_BASE_URL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    // Determine which provider to use
    if (process.env.OPENAI_API_KEY) {
      this.provider = "openai";
      this.apiKey = process.env.OPENAI_API_KEY;
      this.baseURL = process.env.OPENAI_BASE_URL;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:32',message:'Using OpenAI provider',data:{hasBaseURL:!!this.baseURL},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
    } else if (process.env.ANTHROPIC_API_KEY) {
      this.provider = "anthropic";
      this.apiKey = process.env.ANTHROPIC_API_KEY;
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:36',message:'Using Anthropic provider',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:38',message:'THROWING error - no API key',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      throw new Error("No LLM API key configured. Set OPENAI_API_KEY or ANTHROPIC_API_KEY");
    }
  }

  /**
   * Generate completion using configured LLM provider
   */
  async generateCompletion(
    messages: LLMMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
    }
  ): Promise<LLMResponse> {
    if (this.provider === "openai") {
      return this.generateOpenAICompletion(messages, options);
    } else {
      return this.generateAnthropicCompletion(messages, options);
    }
  }

  /**
   * Generate completion using OpenAI
   */
  private async generateOpenAICompletion(
    messages: LLMMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
    }
  ): Promise<LLMResponse> {
    const model = options?.model || "gpt-4-turbo-preview";
    const url = this.baseURL
      ? `${this.baseURL}/v1/chat/completions`
      : "https://api.openai.com/v1/chat/completions";

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:62',message:'BEFORE OpenAI API call',data:{model,url,messageCount:messages.length,hasApiKey:!!this.apiKey},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000,
      }),
    });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:88',message:'AFTER OpenAI API call',data:{responseOk:response.ok,responseStatus:response.status,responseStatusText:response.statusText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    if (!response.ok) {
      const error = await response.text();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:93',message:'OpenAI API error',data:{responseStatus:response.status,error},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/llm-client.ts:99',message:'OpenAI API success',data:{hasContent:!!data.choices?.[0]?.message?.content,contentLength:data.choices?.[0]?.message?.content?.length,hasUsage:!!data.usage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion

    return {
      content: data.choices[0]?.message?.content || "",
      usage: data.usage
        ? {
            prompt_tokens: data.usage.prompt_tokens,
            completion_tokens: data.usage.completion_tokens,
            total_tokens: data.usage.total_tokens,
          }
        : undefined,
    };
  }

  /**
   * Generate completion using Anthropic
   */
  private async generateAnthropicCompletion(
    messages: LLMMessage[],
    options?: {
      temperature?: number;
      maxTokens?: number;
      model?: string;
    }
  ): Promise<LLMResponse> {
    const model = options?.model || "claude-3-opus-20240229";

    // Convert messages format for Anthropic
    const systemMessage = messages.find((m) => m.role === "system");
    const conversationMessages = messages.filter((m) => m.role !== "system");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: options?.maxTokens || 2000,
        temperature: options?.temperature || 0.7,
        system: systemMessage?.content || "",
        messages: conversationMessages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Anthropic API error: ${error}`);
    }

    const data = await response.json();

    return {
      content: data.content[0]?.text || "",
      usage: data.usage
        ? {
            prompt_tokens: data.usage.input_tokens,
            completion_tokens: data.usage.output_tokens,
            total_tokens: data.usage.input_tokens + data.usage.output_tokens,
          }
        : undefined,
    };
  }
}

