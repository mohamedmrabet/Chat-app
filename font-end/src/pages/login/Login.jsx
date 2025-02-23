import React, { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

function Login() {
const {login,loading}=useLogin()

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")


const HandleLogin = async(e) => {
e.preventDefault()
await login(username,password)
}

  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-black bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-black">
          Login
          <br /> <span className="text-blue-500">Chat app</span>
        </h1>
        <form onSubmit={HandleLogin}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-black">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full input-bordered h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text text-black">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input-bordered h-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Link
            to={"/signup"}
            className="text-sm text-black hover:underline hover:text-red-700 mt-2 inline-block"
          >
            {"Don't"} have account ?
          </Link>{" "}
          <div>
            <button className="btn btn-block btn-sm mt-2"
            disabled={loading}>
                {loading ? <span className='loading loading-spinner'></span> :"Login"}
        </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
