if (workbox) {
    console.log(`Workbox is loaded`)    
    workbox.core.setCacheNameDetails({ prefix: 'd4' })

    //Change this value every time before you build
    const LATEST_VERSION = 'v1.2'
    self.addEventListener('activate', (event) => {
      console.log(`%c ${LATEST_VERSION} `, 'background: #ddd; color: #0000ff')
      if (caches) {
        caches.keys().then((arr) => {
          arr.forEach((key) => {
            if (key.indexOf('d4-precache') < -1) {
              caches.delete(key).then(() => console.log(`%c Cleared ${key}`, 'background: #333; color: #ff0000'))
            } else {
              caches.open(key).then((cache) => {
                cache.match('version').then((res) => {
                  if (!res) {
                    cache.put('version', new Response(LATEST_VERSION, { status: 200, statusText: LATEST_VERSION }))
                  } else if (res.statusText !== LATEST_VERSION) {
                    caches.delete(key).then(() => console.log(`%c Cleared Cache ${LATEST_VERSION}`, 'background: #333; color: #ff0000'))
                  } else console.log(`%c Great you have the latest version ${LATEST_VERSION}`, 'background: #333; color: #00ff00')
                })
              })
            }
          })
        })
      }
    })

    workbox.skipWaiting()
    workbox.clientsClaim()
  
    workbox.precaching.precacheAndRoute(self.__precacheManifest)    
    workbox.precaching.precacheAndRoute([]);

        // Cache images:
    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg|svg)$/,
      workbox.strategies.staleWhileRevalidate({
        cacheName: "images",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          })
        ]
      })
    );
    
    // Cache Google fonts, font awesome and boostrap:
    workbox.routing.registerRoute(
      new RegExp("https://fonts.(?:googleapis|gstatic).com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "googleapis",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 30,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          })
        ]
      })
    );
    workbox.routing.registerRoute(
      new RegExp("https://use.(?:fontawesome).com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "fontawesome",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 30,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          })
        ]
      })
    );
    workbox.routing.registerRoute(
      new RegExp("https://cdnjs.(?:cloudflare).com/(.*)"),
      workbox.strategies.cacheFirst({
        cacheName: "bootstrap",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 30,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          })
        ]
      })
    );
    workbox.precaching.suppressWarnings()
  
  } else {
    console.log(`Workbox didn't load`)
  }