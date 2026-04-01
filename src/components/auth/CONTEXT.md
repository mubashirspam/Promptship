# Auth Module Context

## Purpose
Authentication and authorization using Better Auth. Handles login, signup, session management, and protected routes.

## Dependencies
- `better-auth` - Auth provider
- `@/lib/auth` - Auth configuration
- `@/lib/validations/auth` - Zod schemas for auth forms
- `@/lib/db/schema` - User and session tables

## Key Constraints

### Session Management
```typescript
// Server-side auth check
import { auth } from '@/lib/auth';

const session = await auth();
if (!session?.user) {
  redirect('/login');
}
```

### Client-Side Auth State
```typescript
// NEVER use for authorization, only UI state
'use client';
import { useSession } from '@/hooks/use-session';

const { user, isLoading } = useSession();
```

### Form Validation
```typescript
// ALWAYS use Zod schemas from @/lib/validations/auth
import { loginSchema, signupSchema } from '@/lib/validations/auth';

const form = useForm({
  resolver: zodResolver(loginSchema),
});
```

## Component Patterns

### Client Components
- `LoginForm` - Email/password login
- `SignupForm` - User registration
- `AuthProvider` - Session context provider

### Server Components
- `ProtectedRoute` - Wrapper for auth-required pages
- `UserMenu` - Display user info (can fetch server-side)

## Security Rules

1. **Password Handling**
   - NEVER log passwords
   - NEVER return passwords in API responses
   - USE Better Auth's built-in hashing

2. **Session Tokens**
   - NEVER expose session tokens to client
   - USE httpOnly cookies
   - IMPLEMENT CSRF protection

3. **Rate Limiting**
   - LOGIN: 5 attempts per 15 minutes
   - SIGNUP: 3 attempts per hour
   - PASSWORD_RESET: 3 attempts per hour

## Error Messages
- Generic messages for security: "Invalid credentials" (not "User not found")
- Specific messages for UX: "Email already registered"
- NEVER expose internal errors

## Redirect Patterns
```typescript
// After login
redirect(searchParams.get('from') || '/dashboard');

// After logout  
redirect('/');

// Unauthorized access
redirect(`/login?from=${pathname}`);
```
