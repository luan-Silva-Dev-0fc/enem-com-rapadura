const CACHE_NAME = "enem-cache-v1";

// Arquivos a serem armazenados no cache
const urlsToCache = [
  "/",                
  "/index.html",      
  "/icone.png",       p
  
];

// Evento de instalação do SW
self.addEventListener("install", event => {
  console.log("[SW] Instalando...");
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("[SW] Cacheando arquivos");
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error("[SW] Erro ao cachear arquivos:", err))
  );
});

// Evento de ativação do SW
self.addEventListener("activate", event => {
  console.log("[SW] Ativado!");
  event.waitUntil(self.clients.claim());
});

// Interceptando requisições
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache ou faz fetch da rede
        return response || fetch(event.request)
          .catch(() => {
            // fallback opcional caso o usuário esteja offline
            if (event.request.destination === "document") {
              return caches.match("/index.html");
            }
          });
      })
  );
});