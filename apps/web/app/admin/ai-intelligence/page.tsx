import { AIIntelligenceDashboard } from '@/components/ai/AIIntelligenceDashboard';

export default function AIIntelligencePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">AI Intelligence Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          AI-powered content analysis, trend detection, and intelligence insights from scraped data
        </p>
      </div>
      
      <AIIntelligenceDashboard />
    </div>
  );
}