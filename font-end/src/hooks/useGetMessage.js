import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();

    useEffect(() => {
        const getMessages = async () => {
            if (!selectedConversation?.id) return;  // Check if selectedConversation is available

            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/message/${selectedConversation.id}`, {
                    method: "GET",
                    credentials: "include",  // Include credentials (like cookies)
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch messages");
                }

                const data = await res.json();  // Parse the response as JSON
                setMessages(data);  // Set the parsed data as messages
                console.log("Fetched messages:", data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?.id) getMessages();
    }, [selectedConversation?.id, setMessages]);

    return { messages, loading };
};

export default useGetMessages;
