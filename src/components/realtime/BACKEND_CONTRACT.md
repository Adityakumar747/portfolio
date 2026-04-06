# Backend Integration Contract

Socket events the frontend expects for new features.

---

## 1. Emoji Reactions

### Client emits

**`reaction-toggle`**
```ts
{ messageId: string; emoji: string }
```
Toggle: if user already reacted with this emoji, remove; otherwise add.

### Server emits

**`reactions-init`** (on connection, with message history)
```ts
Record<string, Reaction[]>
// e.g. { "msg-42": [{ emoji: "👍", sessionIds: ["sess-1", "sess-2"] }] }
```

**`reaction-update`** (broadcast after any toggle)
```ts
{ messageId: string; reactions: Reaction[] }
```

### Types
```ts
type Reaction = { emoji: string; sessionIds: string[] };
```

### DB schema suggestion
```
reactions
  id          PK
  message_id  FK -> messages.id
  emoji       string
  session_id  string
  created_at  timestamp
  UNIQUE(message_id, emoji, session_id)
```

---

## 2. Reply to Message

### Client emits

**`msg-send`** (updated payload)
```ts
{ content: string; replyTo?: string }
//                  ^ message ID being replied to
```

### Server emits

**`msg-receive`** (updated payload)
```ts
{
  // ...existing Message fields
  replyTo?: {
    id: string;
    username: string;
    content: string;   // can be truncated server-side
  };
}
```
Server resolves the referenced message's username and content from DB.

### DB schema suggestion
```
messages
  ...existing columns...
  reply_to_id  FK -> messages.id (nullable)
```

---

## 3. System Join Messages

Sent through the same `msgs-receive-init` and `msg-receive` channels:

```ts
{
  id: string;
  type: "system";
  subtype: "join";
  sessionId: string;
  username: string;
  flag: string;
  createdAt: string | Date;
}
```

Regular messages do NOT have a `type` field — that's the discriminator.

Emit one system message per join event. Frontend groups consecutive joins visually.

### Join sound event

**`user-joined`** (broadcast to all other clients)
```ts
{ username: string; flag: string }
```
Sent alongside the system message. Frontend uses this dedicated event to play a join sound (separate from `msg-receive` to avoid sound conflicts).

### DB schema suggestion
```
messages
  ...existing columns...
  type      string (nullable, "system" for system messages)
  subtype   string (nullable, "join" etc.)
```

---

## 4. Admin Authentication

### Client emits

**`admin-auth`**
```ts
{ password: string }
```
User types `/admin <password>` in chat. Frontend emits this event (message is NOT sent to chat).

### Server behavior
1. Verify password against a server-side secret (env var `ADMIN_PASSWORD` or similar)
2. If valid: set `isAdmin: true` on the user's session, persist to DB, broadcast updated user list
3. If invalid: emit `warning { message: "Invalid admin password" }` back to the sender

### User type (updated)
```ts
{
  // ...existing User fields
  isAdmin?: boolean;
}
```

`isAdmin` is included in the `users-updated` broadcast. Frontend renders a shield badge next to admin names in chat messages and user list.

### DB schema suggestion
```
sessions
  ...existing columns...
  is_admin  boolean (default false)
```

---

## Summary of all socket events

| Direction | Event | Feature | Payload |
|-----------|-------|---------|---------|
| C -> S | `reaction-toggle` | Reactions | `{ messageId, emoji }` |
| S -> C | `reactions-init` | Reactions | `Record<string, Reaction[]>` |
| S -> C | `reaction-update` | Reactions | `{ messageId, reactions }` |
| C -> S | `msg-send` | Reply | `{ content, replyTo?: msgId }` |
| S -> C | `msg-receive` | Reply | `Message` with optional `replyTo` object |
| S -> C | `msg-receive` | System msgs | `SystemMessage` with `type: "system"` |
| S -> C | `msgs-receive-init` | System msgs | Array includes `SystemMessage` entries |
| S -> C | `user-joined` | Join sound | `{ username, flag }` |
| C -> S | `admin-auth` | Admin | `{ password }` |
| S -> C | `warning` | Admin (fail) | `{ message }` |
| S -> C | `users-updated` | Admin (success) | Users array with `isAdmin` flag |
