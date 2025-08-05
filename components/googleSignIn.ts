// lib/googleSignIn.ts
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "../firebase"

export const googleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    // You can store user data in your context or localStorage
    console.log("User:", user)
    return user
  } catch (error) {
    console.error("Google sign-in error", error)
    return null
  }
}
