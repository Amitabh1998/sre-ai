# AI Investigation Architecture

## Overview

The AI investigation system uses **direct LLM API calls** (OpenAI GPT-4 or Anthropic Claude) with **prompt engineering** to analyze incidents. It does **NOT** use embeddings, vector databases, or RAG (Retrieval Augmented Generation).

## How It Works

### 1. **Data Gathering Phase** (`lib/ai/data-gatherer.ts`)

When an incident is created, the system gathers contextual data:

**Current Implementation:**
- **Mock Data Generation** (for testing without integrations)
  - Generates contextual logs based on incident title keywords
  - Creates relevant metrics based on incident type
  - Example: If title contains "timeout", generates connection timeout logs

**Future Implementation** (when integrations are connected):
- Fetches **real logs** from observability tools (Datadog, Grafana, CloudWatch)
- Retrieves **metrics** (CPU, memory, error rates, latency)
- Gets **recent deployment** information

**Data Sources:**
```typescript
{
  logs: string[],           // Error logs, warnings from last hour
  metrics: Record<string>,  // CPU, memory, error rates, etc.
  recentDeployments: string[] // Recent changes to the service
}
```

### 2. **Prompt Construction** (`lib/ai/prompts.ts`)

The system builds a structured prompt containing:

```
- Incident Details (title, service, severity, description)
- Relevant Logs (up to 50 log lines)
- Metrics (JSON format)
- Recent Deployments
```

**Example Prompt:**
```
You are an AI SRE agent investigating an incident. Analyze the following data...

Incident Details:
- Title: Database Connection Timeout
- Service: checkout-db
- Severity: P1

Relevant Logs:
[2024-12-23T10:00:00Z] ERROR: checkout-db - Connection timeout after 30s
[2024-12-23T10:01:00Z] WARN: checkout-db - Connection pool exhausted...

Metrics:
{
  "connection_pool_utilization": 98,
  "connection_timeout_rate": 0.25,
  "active_connections": 950
}

Generate 2-4 hypotheses about the root cause...
```

### 3. **LLM API Call** (`lib/ai/llm-client.ts`)

**Direct API Call** to OpenAI or Anthropic:

```typescript
// Uses OpenAI Chat Completions API (or Anthropic Messages API)
POST https://api.openai.com/v1/chat/completions
{
  "model": "gpt-4-turbo-preview",  // or "claude-3-opus-20240229"
  "messages": [
    {
      "role": "system",
      "content": "You are an expert SRE engineer..."
    },
    {
      "role": "user", 
      "content": "<constructed prompt>"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**No Embeddings:**
- ❌ No vector database (no Pinecone, Weaviate, etc.)
- ❌ No embedding generation (no text-embedding-ada-002)
- ❌ No semantic search
- ✅ Direct prompt → LLM → JSON response

### 4. **Response Parsing** (`lib/ai/hypothesis-generator.ts`)

The LLM returns structured JSON:

```json
{
  "hypotheses": [
    {
      "title": "Connection pool exhaustion",
      "confidence": 85,
      "evidence": [
        "Connection pool at 98% utilization",
        "Multiple timeout errors in logs",
        "Recent deployment may have increased load"
      ],
      "suggestedFix": "Increase connection pool size or investigate connection leaks"
    }
  ]
}
```

The system:
1. Parses the JSON response
2. Validates confidence scores (0-100)
3. Stores hypotheses in the database

## Architecture Diagram

```
┌─────────────────┐
│  Incident       │
│  Created        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Data Gatherer   │
│ - Mock logs     │
│ - Mock metrics  │
│ - Deployments   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Prompt Builder  │
│ - Format data   │
│ - Add context   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  LLM Client     │─────▶│  OpenAI API  │
│  (Direct Call)  │      │  or          │
│                  │      │  Anthropic   │
└────────┬─────────┘      └──────┬───────┘
         │                      │
         │                      │ JSON Response
         │                      │
         ▼                      ▼
┌─────────────────┐      ┌──────────────┐
│ Parse & Store   │◀─────│  Hypotheses  │
│ Hypotheses      │      │  Generated   │
└─────────────────┘      └──────────────┘
```

## Key Design Decisions

### Why No Embeddings/Vector DB?

1. **Simplicity**: Direct LLM calls are simpler for this use case
2. **Context Window**: Modern LLMs (GPT-4, Claude) have large context windows (128k+ tokens)
3. **Real-time**: No need to pre-process or index historical data
4. **Cost**: Avoids embedding generation and vector DB storage costs
5. **Fresh Data**: Each investigation uses current, incident-specific data

### When Would You Use Embeddings?

Embeddings + Vector DB would be useful for:
- **Historical Pattern Matching**: "Find similar incidents from the past"
- **Knowledge Base Search**: "Search through documentation/runbooks"
- **Large Log Analysis**: When logs exceed context window limits
- **Multi-tenant Data**: Isolating data per organization efficiently

### Current Limitations

1. **No Historical Context**: Can't learn from past incidents
2. **No Knowledge Base**: Can't reference documentation/runbooks
3. **Limited Log Analysis**: Only analyzes last 50 log lines
4. **No Pattern Recognition**: Doesn't identify recurring issues

## Future Enhancements

### Phase 2: Add Embeddings (Optional)

```typescript
// Store incident embeddings for similarity search
const embedding = await generateEmbedding(incident.title + incident.description);
await storeInVectorDB(incident.id, embedding);

// Find similar incidents
const similarIncidents = await searchVectorDB(embedding, topK: 5);
// Include similar incidents in prompt for context
```

### Phase 3: Knowledge Base Integration

```typescript
// Embed runbooks and documentation
const runbookEmbeddings = await embedRunbooks();
// Search relevant runbooks for incident type
const relevantDocs = await searchKnowledgeBase(incident.service);
// Include in prompt
```

## Cost Analysis

**Current Approach (Direct LLM):**
- ~2000 tokens per investigation
- GPT-4 Turbo: ~$0.01 per investigation
- Anthropic Claude: ~$0.015 per investigation

**With Embeddings:**
- Embedding generation: ~$0.0001 per incident
- Vector DB storage: ~$0.00001 per incident
- Similarity search: ~$0.0001 per search
- LLM call: Same as above
- **Total**: Slightly more expensive, but enables historical learning

## Summary

**Current Implementation:**
- ✅ Direct LLM API calls (OpenAI/Anthropic)
- ✅ Prompt engineering with structured data
- ✅ JSON response parsing
- ❌ No embeddings
- ❌ No vector database
- ❌ No RAG

**How It Works:**
1. Gather incident data (logs, metrics, deployments)
2. Build structured prompt
3. Call LLM API directly
4. Parse JSON response
5. Store hypotheses in database

This is a **simple, effective approach** for real-time incident analysis. Embeddings can be added later if you need historical pattern matching or knowledge base integration.

