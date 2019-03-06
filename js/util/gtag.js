// Used with permission under the MIT license from ZEIT's Next.js project.
// See license information at https://github.com/zeit/next.js
// Modified by Zack Sheppard (zacksheppard.com) to support env variables.

import env from "./env";

export const GA_TRACKING_ID = (env && env.GOOGLE_ANALYTICS_ID) || undefined;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
  if (GA_TRACKING_ID) {
    window.gtag("config", GA_TRACKING_ID, {
      page_location: url
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (GA_TRACKING_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};
