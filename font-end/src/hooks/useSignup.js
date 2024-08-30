import { useContext, useState } from "react";
import { useAuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const {setAuthUser}=useAuthContext()


  const signup = async ({ fullname, username, password, confirmPassword, gender }) => {
    const success = handleInputErrors({ fullname, username, password, confirmPassword, gender });
    if (!success) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, username, password, confirmPassword, gender }),
      });

      // Check if response is JSON
      // const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = await res.json() 
if(data.error) {
    throw new Error (data.error)
}

//Local Storage
localStorage.setItem("user-info" ,JSON.stringify(data))
setAuthUser(data)

      if (!res.ok) {
        const errorMessage = data?.error || "Something went wrong";
        throw new Error(errorMessage);
      }

      console.log(data); // Log the response data
      toast.success("Signup successful!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, signup };
};

export default useSignup;

function handleInputErrors({ fullname, username, password, confirmPassword, gender }) {
  if (!fullname || !username || !password || !confirmPassword || !gender) {
    toast.error("Please fill in all fields");
    return false;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return false;
  }

  if (password.length < 6) {
    toast.error("Password must be at least 6 characters");
    return false;
  }

  return true;
}
