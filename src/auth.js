import {auth, db} from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export function getErrorMessage(code) {
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email format";
    case "auth/user-not-found":
      return "Account not found. Please sign up first";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "Email already registered";
    case "auth/weak-password":
      return "Password should be at least 6 characters";
    case "auth/invalid-credential":
      return "Invalid email or password";
    case "auth/user-disabled":
      return "Account has been disabled";
    case "auth/too-many-requests":
      return "Too many login attempts. Try again later";
    case "auth/operation-not-allowed":
      return "This operation is not allowed";
    case "auth/popup-closed-by-user":
      return "Google sign-in cancelled";
    case "auth/network-request-failed":
      return "Network error. Check your connection";
    default:
      return "An error occurred. Please try again";
  }
}

export async function signup(email, password, profileData = {}){
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      currency: profileData.currency || "₹",
      userType: profileData.userType || "student",
      income: profileData.income || 0,
      incomeFrequency: profileData.incomeFrequency || "monthly",
      budget: profileData.budget ? Number(profileData.budget) : null,
      createdAt: new Date(),
      authMethod: "email"
    });
    
    return userCredential;
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginWithGoogle(){
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function createGoogleUserProfile(user) {
  const userRef = doc(db, "users", user.uid);
  
  // Check if profile already exists
  const { getDoc } = await import("firebase/firestore");
  const snap = await getDoc(userRef);
  
  // Return true if new user, false if existing
  return !snap.exists();
}

export async function saveGoogleUserProfile(user, profileData) {
  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    displayName: user.displayName || "",
    photoURL: user.photoURL || "",
    currency: profileData.currency || "₹",
    userType: profileData.userType || "working",
    income: profileData.income || 0,
    incomeFrequency: profileData.incomeFrequency || "monthly",
    budget: profileData.budget ? Number(profileData.budget) : null,
    createdAt: new Date(),
    authMethod: "google"
  });
}

export function logout() {
  return signOut(auth);
}