"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@proof-of-fit/ui";
import { Button } from "@proof-of-fit/ui";
import { Badge } from "@proof-of-fit/ui";
import { Alert, AlertDescription, AlertTitle } from "@proof-of-fit/ui";
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  TestTube,
  Zap,
  Shield,
  Globe
} from "lucide-react";

interface PWATestResult {
  id: string;
  name: string;
  description: string;
  status: "pass" | "fail" | "warning" | "pending";
  details?: string;
  icon: React.ReactNode;
  category: "installability" | "offline" | "performance" | "security";
}

interface PWATestingDashboardProps {
  onTestComplete?: (results: PWATestResult[]) => void;
}

export function PWATestingDashboard({ onTestComplete }: PWATestingDashboardProps) {
  const [testResults, setTestResults] = useState<PWATestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setCanInstall(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const runPWATests = async () => {
    setIsRunning(true);
    const results: PWATestResult[] = [];

    // Test 1: Manifest Check
    try {
      const manifestResponse = await fetch('/manifest.json');
      const manifest = await manifestResponse.json();
      
      results.push({
        id: 'manifest',
        name: 'Web App Manifest',
        description: 'Check if manifest.json is properly configured',
        status: manifest.name && manifest.short_name ? 'pass' : 'fail',
        details: manifest.name ? `App: ${manifest.name}` : 'Manifest missing required fields',
        icon: <Globe className="h-4 w-4" />,
        category: 'installability'
      });
    } catch (error) {
      results.push({
        id: 'manifest',
        name: 'Web App Manifest',
        description: 'Check if manifest.json is properly configured',
        status: 'fail',
        details: 'Manifest not found or invalid',
        icon: <Globe className="h-4 w-4" />,
        category: 'installability'
      });
    }

    // Test 2: Service Worker Check
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        results.push({
          id: 'service-worker',
          name: 'Service Worker',
          description: 'Check if service worker is registered',
          status: registration ? 'pass' : 'fail',
          details: registration ? 'Service worker is active' : 'No service worker found',
          icon: <Zap className="h-4 w-4" />,
          category: 'offline'
        });
      } catch (error) {
        results.push({
          id: 'service-worker',
          name: 'Service Worker',
          description: 'Check if service worker is registered',
          status: 'fail',
          details: 'Service worker registration failed',
          icon: <Zap className="h-4 w-4" />,
          category: 'offline'
        });
      }
    } else {
      results.push({
        id: 'service-worker',
        name: 'Service Worker',
        description: 'Check if service worker is registered',
        status: 'fail',
        details: 'Service workers not supported',
        icon: <Zap className="h-4 w-4" />,
        category: 'offline'
      });
    }

    // Test 3: HTTPS Check
    results.push({
      id: 'https',
      name: 'HTTPS Security',
      description: 'Check if app is served over HTTPS',
      status: location.protocol === 'https:' ? 'pass' : 'warning',
      details: location.protocol === 'https:' ? 'Secure connection' : 'Not served over HTTPS',
      icon: <Shield className="h-4 w-4" />,
      category: 'security'
    });

    // Test 4: Installability Check
    results.push({
      id: 'installability',
      name: 'Installability',
      description: 'Check if app can be installed',
      status: canInstall ? 'pass' : 'warning',
      details: canInstall ? 'App can be installed' : 'Install prompt not available',
      icon: <Download className="h-4 w-4" />,
      category: 'installability'
    });

    // Test 5: Offline Functionality
    try {
      const offlineResponse = await fetch('/offline.html');
      results.push({
        id: 'offline-page',
        name: 'Offline Page',
        description: 'Check if offline fallback page exists',
        status: offlineResponse.ok ? 'pass' : 'fail',
        details: offlineResponse.ok ? 'Offline page available' : 'No offline page found',
        icon: <WifiOff className="h-4 w-4" />,
        category: 'offline'
      });
    } catch (error) {
      results.push({
        id: 'offline-page',
        name: 'Offline Page',
        description: 'Check if offline fallback page exists',
        status: 'fail',
        details: 'Offline page not accessible',
        icon: <WifiOff className="h-4 w-4" />,
        category: 'offline'
      });
    }

    // Test 6: Performance Check
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation.loadEventEnd - navigation.fetchStart;
      
      results.push({
        id: 'performance',
        name: 'Load Performance',
        description: 'Check initial page load time',
        status: loadTime < 3000 ? 'pass' : loadTime < 5000 ? 'warning' : 'fail',
        details: `Load time: ${Math.round(loadTime)}ms`,
        icon: <Clock className="h-4 w-4" />,
        category: 'performance'
      });
    }

    setTestResults(results);
    setIsRunning(false);
    
    if (onTestComplete) {
      onTestComplete(results);
    }
  };

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setCanInstall(false);
        setDeferredPrompt(null);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'default';
      case 'fail': return 'destructive';
      case 'warning': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'installability': return <Download className="h-4 w-4" />;
      case 'offline': return <WifiOff className="h-4 w-4" />;
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      default: return <TestTube className="h-4 w-4" />;
    }
  };

  const passCount = testResults.filter(r => r.status === 'pass').length;
  const failCount = testResults.filter(r => r.status === 'fail').length;
  const warningCount = testResults.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-6">
      {/* PWA Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            PWA Testing Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{passCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{failCount}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={runPWATests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              {isRunning ? 'Running Tests...' : 'Run PWA Tests'}
            </Button>

            {canInstall && (
              <Button 
                onClick={installPWA}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Install App
              </Button>
            )}

            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <span className="text-sm text-gray-600">
              {isOnline ? "Connected to internet" : "Working offline"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result) => (
                <div key={result.id} className="flex items-start gap-3 p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{result.name}</h3>
                      <Badge variant={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(result.category)}
                        {result.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{result.description}</p>
                    {result.details && (
                      <p className="text-xs text-gray-500">{result.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PWA Features Status */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Features Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Web App Manifest</p>
                <p className="text-sm text-gray-600">App metadata and icons</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Service Worker</p>
                <p className="text-sm text-gray-600">Offline functionality</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-purple-500" />
              <div>
                <p className="font-medium">Installability</p>
                <p className="text-sm text-gray-600">Add to home screen</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-orange-500" />
              <div>
                <p className="font-medium">Security</p>
                <p className="text-sm text-gray-600">HTTPS and secure context</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
