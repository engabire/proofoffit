'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui';
import { Badge } from '@proof-of-fit/ui';
import { Button } from '@proof-of-fit/ui';
import { PlayCircle, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface TestResult {
  test: string;
  passed: boolean;
  duration?: number;
  error?: string;
  details?: any;
}

const AVAILABLE_TESTS = [
  {
    id: 'lock_correctness',
    name: 'Lock Correctness',
    description: 'Tests that only one scraping job can run at a time',
    category: 'concurrency'
  },
  {
    id: 'auth_pathing',
    name: 'Authentication Paths',
    description: 'Validates all authentication scenarios work correctly',
    category: 'security'
  },
  {
    id: 'robots_compliance',
    name: 'Robots.txt Compliance',
    description: 'Ensures robots.txt rules are respected',
    category: 'compliance'
  },
  {
    id: 'idempotency',
    name: 'Idempotency',
    description: 'Verifies 304 responses for unchanged content',
    category: 'efficiency'
  },
  {
    id: 'clock_skew',
    name: 'Clock Skew Handling',
    description: 'Tests graceful handling of timestamp discrepancies',
    category: 'resilience'
  },
  {
    id: 'ttl_recovery',
    name: 'TTL Recovery',
    description: 'Validates recovery from expired job locks',
    category: 'resilience'
  },
  {
    id: 'backoff_realism',
    name: 'Backoff Logic',
    description: 'Tests exponential backoff retry behavior',
    category: 'resilience'
  }
];

const CATEGORY_COLORS = {
  concurrency: 'bg-blue-50 text-blue-700 border-blue-200',
  security: 'bg-red-50 text-red-700 border-red-200',
  compliance: 'bg-green-50 text-green-700 border-green-200',
  efficiency: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  resilience: 'bg-purple-50 text-purple-700 border-purple-200'
};

export function ScrapingDashboard() {
  const [results, setResults] = useState<Record<string, TestResult>>({});
  const [running, setRunning] = useState<Set<string>>(new Set());
  const [runningAll, setRunningAll] = useState(false);

  const runTest = async (testId: string, params = {}) => {
    setRunning(prev => new Set(prev).add(testId));
    const startTime = Date.now();
    
    try {
      const response = await fetch('/api/scrape/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: testId, params })
      });
      
      const result = await response.json();
      const duration = Date.now() - startTime;
      
      setResults(prev => ({
        ...prev,
        [testId]: { ...result, duration }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [testId]: {
          test: testId,
          passed: false,
          duration: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setRunning(prev => {
        const next = new Set(prev);
        next.delete(testId);
        return next;
      });
    }
  };

  const runAllTests = async () => {
    setRunningAll(true);
    setResults({});
    
    // Run tests sequentially to avoid conflicts
    for (const test of AVAILABLE_TESTS) {
      await runTest(test.id);
    }
    
    setRunningAll(false);
  };

  const getStatusIcon = (testId: string) => {
    if (running.has(testId)) {
      return <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />;
    }
    
    const result = results[testId];
    if (!result) {
      return <PlayCircle className="h-4 w-4 text-gray-400" />;
    }
    
    if (result.passed) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusBadge = (testId: string) => {
    if (running.has(testId)) {
      return <Badge variant="secondary">Running...</Badge>;
    }
    
    const result = results[testId];
    if (!result) {
      return <Badge variant="outline">Not run</Badge>;
    }
    
    if (result.passed) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Passed</Badge>;
    }
    
    return <Badge className="bg-red-100 text-red-800 border-red-200">Failed</Badge>;
  };

  const overallResults = Object.values(results);
  const totalTests = overallResults.length;
  const passedTests = overallResults.filter(r => r.passed).length;
  const failedTests = overallResults.filter(r => !r.passed).length;

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🧪 Scraping System Test Suite
            {totalTests > 0 && (
              <Badge variant="secondary">
                {passedTests}/{totalTests} passed
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            Comprehensive validation of scraping system behavior, security, and resilience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button 
              onClick={runAllTests}
              disabled={runningAll || running.size > 0}
              className="flex items-center gap-2"
            >
              {runningAll ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="h-4 w-4" />
              )}
              Run All Tests
            </Button>
            
            {totalTests > 0 && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  {passedTests} passed
                </span>
                <span className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  {failedTests} failed
                </span>
              </div>
            )}
          </div>
          
          {totalTests > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(passedTests / totalTests) * 100}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Individual Tests */}
      <div className="grid gap-4">
        {AVAILABLE_TESTS.map((test) => {
          const result = results[test.id];
          const isRunning = running.has(test.id);
          
          return (
            <Card key={test.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(test.id)}
                      <h3 className="font-semibold">{test.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${CATEGORY_COLORS[test.category as keyof typeof CATEGORY_COLORS]}`}
                      >
                        {test.category}
                      </Badge>
                      {getStatusBadge(test.id)}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3">
                      {test.description}
                    </p>
                    
                    {result && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Duration: {result.duration}ms</span>
                          {result.error && (
                            <span className="text-red-600 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {result.error}
                            </span>
                          )}
                        </div>
                        
                        {result.details && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              View details
                            </summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => runTest(test.id)}
                    disabled={isRunning || runningAll}
                    className="flex-shrink-0"
                  >
                    {isRunning ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <PlayCircle className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}