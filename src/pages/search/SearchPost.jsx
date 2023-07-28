import { DataContext } from "../DataContext";
import { useContext, useRef, useState } from "react";
import Avatar from "react-avatar";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { BottomNavigation, BottomNavigationAction, Box, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PostComment from "../Postings/PostComment";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";


const SearchPost = ({ children }) => {
  const [value, setValue] = useState(0);

  const {chooseWant ,isLiked, allCmt} = useContext(DataContext);

  function handleCommentPost(event, id) {
    event.preventDefault();
    const index = chooseWant.findIndex((item) => item._id === id);
    const idDataPost = chooseWant[index];
    setSelectedPost(idDataPost);
  }
  const [selectedPost, setSelectedPost] = useState(null);
  const userPosting = JSON.parse(localStorage.getItem("access_token"));

  const handleLike = (event, id) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3000/createFavouritePost",
        { postId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        }
      )
      .then((response) => {
        console.log("Like added successfully");
      })
      .catch((error) => {
        console.error("Failed to add like", error);
      });
  };
  const handleDisLike = (event, id) => {
    const idLike = isLiked?.filter((like) => like?.post?._id === id)?.[0]._id;
    event.preventDefault();
    axios
      .delete(`http://localhost:3000/deleteFavouritePost/${idLike}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userPosting.data.accessToken}`,
        },
      })
      .then((response) => {
        console.log("DisLike added successfully");
      })
      .catch((error) => {
        console.error("Failed to add Dislike", error);
      });
  };
  const postCommentRef = useRef(null);

  return (
    <DataContext.Provider
      value={{ selectedPost,  }}
    >
      {children}
      <div className="px-5">
        {" "}
          <div className="container" >
            {Array.isArray(chooseWant) &&
              chooseWant
                .sort((a, b) => {
                  return (
                    new Date(b?.updatedAt).getTime() -
                    new Date(a?.updatedAt).getTime()
                  );
                })
                .map((post) => (
                  <form className="mt-3">
                    <div className="card p-5 shadow-sm bg-body rounded-3 border-0">
                      <div className="row">
                        <div className="col-md-1">
                          <Avatar
                            name={post?.userPosting?.fullname}
                            size="40"
                            round={true}
                            src={post?.userPosting?.img}
                          />
                        </div>
                        <div className="col-md-11">
                          <div>
                            <span className="posting-list__titleName">
                              {post?.userPosting?.fullname}
                            </span>
                            <span className="posting-list__titleName__date">
                              {new Date(post?.updatedAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text mt-2  d-block fw-bolder">
                        {post?.title}
                      </span>
                      <div className="row">
                        <div className="col-md-4 text-center">
                          <CropIcon /> {post?.rooms?.size}
                        </div>
                        <div className="col-md-4 text-center">
                          {" "}
                          <RoofingOutlinedIcon /> {post?.buildings?.buildingName}
                        </div>
                        <div className="col-md-4 text-center">
                          <PriceChangeOutlinedIcon />
                          {post?.rooms?.price}{" "}
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text my-2 d-block">
                        {post?.description}
                      </span>
                      <img className="rounded-3 mt-3" src={post?.img} alt="" />
                      <div className=" mx-4 my-2 ">
                          <div className="float-start posting-list__feel">
                            {
                              isLiked?.filter?.(
                                (like) => like?.post?._id === post?._id
                              )?.length
                            }{" "}
                            like
                          </div>
                          <div className="float-end">
                            <div className="posting-list__feel">
                              {" "}
                              {
                                allCmt?.filter?.(
                                  (cmt) => cmt?.posting?._id === post?._id
                                )?.length
                              }{" "}
                              bình luận
                            </div>
                          </div>
                        </div>
                      <hr className="posting-list__hr" />
                      <Box sx={{}}>
                          <BottomNavigation
                            showLabels
                            value={value}
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                          >
                            <BottomNavigationAction
                              icon={
                                isLiked?.filter(
                                  (f) => f?.post?._id === post?._id
                                )?.length > 0 ? (
                                  <FavoriteIcon sx={{ color: "#ec2d4d" }} />
                                ) : (
                                  <FavoriteIcon sx={{ color: "black" }} />
                                )
                              }
                              onClick={(event) => handleLike(event, post?._id)}
                            />
                            <BottomNavigationAction
                              icon={<DeleteIcon sx={{ color: "black  " }} />}
                              onClick={(event) =>
                                handleDisLike(event, post?._id)
                              }
                            />
                            <div style={{ display: "flex" }}>
                              <Button
                                onClick={(event) =>
                                  handleCommentPost(event, post._id)
                                }
                              >
                                CMT
                              </Button>
                              <PostComment ref={postCommentRef} />
                            </div>
                          </BottomNavigation>
                        </Box>
                    </div>
                  </form>
                ))}
          </div>
          <hr />
        </div>
      {/* </div> */}
    </DataContext.Provider>
  );
};
export default SearchPost;
