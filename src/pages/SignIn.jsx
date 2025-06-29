import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import { auth, provider } from '../firebase'

const SignIn = ({onSignIn}) => {
  const handleSignIn = async () => {
    try{
        const result = await signInWithPopup(auth, provider);
        onSignIn(result.user);
    }catch(err){
        console.log(err);
    }
  }
  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">📚 Welcome to BookVerse</h1>
      <button
        onClick={handleSignIn}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    </div>
  )
}

export default SignIn