# ProofOfFit Shared Libraries

This directory contains shared utilities and libraries to reduce code duplication and ensure consistency across the ProofOfFit application.

## 📁 Directory Structure

```
src/lib/
├── api/                 # API utilities and helpers
├── auth/                # Authentication utilities
├── database/            # Database operation utilities
├── validation/          # Form validation utilities
├── security/            # Security hardening utilities
├── error-handling/      # Enhanced error handling
└── README.md           # This file
```

## 🚀 Quick Start

### API Routes

Use the `withApiWrapper` to add common functionality to your API routes:

```typescript
import { withApiWrapper, createApiResponse } from '@/lib/api/api-utils';

async function myHandler(request: NextRequest) {
  // Your logic here
  return createApiResponse({ message: 'Success' });
}

export const GET = withApiWrapper(myHandler, {
  requireAuth: true,
  rateLimit: { limit: 100, windowMs: 60000 }
});
```

### Authentication

Use authentication utilities for consistent auth handling:

```typescript
import { validateAuth, validateUserRole } from '@/lib/auth/auth-utils';

export async function GET(request: NextRequest) {
  const { isAuthenticated, user, error } = await validateAuth();
  
  if (!isAuthenticated) {
    return createApiResponse(undefined, error, 401);
  }
  
  const { isValid, error: roleError } = validateUserRole(user, 'admin');
  if (!isValid) {
    return createApiResponse(undefined, roleError, 403);
  }
  
  // Your logic here
}
```

### Database Operations

Use database utilities for consistent data access:

```typescript
import { query, insert, update, remove } from '@/lib/database/db-utils';

// Query data
const { data, error } = await query('users', {
  filters: { role: 'admin' },
  orderBy: [{ column: 'created_at', ascending: false }],
  limit: 10
});

// Insert data
const { data: newUser, error: insertError } = await insert('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Update data
const { data: updatedUser, error: updateError } = await update('users', 
  { name: 'Jane Doe' }, 
  { filters: { id: 'user-123' } }
);
```

### Form Validation

Use validation utilities for consistent form handling:

```typescript
import { validateForm, schemas } from '@/lib/validation/form-validators';

export async function POST(request: NextRequest) {
  const { data: formData, error } = await validateRequestBody(request);
  if (error) return error;
  
  const { isValid, errors } = validateForm(formData, schemas.signUp);
  if (!isValid) {
    return createApiResponse(undefined, 'Validation failed', 400);
  }
  
  // Your logic here
}
```

## 📚 Detailed Documentation

### API Utilities (`/api/api-utils.ts`)

#### `withApiWrapper(handler, options)`

Wraps API route handlers with common functionality:

**Options:**
- `requireAuth: boolean` - Require authentication
- `requiredRole: string` - Require specific role
- `requiredPermissions: string[]` - Require specific permissions
- `rateLimit: { limit: number, windowMs: number }` - Rate limiting
- `validateBody: (data: any) => any` - Body validation function

**Features:**
- Automatic error handling
- Request ID generation
- Performance timing
- Rate limiting
- Authentication validation
- Permission checking

#### `createApiResponse(data, error, status, options)`

Creates standardized API responses:

```typescript
// Success response
return createApiResponse({ users: [] }, undefined, 200, {
  message: 'Users retrieved successfully'
});

// Error response
return createApiResponse(undefined, 'User not found', 404);
```

#### `createPaginatedResponse(data, total, pagination, options)`

Creates paginated responses:

```typescript
return createPaginatedResponse(users, 100, { page: 1, limit: 10 });
```

### Authentication Utilities (`/auth/auth-utils.ts`)

#### `validateAuth()`

Validates user authentication and returns user profile:

```typescript
const { isAuthenticated, user, session, error } = await validateAuth();
```

#### `validateUserRole(user, requiredRole, requiredUserType)`

Validates user role and permissions:

```typescript
const { isValid, error } = validateUserRole(user, 'admin', 'employer');
```

#### `signInWithPassword(email, password)`

Handles user sign-in:

```typescript
const { success, error, user } = await signInWithPassword(email, password);
```

#### `signUpWithPassword(email, password, userType, additionalData)`

Handles user sign-up:

```typescript
const { success, error, user } = await signUpWithPassword(
  email, 
  password, 
  'seeker', 
  { name: 'John Doe' }
);
```

### Database Utilities (`/database/db-utils.ts`)

#### `query(table, options)`

Generic query function:

```typescript
const { data, error } = await query('users', {
  select: 'id, name, email',
  filters: { role: 'admin' },
  orderBy: [{ column: 'created_at', ascending: false }],
  limit: 10,
  single: false
});
```

#### `insert(table, data, options)`

Generic insert function:

```typescript
const { data, error } = await insert('users', {
  name: 'John Doe',
  email: 'john@example.com'
}, {
  returning: 'id, name, email'
});
```

#### `update(table, data, options)`

Generic update function:

```typescript
const { data, error } = await update('users', 
  { name: 'Jane Doe' }, 
  { 
    filters: { id: 'user-123' },
    returning: 'id, name, email'
  }
);
```

#### `remove(table, options)`

Generic delete function:

```typescript
const { data, error } = await remove('users', {
  filters: { id: 'user-123' }
});
```

#### `queryPaginated(table, pagination, queryOptions)`

Paginated query function:

```typescript
const { data, error } = await queryPaginated('users', {
  page: 1,
  limit: 10,
  maxLimit: 100
}, {
  filters: { role: 'admin' }
});
```

### Validation Utilities (`/validation/form-validators.ts`)

#### Pre-built Validators

```typescript
import { validators } from '@/lib/validation/form-validators';

// Required field
validators.required('This field is required')

// Email validation
validators.email('Please enter a valid email')

// Password validation
validators.password('Password must be strong')

// Custom validation
validators.custom((value) => ({
  isValid: value.length > 5,
  error: 'Must be longer than 5 characters'
}))
```

#### Pre-built Schemas

```typescript
import { schemas } from '@/lib/validation/form-validators';

// Use pre-built schemas
const { isValid, errors } = validateForm(formData, schemas.signUp);
const { isValid, errors } = validateForm(formData, schemas.userProfile);
const { isValid, errors } = validateForm(formData, schemas.jobPosting);
```

#### Custom Validation

```typescript
import { validateForm, validators } from '@/lib/validation/form-validators';

const customSchema = {
  email: [validators.required(), validators.email()],
  password: [validators.required(), validators.password()],
  confirmPassword: [
    validators.required(), 
    validators.confirmPassword('password')
  ]
};

const { isValid, errors } = validateForm(formData, customSchema);
```

### Security Utilities (`/security/security-hardening.ts`)

#### `SecurityHardener.validateEnvironment()`

Validates environment configuration:

```typescript
const validation = SecurityHardener.validateEnvironment();
if (!validation.isValid) {
  console.error('Security issues:', validation.errors);
}
```

#### `SecurityHardener.validateApiKey(key, type)`

Validates API key format:

```typescript
const isValid = SecurityHardener.validateApiKey(apiKey, 'stripe');
```

#### `InputValidator.validateEmail(email)`

Validates email format:

```typescript
const isValid = InputValidator.validateEmail('user@example.com');
```

### Error Handling (`/error-handling/enhanced-error-handler.ts`)

#### `createError(type, severity, message, context, options)`

Creates standardized errors:

```typescript
const error = createError(
  ErrorType.VALIDATION,
  ErrorSeverity.MEDIUM,
  'Invalid input data',
  { userId: 'user-123' },
  { userMessage: 'Please check your input' }
);
```

#### `handleError(error, context)`

Handles and logs errors:

```typescript
const appError = handleError(error, { endpoint: '/api/users' });
```

#### Circuit Breaker

```typescript
const result = await errorHandler.withCircuitBreaker(
  'external-service',
  () => callExternalService(),
  { failureThreshold: 5, timeout: 30000 }
);
```

#### Retry with Exponential Backoff

```typescript
const result = await errorHandler.withRetry(
  () => riskyOperation(),
  { maxRetries: 3, baseDelay: 1000 }
);
```

## 🔧 Migration Guide

### Migrating Existing API Routes

**Before:**
```typescript
export async function GET(request: NextRequest) {
  try {
    // Authentication logic
    const supabase = createRouteHandlerClient({ cookies });
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Business logic
    const data = await fetchData();
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

**After:**
```typescript
import { withApiWrapper, createApiResponse } from '@/lib/api/api-utils';

async function getData(request: NextRequest) {
  const data = await fetchData();
  return createApiResponse(data);
}

export const GET = withApiWrapper(getData, { requireAuth: true });
```

### Migrating Form Components

**Before:**
```typescript
const [errors, setErrors] = useState({});
const [values, setValues] = useState({});

const validateForm = () => {
  const newErrors = {};
  if (!values.email) newErrors.email = 'Email is required';
  if (!values.password) newErrors.password = 'Password is required';
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

**After:**
```typescript
import { validateForm, schemas } from '@/lib/validation/form-validators';

const { isValid, errors } = validateForm(values, schemas.signIn);
```

## 🎯 Best Practices

1. **Always use the utilities** - Don't reinvent common patterns
2. **Consistent error handling** - Use the error handler for all errors
3. **Validate inputs** - Use validation utilities for all forms
4. **Secure by default** - Use security utilities for all external inputs
5. **Database consistency** - Use database utilities for all data operations
6. **API standardization** - Use API utilities for all endpoints

## 🐛 Troubleshooting

### Common Issues

1. **Import errors** - Make sure you're importing from the correct path
2. **Type errors** - Check that you're using the correct types
3. **Validation failures** - Ensure your data matches the expected schema
4. **Authentication issues** - Verify your Supabase configuration

### Getting Help

1. Check the TypeScript definitions for detailed type information
2. Look at existing implementations for examples
3. Review the error messages for specific guidance
4. Check the console for detailed error logs

## 📈 Performance Considerations

- The utilities are optimized for performance
- Database queries use efficient patterns
- Error handling is lightweight
- Validation is fast and cached where possible
- Rate limiting prevents abuse

## 🔒 Security Features

- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Authentication validation
- Permission checking
- Secure error handling
