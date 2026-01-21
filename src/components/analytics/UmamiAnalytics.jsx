import Script from '@/components/ui/Script';
export default function UmamiAnalytics() {
  const umamiSrc = import.meta.env.VITE_UMAMI_SRC;
  const umamiId = import.meta.env.VITE_UMAMI_ID;
  if (!umamiSrc || !umamiId) {
    console.error('Umami Analytics is not configured.');
    return null;
  }
  return <Script id="umami-analytics" src={umamiSrc} data-website-id={umamiId} strategy="afterInteractive" async />;
}