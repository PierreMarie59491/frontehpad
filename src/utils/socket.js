// src/utils/socket.js

let socket;

/**
 * Initialise la connexion WebSocket.
 * @param {Function} onMessageCallback - Fonction appelée à la réception d'un message.
 */
export function initSocket(onMessageCallback) {
  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  // Remplacer http:// par ws:// et https:// par wss://
  const url = backendUrl.replace(/^http/, 'ws') + '/ws';

  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log('✅ WebSocket connected:', url);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('📩 WebSocket message received:', data);
      if (onMessageCallback) onMessageCallback(data);
    } catch (err) {
      console.error('❌ Error parsing WebSocket message', err);
    }
  };

  socket.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  socket.onclose = () => {
    console.warn('🔌 WebSocket closed');
  };
}

/**
 * Envoie un message via la WebSocket.
 * @param {Object} data - Objet à envoyer.
 */
export function sendMessage(data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn('⛔ WebSocket not connected');
  }
}

/**
 * Ferme la connexion WebSocket.
 */
export function closeSocket() {
  if (socket) {
    socket.close();
  }
}
