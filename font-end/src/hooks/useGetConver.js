// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// const useGetConver = () => {
// 	const [loading, setLoading] = useState(false);
// 	const [conversations, setConversations] = useState([]);

// 	useEffect(() => {
// 		const getConversations = async () => {
// 			setLoading(true);
// 			try {
// 				const res = await fetch("http://localhost:5000/user/get", {
// 					method: "GET",
// 					credentials: "include",
// 				});

// 				if (!res.ok) {
// 					throw new Error("Failed to fetch conversations");
// 				}

// 				const data = await res.json(); // Parse the response as JSON
// 				setConversations(data); // Set the parsed data as conversations
//                 console.log(data);
// 			} catch (error) {
// 				toast.error(error.message);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		getConversations();
// 	}, []);

// 	return { loading, conversations };
// };

// export default useGetConver;


import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useGetConver = () => {
	const [loading, setLoading] = useState(false);
	const [conversations, setConversations] = useState([]);

	useEffect(() => {
		const getConversations = async () => {
			setLoading(true);
			try {
				
				const res = await axios.get("http://localhost:5000/user/get", {
					withCredentials: true, // Ensure cookies are sent with the request
				});
				

				setConversations(res.data);
				console.log("helllo",res.data);
			} catch (error) {
				toast.error(error.response?.data?.error || error.message);
			} finally {
				setLoading(false);
			}
		};

		getConversations();
	}, []);

	return { loading, conversations };
};

export default useGetConver;
