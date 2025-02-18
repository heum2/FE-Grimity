const code = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const pageview = (url: string) => {
  if (!code) {
    console.error("GA_TRACKING_ID is not defined.");
    return;
  }

  window.gtag("config", code, {
    page_path: url,
  });
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!code) {
    console.error("GA_TRACKING_ID is not defined.");
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
