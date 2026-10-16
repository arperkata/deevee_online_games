/* ADS CONFIG - ads are OFF by default. Nothing is loaded until you turn this on.
   To enable (only after your site is on your own domain and your ad account is approved):
   1. set enabled:true
   2. put your AdSense publisher id in client (looks like "ca-pub-1234567890123456")
   3. put your ad unit id in slots.home (a number from AdSense -> Ads -> By ad unit)
   4. in AdSense, mark the site as "child-directed" / use non-personalised ads (required for kids' content)
   Check Google's current rules for child-directed sites before going live. */
window.ADS_CONFIG={
  enabled:false,
  client:'ca-pub-XXXXXXXXXXXXXXXX',
  slots:{home:'0000000000'},
  childDirected:true,
  nonPersonalized:true
};
