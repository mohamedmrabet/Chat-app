import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import useConversation from "../../zustand/useConversation";
import useGetConver from "../../hooks/useGetConver";
import toast from "react-hot-toast";

function SearchInput() {
  const [search, setSearch] = useState("");
  const { setSelectedConversation } = useConversation();
  const { conversations } = useGetConver();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate search input
    if (!search) return;
    if (search.length < 3) {
      return toast.error("Search must be at least 3 characters long");
    }



   
    const foundConversation = conversations.find((x) =>
      x.fullname?.toLowerCase().includes(search.toLowerCase())
    );

    if (foundConversation) {
      setSelectedConversation(foundConversation); 
      setSearch(""); 
    } else {
      toast.error("No user found with that name");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="input input-bordered rounded-full"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <FiSearch />
      </button>
    </form>
  );
}

export default SearchInput;
