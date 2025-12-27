/**
 * Hypothesis generator using LLM
 */

import { LLMClient } from "./llm-client";
import { getInvestigationPrompt } from "./prompts";
import type { Hypothesis } from "@/lib/db/types";

export interface GeneratedHypothesis {
  title: string;
  confidence: number;
  evidence: string[];
  suggestedFix: string;
}

/**
 * Generate hypotheses for an incident using AI
 */
export async function generateHypotheses(
  incidentData: {
    title: string;
    service: string;
    severity: string;
    description?: string;
    logs?: string[];
    metrics?: Record<string, unknown>;
    recentDeployments?: string[];
  }
): Promise<GeneratedHypothesis[]> {
  console.log(`[generateHypotheses] Starting hypothesis generation for: ${incidentData.title}`);
  
  let llmClient;
  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:32',message:'BEFORE LLMClient creation',data:{incidentTitle:incidentData.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    llmClient = new LLMClient();
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:36',message:'AFTER LLMClient creation',data:{incidentTitle:incidentData.title,provider:llmClient['provider']},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    console.log(`[generateHypotheses] LLM client created successfully`);
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:40',message:'THROWING error - LLM client creation failed',data:{incidentTitle:incidentData.title,errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    console.error(`[generateHypotheses] Failed to create LLM client:`, error);
    throw error;
  }
  
  const prompt = getInvestigationPrompt(incidentData);
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:48',message:'BEFORE LLM API call',data:{incidentTitle:incidentData.title,promptLength:prompt.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  // #endregion
  
  console.log(`[generateHypotheses] Prompt created, length: ${prompt.length} chars`);

  console.log(`[generateHypotheses] Calling LLM API...`);
  const response = await llmClient.generateCompletion(
    [
      {
        role: "system",
        content:
          "You are an expert SRE engineer analyzing incidents. Provide structured, actionable hypotheses based on the data provided.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    {
      temperature: 0.7,
      maxTokens: 2000,
    }
  );
  
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:62',message:'AFTER LLM API call',data:{incidentTitle:incidentData.title,responseLength:response.content.length,hasUsage:!!response.usage},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
  // #endregion
  
  console.log(`[generateHypotheses] LLM response received, length: ${response.content.length} chars`);

  try {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:67',message:'BEFORE parsing JSON',data:{incidentTitle:incidentData.title,responseSnippet:response.content.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    // Parse JSON response
    console.log(`[generateHypotheses] Parsing LLM response...`);
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = response.content.trim();
    const originalLength = jsonContent.length;
    
    // Check if response contains markdown code blocks
    const codeBlockMatch = jsonContent.match(/```(?:json)?\s*\n([\s\S]*?)\n?```/i);
    if (codeBlockMatch) {
      // Extract content from code block
      jsonContent = codeBlockMatch[1].trim();
      console.log(`[generateHypotheses] Extracted JSON from code block (${originalLength} -> ${jsonContent.length} chars)`);
    } else if (jsonContent.startsWith('```')) {
      // Fallback: remove code block markers if they're at the start/end
      jsonContent = jsonContent.replace(/^```(?:json)?\s*\n?/i, '').replace(/\n?```\s*$/i, '').trim();
      console.log(`[generateHypotheses] Removed code block markers (${originalLength} -> ${jsonContent.length} chars)`);
    }
    
    // Try to find JSON object in the content if it's not already valid JSON
    if (!jsonContent.startsWith('{') && !jsonContent.startsWith('[')) {
      const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonContent = jsonMatch[0];
        console.log(`[generateHypotheses] Extracted JSON object from text (${jsonContent.length} chars)`);
      }
    }
    
    console.log(`[generateHypotheses] Attempting to parse JSON (${jsonContent.length} chars, starts with: ${jsonContent.substring(0, 50)})`);
    const parsed = JSON.parse(jsonContent);
    
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:71',message:'AFTER parsing JSON',data:{incidentTitle:incidentData.title,hasHypotheses:!!parsed.hypotheses,isArray:Array.isArray(parsed.hypotheses),count:parsed.hypotheses?.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    
    console.log(`[generateHypotheses] Parsed response:`, { hasHypotheses: !!parsed.hypotheses, isArray: Array.isArray(parsed.hypotheses), count: parsed.hypotheses?.length });
    
    if (parsed.hypotheses && Array.isArray(parsed.hypotheses)) {
      const mapped = parsed.hypotheses.map((h: any) => ({
        title: h.title || "Unknown root cause",
        confidence: Math.max(0, Math.min(100, h.confidence || 50)),
        evidence: Array.isArray(h.evidence) ? h.evidence : [],
        suggestedFix: h.suggestedFix || "No fix suggested",
      }));
      console.log(`[generateHypotheses] Successfully parsed ${mapped.length} hypotheses`);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:78',message:'RETURNING parsed hypotheses',data:{incidentTitle:incidentData.title,count:mapped.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      
      return mapped;
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:82',message:'Response missing hypotheses array',data:{incidentTitle:incidentData.title,parsedKeys:Object.keys(parsed)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
      // #endregion
      console.warn(`[generateHypotheses] Response missing hypotheses array, using fallback`);
    }
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/9d0d4316-5196-4a61-b4fa-5b55f0cc76f5',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'lib/ai/hypothesis-generator.ts:85',message:'JSON parse error',data:{incidentTitle:incidentData.title,errorName:error instanceof Error ? error.name : 'unknown',errorMessage:error instanceof Error ? error.message : String(error),responseSnippet:response.content.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    console.error(`[generateHypotheses] Failed to parse LLM response:`, error);
    console.error(`[generateHypotheses] Response content (first 500 chars):`, response.content.substring(0, 500));
  }

  // Fallback: return a default hypothesis
  console.log(`[generateHypotheses] Returning fallback hypothesis`);
  return [
    {
      title: "Root cause analysis in progress",
      confidence: 50,
      evidence: ["Insufficient data to determine root cause"],
      suggestedFix: "Gather more logs and metrics",
    },
  ];
}

