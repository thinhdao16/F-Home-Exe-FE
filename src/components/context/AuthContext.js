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

export const AuthContext = createContext(); // Tạo AuthContext

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState("");
  const [buildings, setBuildings] = useState([]);
  const buildingsData = buildings.data;
  const [posting, setPosting] = useState([]);
  const [imgPostDraft, setImgPostDraft] = useState(null);
  const [allCmt, setAllCmt] = useState([]);
  const [isLiked, setIsLiked] = useState([]);
  const [chooseWant, setChooseWant] = useState([]);
  const [point, setPoint] = useState([]);
  const [isPendingUpdated, setIsPendingUpdated] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [userProfile, setUserProfile] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [reloadUserProfile, setReloadUserProfile] = useState(null);
  const [postingPush, setPostingPush] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [updateUser, setUpdateUser] = useState(null);
  const [loadingGlobal, setLoadingGlobal] = useState(false);
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
        const user = JSON.parse(localStorage.getItem("All_User"));

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

        if (user) {
          setAllUser(user);
        } else {
          axios
            .get("https://f-home-be.vercel.app/getAllUsers")
            .then((response) => {
              // Xử lý dữ liệu từ API mới theo cách bạn muốn
              // localStorage.setItem("All_User", JSON.stringify(response.data));
              setAllUser(response.data);
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
  }, [reloadUserProfile, updateUser]);

  return (
    <AuthContext.Provider
      value={{
        setIsPendingUpdated,
        isPendingUpdated,
        selectedPost,
        setSelectedPost,
        point,
        setPoint,
        openModal,
        setOpenModal,
        userProfile,
        setUserProfile,
        reloadUserProfile,
        setReloadUserProfile,
        postingPush,
        setPostingPush,
        loadingGlobal,
        setLoadingGlobal,
      }}
    >
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
          allUser,
          setAllUser,
          updateUser,
          setUpdateUser,
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
