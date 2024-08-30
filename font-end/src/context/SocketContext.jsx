import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	useEffect(() => {
		let socketInstance;

		if (authUser) {
			socketInstance = io("http://localhost:5000", {
				query: {
					userId: authUser._id,
				},
				transports: ["websocket"],
				reconnection: true,
				reconnectionAttempts: 5,
				reconnectionDelay: 1000,
			});

			setSocket(socketInstance);

			// Listen to the "getOnlineUsers" event to update online users
			socketInstance.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			// Handle connection error
			socketInstance.on("connect_error", (error) => {
				console.error("Connection error:", error.message);
			});

			// Cleanup function to close the socket on unmount or authUser change
			return () => {
				socketInstance.close();
				setSocket(null);
			};
		} else {
			// Close any existing socket connection if user logs out
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	return (
		<SocketContext.Provider value={{ socket, onlineUsers }}>
			{children}
		</SocketContext.Provider>
	);
};
