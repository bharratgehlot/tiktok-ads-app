/*
 * 1. Simulates an Async API call with network latency (setTimeout) to test loading states.
 * 2. Enforces Business Logic (e.g., "Conversions need Music") mimicking server-side validation.
 * 3. Randomly triggers errors (Geo-blocking) to test the robustness of the frontend error UI.
 */

export function submitAd(payload) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const {
        campaignName,
        objective,
        adText,
        musicId
      } = payload

      // Basic validation
      if (!campaignName || campaignName.length < 3) {
        reject({
          type: 'validation',
          message: 'Campaign name must be at least 3 characters'
        })
        return
      }

      if (!objective) {
        reject({
          type: 'validation',
          message: 'Objective is required'
        })
        return
      }

      if (!adText || adText.length > 100) {
        reject({
          type: 'validation',
          message: 'Ad text is required and max 100 characters'
        })
        return
      }

      // Business rule
      if (objective === 'Conversions' && !musicId) {
        reject({
          type: 'validation',
          message: 'Music is required for Conversions objective'
        })
        return
      }

      // Simulate geo restriction (20%)
      if (Math.random() < 0.2) {
        reject({
          type: 'geo',
          status: 403,
          message: 'Service not available in your region'
        })
        return
      }

      // Success
      resolve({
        success: true,
        id: 'ad_' + Math.floor(Math.random() * 100000)
      })
    }, 1500)
  })
}
