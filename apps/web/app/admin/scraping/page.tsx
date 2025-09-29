import { ScrapingMonitor } from '@/components/scraping/ScrapingMonitor';

export default function ScrapingAdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Scraping System Monitor</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive monitoring, testing, and management of the ethical scraping system
        </p>
      </div>
      
      <ScrapingMonitor />
    </div>
  );
}