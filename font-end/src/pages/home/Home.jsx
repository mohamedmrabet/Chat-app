import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer.jsx";

function Home() {
  return (
    <div className="flex sm:h-[450px] md:[550px] rounded-lg overflow-hidden bg-black bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      <Sidebar />

      <MessageContainer />
    </div>
  );
}

export default Home;
