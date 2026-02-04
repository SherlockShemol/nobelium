// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
  }
}

interface EventParams {
  action: string
  category: string
  label: string
  value: number
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (gTag: string, url: string): void => {
  window.gtag('config', gTag, {
    page_path: url
  })
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: EventParams): void => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  })
}
