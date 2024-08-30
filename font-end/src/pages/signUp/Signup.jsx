import React from "react";
import GenderBox from "./GenderBox";
import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

function Signup() {

const [input,setInputs] = useState({
    fullname:"",
    username:"",
    password:"",
    confirmPassword:"",
    gender:""
})

const {loading , signup} = useSignup()


const handleCheck = (gender) =>{
setInputs({...input,gender})
}

const handleSubmit = async (e) =>{
    e.preventDefault(),
   await signup(input)
}
  return (
    <div className="flex flex-col items-center justify-center min-w-96 mx-auto">
      <div className="w-full p-6 rounded-lg shadow-md bg-black bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
        <h1 className="text-3xl font-semibold text-center text-black">
          SignUp
          <br /> <span className="text-blue-500">Chat app</span>
        </h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-black">Fullname</span>
            </label>
            <input
              type="text"
              placeholder="Enter Fullname"
              className="w-full input-bordered h-10"
              value={input.fullname}
              onChange={(e) => setInputs({ ...input, fullname: e.target.value })}
            />
          </div>
          <div>
            <label className="label p-2">
              <span className="text-base label-text text-black">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              className="w-full input-bordered h-10"
              value={input.username}
              onChange={(e) => setInputs({ ...input, username: e.target.value })}
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
              value={input.password}
              onChange={(e)=> setInputs({...input,password:e.target.value})}
            />
          </div>
          <div>
            <label className="label">
              <span className="text-base label-text text-black">
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className="w-full input-bordered h-10"
              value={input.confirmPassword}
              onChange={(e)=> setInputs({...input,confirmPassword:e.target.value})}
            />
          </div>

         <GenderBox onCheckChange = {handleCheck} selectedGender = {input.gender}/>
          <Link
            to={"/login"}
            className="text-sm text-black hover:underline hover:text-blue-600 mt-2 inline-block"
          >
            Already have an account?
          </Link>
          <div>
            <button className="btn btn-block btn-sm mt-2">SignUp</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
