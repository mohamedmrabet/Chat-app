import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    const sendMessage = async (message) => {
		if (!selectedConversation?.id) {
			console.error("No conversation selected");
			return;
		}
	
		setLoading(true);
		try {
			const res = await fetch(`http://localhost:5000/message/send/${selectedConversation.id}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
				credentials: "include",
			});
			const data = await res.json();
			if (data.error) throw new Error(data.error);
	
			setMessages([...messages, data]);
			console.log("Message sent:", data);
	
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};
    return { sendMessage, loading };
};

export default useSendMessage;
