import { useContext, createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../context/firebase";
import axios from "axios";
import { DataContext } from "../../pages/DataContext";
import toastr from "cogo-toast";

export const AuthContext = createContext(); // Tạo AuthContext

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [buildings, setBuildings] = useState([]);
  const buildingsData = buildings.data;
  const [posting, setPosting] = useState([]);
  const [imgPostDraft, setImgPostDraft] = useState(null)
  const [allCmt, setAllCmt] = useState([])
  const [isLiked, setIsLiked] = useState([]);
  const [chooseWant, setChooseWant] = useState([])
  const [point, setPoint] = useState([])
  const [isPendingUpdated, setIsPendingUpdated] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null)
  const [userProfile, setUserProfile] = useState([])
  const [openModal, setOpenModal] = useState(false)
  const [reloadUserProfile, setReloadUserProfile] = useState(null)
  const [postingPush, setPostingPush] = useState([]);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();
    setAccessToken(token);
    setUser(user);
  };

  const logOut = () => {
    signOut(auth);
    localStorage.clear();
    window.location.reload();
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        currentUser.getIdToken().then((token) => {
          setAccessToken(token);
        });
      }
    });

    const fetchData = async () => {
      try {
        const storedBuildings = JSON.parse(localStorage.getItem("buildings"));
        const storedApartments = JSON.parse(localStorage.getItem("account_start"));
        const token = JSON.parse(localStorage.getItem("access_token"))?.data;

        if (storedBuildings) {
          setBuildings(storedBuildings);
        } else {
          axios
            .get("https://f-home-be.vercel.app/getBuildings")
            .then((response) => {
              setBuildings(response.data);
              localStorage.setItem("buildings", JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();

    return () => {
      unsubscribe();
    };
  }, [reloadUserProfile]);


  return (
    <AuthContext.Provider value={{
      setIsPendingUpdated, isPendingUpdated, selectedPost,
      setSelectedPost, point,
      setPoint, openModal,
      setOpenModal,
      userProfile, setUserProfile, reloadUserProfile, setReloadUserProfile, postingPush, setPostingPush
    }}>
      <DataContext.Provider
        value={{
          googleSignIn,
          logOut,
          user,
          accessToken,
          buildingsData,
          posting,
          setPosting,
          imgPostDraft,
          setImgPostDraft,
          allCmt,
          setAllCmt,
          isLiked,
          setIsLiked,
          chooseWant,
          setChooseWant,

        }}
      >
        {children}
      </DataContext.Provider>
    </AuthContext.Provider>
  );
}

// export const UserAuth = () => {
//   return useContext(AuthContext);
// };
