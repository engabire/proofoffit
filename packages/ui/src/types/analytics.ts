declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'exception' | 'pageview' | 'set' | 'timing_complete',
      targetId: string | object,
      config?: object
    ) => void
    dataLayer?: object[]
  }
}

export interface CTATrackingData {
  event_category?: string
  event_label?: string
  event_action?: string
  cta_position?: string
  cta_variant?: string
  page_section?: string
  user_segment?: string
  experiment_id?: string
  experiment_variant?: string
}

export interface CTAAnalytics {
  trackClick: (data: CTATrackingData) => void
  trackView: (data: CTATrackingData) => void
  trackConversion: (data: CTATrackingData) => void
}