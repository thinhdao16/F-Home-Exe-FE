import "./assets/libs/boxicons-2.1.1/css/boxicons.min.css";
import "./scss/App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import User from "./pages/Users/User";
import MainLayout from "./layout/MainLayout";
import Profile from "./pages/Profiles/Profile";
import React from "react";
import Protected from "../src/components/context/Protected";
import { AuthContextProvider } from "./components/context/AuthContext";
import Login from "./pages/login/Login";
import Upload from "./pages/Uploads/Upload";
import Posting from "./pages/Postings/Posting";
import CreateRoom from "./pages/Rooms/CreateRoom";
import SearchPost from "./pages/search/SearchPost";

import PostingWait from "./pages/PostingStatus/PostingWait";
function App() {
  return (
    <React.Fragment>
      <AuthContextProvider>
        {/* <DataContext.Provider> */}
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path="home" element={<MainLayout />}>
                <Route
                  index
                  element={
                    <Protected>
                      <Posting />
                    </Protected>
                  }
                />
                <Route
                  path="users"
                  element={
                    <Protected>
                      <User />
                    </Protected>
                  }
                />
                <Route
                  path="home"
                  element={
                    <Protected>
                      <Upload />
                    </Protected>
                  }
                />
                <Route
                  path="postings"
                  element={
                    <Protected>
                      <Posting />
                    </Protected>
                  }
                />
                <Route
                  path="createRooms"
                  element={
                    <Protected>
                      <CreateRoom />
                    </Protected>
                  }
                />
                <Route
                  path="stats"
                  element={
                    <Protected>
                      <User />
                    </Protected>
                  }
                />
                      <Route
                  path="searchPost"
                  element={
                    <Protected>
                     <SearchPost/>
                    </Protected>
                  }
                />
                 
                <Route
                  path="profiles"
                  element={
                    <Protected>
                      <Profile />
                    </Protected>
                  }
                />
                <Route
                  path="wait"
                  element={
                    <Protected>
                      <PostingWait />
                    </Protected>
                  }
                />
              </Route>
              <Route exact path="" element={<Login />} />
            </Route>
          </Routes>
        </BrowserRouter>
        {/* </DataContext.Provider> */}
      </AuthContextProvider>
    </React.Fragment>
  );
}

export default App;
