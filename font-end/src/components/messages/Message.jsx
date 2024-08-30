import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime.js";
import useConversation from "../../zustand/useConversation";

const Message = ({ message }) => {


	const { authUser } = useAuthContext();
	const { selectedConversation } = useConversation();
	const fromMe = message.sender_id === authUser._id;
	const formattedTime = extractTime(message.created_at);
	const chatClassName = fromMe ? "chat-end" : "chat-start";
	const profilePic = fromMe ? authUser.profilePic : selectedConversation?.profilepic;
	const bubbleBgColor = fromMe ? "bg-blue-500" : "";
console.log("hhd",selectedConversation);

	const shakeClass = message.shouldShake ? "shake" : "";

	return (
		<div className={`chat ${chatClassName}`}>
			<div className='chat-image avatar'>
				<div className='w-10 rounded-full'>
					<img alt='Tailwind CSS chat bubble component' src={profilePic} />
				</div>
			</div>
			<div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>{message.message}</div>
			<div className='chat-footer text-black  text-xs flex gap-1 items-center'>{formattedTime}</div>
		</div>
	);
};
export default Message;
