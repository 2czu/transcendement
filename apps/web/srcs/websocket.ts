let socket: WebSocket | null = null;

export function initSocket(): WebSocket {
    if (!socket) {
        socket = new WebSocket("wss://localhost:8443/connexionStatus");

        socket.addEventListener("open", () => {
            console.log("WebSocket connecté");
        });

        socket.addEventListener("close", () => {
            console.log("WebSocket déconnecté");
            socket = null;
        });

        socket.addEventListener("error", (err) => {
            console.error("Erreur WebSocket :", err);
        });

        socket.addEventListener("message", (msg) => {
            console.log("Message reçu:", msg.data);
        });
    }
    return socket;
}

export function getSocket() {
	return socket;
};