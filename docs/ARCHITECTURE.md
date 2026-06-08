# LUMAEN Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)               │
│   - Landing Page & Auth (Google OAuth)              │
│   - Dashboard with Real-time Chat                   │
│   - Theme System (Dark, Light, Rainbow)             │
└──────────────────────┬──────────────────────────────┘
                       │ API Calls
                       ▼
┌─────────────────────────────────────────────────────┐
│                Backend (Express.js)                 │
│   - Authentication & Authorization                  │
│   - AI Model Router                                 │
│   - Message Processing & Storage                    │
│   - Memory Graph Management                         │
└──────────────┬──────────────────┬───────────────────┘
               │                  │
               ▼                  ▼
        ┌────────────┐     ┌────────────────┐
        │ PostgreSQL │     │     Redis      │
        │ - Users    │     │ - Cache        │
        │ - Messages │     │ - Sessions     │
        │ - Memories │     │ - Real-time    │
        └────────────┘     └────────────────┘

        ▼ (Future Integration)
┌──────────────────────────────────────────────────────┐
│            External AI APIs (Optional)               │
│  - OpenAI (GPT-4)                                    │
│  - Anthropic (Claude)                                │
│  - Google (Gemini)                                   │
└──────────────────────────────────────────────────────┘
```

## AI Router Logic

1. **Intent Classification**: Analyze user query
2. **Model Selection**:
   - Coding/Technical → GPT-4
   - Writing/Creative → Claude
   - Research/Search → Gemini
3. **Query Processing**: Format for selected model
4. **Response Handling**: Merge and format response
5. **Memory Storage**: Store learning signal

## Memory Graph

- **Nodes**: Individual learned concepts
- **Edges**: Relationships between concepts
- **Importance Score**: Based on query frequency and recency
- **Auto-update**: Increments as user learns

## Security

- JWT-based authentication
- Google OAuth 2.0
- HTTPS enforcement
- Data encryption at rest
- Input validation & sanitization

## Scalability

- Horizontal scaling with load balancing
- Redis caching for performance
- Connection pooling
- Message queue for async processing
