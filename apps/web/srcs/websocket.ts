let socket: WebSocket | null = null;

export function initSocket(): WebSocket {
    if (!socket) {
        socket = new WebSocket("wss://localhost:8443/connexionStatus");

        socket.addEventListener("error", (err) => {
            console.error("Erreur WebSocket :", err);
        });

    }
    return socket;
}

export function getSocket() {
	return socket;
};