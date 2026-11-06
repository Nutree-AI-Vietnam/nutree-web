const TIKTOK_PIXEL_ID = 'D9DG1BJC77UD5IE51T1G';

// TikTok's stock snippet, except that its SDK is inserted after the page is idle, like PostHog.
// The stub exists immediately, so calls made before the SDK arrives queue until then.
export const TIKTOK_PIXEL_SCRIPT = `
!function (w, d, t) {
  var whenIdle=function(f){var go=function(){setTimeout(function(){"requestIdleCallback" in w?w.requestIdleCallback(f,{timeout:3000}):f()},1500)};d.readyState==="complete"?go():w.addEventListener("load",go,{once:true})};
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script"),n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;whenIdle(function(){var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(n,s)})};

  ttq.load('${TIKTOK_PIXEL_ID}');
  ttq.page();
}(window, document, 'ttq');
`;
