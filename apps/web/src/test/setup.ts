import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Supabase helpers so auth flows work during tests
const subscriptionMock = { unsubscribe: jest.fn() }

const createSupabaseMock = () => {
  const tableMock = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  }

  return {
    auth: {
      signInWithOtp: jest.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: jest.fn((callback) => {
        // Store handler so tests can trigger if needed
        ;(subscriptionMock as any).handler = callback
        return { data: { subscription: subscriptionMock } }
      }),
    },
    from: jest.fn(() => tableMock),
  }
}

const clientComponentMock = createSupabaseMock()
const serverComponentMock = createSupabaseMock()

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(() => clientComponentMock),
  createServerComponentClient: jest.fn(() => serverComponentMock),
}))

// Provide helper for tests that need to trigger auth changes
export const __triggerAuthChange = (event: string, session?: any) => {
  if (typeof (subscriptionMock as any).handler === 'function') {
    ;(subscriptionMock as any).handler(event, session)
  }
}

// Mock Prisma client to avoid requiring generated client
jest.mock('@prisma/client', () => {
  const createRecursiveMock = () =>
    new Proxy(
      {
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        $transaction: jest.fn(async (cb: any) => cb && cb()),
      },
      {
        get(target, prop) {
          if (!(prop in target)) {
            target[prop as keyof typeof target] = jest.fn().mockReturnThis()
          }
          return target[prop as keyof typeof target]
        },
      }
    )

  class PrismaClientMock {
    constructor() {
      return createRecursiveMock()
    }
  }

  return {
    PrismaClient: PrismaClientMock,
    Prisma: {
      PrismaClientKnownRequestError: class PrismaClientKnownRequestError extends Error {
        constructor(message: string) {
          super(message)
          this.name = 'PrismaClientKnownRequestError'
        }
      },
    },
  }
})

// Mock Octokit to avoid ESM import issues in Jest
jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => ({
    request: jest.fn(),
    rateLimit: {
      get: jest.fn().mockResolvedValue({ data: { rate: { remaining: 5000 } } }),
    },
  })),
}))

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
    billingPortal: {
      sessions: {
        create: jest.fn(),
      },
    },
    customers: {
      retrieve: jest.fn(),
    },
    subscriptions: {
      list: jest.fn(),
    },
    webhooks: {
      constructEvent: jest.fn(),
    },
  }))
})

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
