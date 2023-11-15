import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import PropTypes from "prop-types";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseContext } from "./firebase-context";
import { useRouter } from "next/router";
import axios from "axios";

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const { auth } = useContext(FirebaseContext);
  const router = useRouter();

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then((res) => {
        window.sessionStorage.setItem("authenticated", "true");
        router.push("/");
      });
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = (name, email, password) => {
    const newUser = {
      name,
      email,
      password,
    };

    axios
      .post("/api/auth/signup", newUser)
      .then((response) => {
        router.push("/");
        console.log("Signup success:", response?.data);
      })
      .catch((error) => {
        console.error("Signup failed:", error.response?.data);
      });
  };

  const signOut = () => {};

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};
export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
