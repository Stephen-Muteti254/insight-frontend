# InsightPay Backend API Documentation

## Overview
This document provides comprehensive backend implementation specifications for InsightPay.

---

## Authentication Endpoints

### POST /api/auth/register
Creates a new user account.

**Request Payload:**
```json
{
  "email": "string (required, valid email)",
  "password": "string (required, min 8 characters)",
  "name": "string (required)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "emailVerified": false,
      "status": "unverified",
      "createdAt": "ISO8601"
    },
    "token": "jwt_token"
  }
}
```

**Authorization:** None

---

### POST /api/auth/login
Authenticates a user.

**Request Payload:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "string",
      "name": "string",
      "emailVerified": "boolean",
      "status": "unverified|pending_application|pending_review|approved|rejected",
      "balance": "number",
      "pendingBalance": "number"
    },
    "token": "jwt_token"
  }
}
```

**Authorization:** None

---

### POST /api/auth/google
OAuth login with Google.

**Request Payload:**
```json
{
  "idToken": "string (Google ID token)"
}
```

**Response (200):** Same as login

**Authorization:** None

---

### POST /api/auth/verify-email
Verifies user email with code.

**Request Payload:**
```json
{
  "code": "string (6 digits)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "emailVerified": true,
    "status": "pending_application"
  }
}
```

**Authorization:** Bearer Token (Required)

---

### POST /api/auth/resend-verification
Resends verification email.

**Request Payload:** None

**Response (200):**
```json
{
  "success": true,
  "message": "Verification email sent"
}
```

**Authorization:** Bearer Token (Required)

---

## Application Endpoints

### POST /api/application/submit
Submits user application for review.

**Request Payload:**
```json
{
  "answers": {
    "experience": "string",
    "motivation": "string",
    "availability": "string",
    "bio": "string"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "status": "pending_review",
    "applicationId": "uuid",
    "submittedAt": "ISO8601"
  }
}
```

**Authorization:** Bearer Token (Required)
**Filters:** User must have emailVerified=true

---

### GET /api/application/status
Gets current application status.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "status": "pending_review|approved|rejected",
    "submittedAt": "ISO8601",
    "reviewedAt": "ISO8601|null",
    "rejectionReason": "string|null"
  }
}
```

**Authorization:** Bearer Token (Required)

---

## Survey Endpoints

### GET /api/surveys
Lists available surveys for user.

**Query Parameters:**
- `page`: number (default: 1)
- `limit`: number (default: 20)
- `topic`: string (optional filter)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "surveys": [
      {
        "id": "uuid",
        "title": "string",
        "topic": "string",
        "description": "string",
        "durationMinutes": "number",
        "reward": "number (USD)",
        "slotsRemaining": "number",
        "expiresAt": "ISO8601"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "hasMore": true
    }
  }
}
```

**Authorization:** Bearer Token (Required)
**Filters:** User must have status=approved

---

### POST /api/surveys/:id/start
Starts a survey session.

**Request Payload:** None

**Response (200):**
```json
{
  "success": true,
  "data": {
    "sessionId": "uuid",
    "surveyUrl": "string (external survey URL)",
    "expiresAt": "ISO8601",
    "reward": "number"
  }
}
```

**Authorization:** Bearer Token (Required)

---

### POST /api/surveys/:id/complete
Marks survey as completed.

**Request Payload:**
```json
{
  "sessionId": "uuid",
  "completionToken": "string (from survey provider)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "earned": "number",
    "newPendingBalance": "number"
  }
}
```

**Authorization:** Bearer Token (Required)

---

## Wallet Endpoints

### GET /api/wallet
Gets user wallet information.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": "number",
    "pendingBalance": "number",
    "totalEarned": "number",
    "paypalEmail": "string|null",
    "canWithdraw": "boolean"
  }
}
```

**Authorization:** Bearer Token (Required)

---

### GET /api/wallet/transactions
Gets transaction history with infinite scroll.

**Query Parameters:**
- `cursor`: string (last transaction ID for pagination)
- `limit`: number (default: 20)
- `type`: "earning"|"withdrawal"|null

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "type": "earning|withdrawal",
        "title": "string",
        "amount": "number",
        "status": "pending|paid|failed",
        "createdAt": "ISO8601"
      }
    ],
    "nextCursor": "string|null"
  }
}
```

**Authorization:** Bearer Token (Required)

---

### POST /api/wallet/withdraw
Requests a withdrawal.

**Request Payload:**
```json
{
  "amount": "number (min 5.00)",
  "paypalEmail": "string (valid email)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "withdrawalId": "uuid",
    "amount": "number",
    "estimatedProcessingDate": "ISO8601",
    "newBalance": "number"
  }
}
```

**Authorization:** Bearer Token (Required)
**Filters:** 
- balance >= amount
- amount >= 5.00
- No pending withdrawals

---

## Settings Endpoints

### GET /api/settings
Gets user settings.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifyOnSurveys": "boolean",
    "notifyOnPayments": "boolean",
    "emailFrequency": "instant|daily|weekly"
  }
}
```

**Authorization:** Bearer Token (Required)

---

### PATCH /api/settings
Updates user settings.

**Request Payload:**
```json
{
  "notifyOnSurveys": "boolean (optional)",
  "notifyOnPayments": "boolean (optional)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated settings */ }
}
```

**Authorization:** Bearer Token (Required)

---

## Dashboard Endpoints

### GET /api/dashboard/stats
Gets user dashboard statistics.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "balance": "number",
    "pendingBalance": "number",
    "totalEarned": "number",
    "surveysCompleted": "number",
    "recentEarnings": [
      {
        "id": "uuid",
        "title": "string",
        "amount": "number",
        "date": "ISO8601",
        "status": "pending|paid"
      }
    ]
  }
}
```

**Authorization:** Bearer Token (Required)

---

## Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // optional additional info
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED` (401): Missing or invalid token
- `FORBIDDEN` (403): User doesn't have required status
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (422): Invalid request payload
- `RATE_LIMITED` (429): Too many requests

---

## Authorization Summary

| Endpoint | Auth Required | Additional Filters |
|----------|---------------|-------------------|
| POST /auth/register | No | - |
| POST /auth/login | No | - |
| POST /auth/google | No | - |
| POST /auth/verify-email | Yes | - |
| POST /application/submit | Yes | emailVerified=true |
| GET /surveys | Yes | status=approved |
| POST /surveys/:id/* | Yes | status=approved |
| GET/POST /wallet/* | Yes | status=approved |
| GET/PATCH /settings | Yes | - |
| GET /dashboard/stats | Yes | status=approved |
