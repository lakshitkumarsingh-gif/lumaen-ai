# LUMAEN API Documentation

## Base URL
```
http://localhost:3001/api
```

## Authentication

All requests require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Chat

#### Send Message
```
POST /chat

Body:
{
  "message": "What is machine learning?",
  "model": "gemini" // optional: gpt, claude, gemini
}

Response:
{
  "id": "msg-123",
  "response": "Machine learning is...",
  "model": "gemini",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Memory

#### Get Memories
```
GET /memories?limit=50&offset=0

Response:
{
  "memories": [
    {
      "id": "mem-1",
      "content": "User learned about ML",
      "importance": 8.5,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 42
}
```

### User

#### Get Profile
```
GET /user

Response:
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe",
  "avatar": "https://...",
  "plan": "pro",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Update Profile
```
PUT /user

Body:
{
  "name": "New Name",
  "preferences": {
    "theme": "dark",
    "defaultModel": "gpt"
  }
}
```

## Error Responses

```json
{
  "error": "Error code",
  "message": "Error description",
  "statusCode": 400
}
```

## Rate Limiting

- Free tier: 5 requests/minute
- Pro tier: 60 requests/minute
- Premium tier: Unlimited
