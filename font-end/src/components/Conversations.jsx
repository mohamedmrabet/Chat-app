import useGetConversations from "../hooks/useGetConver";
import { getRandomEmoji } from "../utils/emojis.js";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	return (
		<div className='py-2 flex flex-col overflow-auto'>
			{conversations.length > 0 && conversations.map((conversation, idx) => (
				<Conversation
					key={conversation.id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading ? <span className='loading loading-spinner mx-auto'></span> : null}
		</div>
	);
};

export default Conversations;
