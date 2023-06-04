import { Link } from "react-router-dom";
import "./profile.scss";
import toastr from "cogo-toast";
import { DataContext } from "../DataContext";
import { useContext, useEffect, useMemo, useState } from "react";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";

import axios from "axios";
import { toast } from "react-toastify";
import Avatar from "react-avatar";
import { Box } from "@mui/system";
import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";

import PostComment from "../Postings/PostComment";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import Dropzone from "react-dropzone";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

const Profile = () => {
  const userProfile = JSON.parse(localStorage.getItem("access_token"))?.data;
  const [value, setValue] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  const [dataProfile, setDataProfile] = useState(userProfile?.user);
  const [fullName, setFullName] = useState(userProfile?.user?.fullname);
  const [email, setEmail] = useState(userProfile?.user?.email);
  const [phone, setPhone] = useState(userProfile?.user?.phoneNumber);
  const [newImage, setNewImage] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isDropzoneEnabled, setIsDropzoneEnabled] = useState(false);
  const [posts, setPost] = useState("");
  const [newImageEdit, setNewImageEdit] = useState(null);


  const { posting, allCmt, isLiked } = useContext(DataContext);

  const arrPostPublish = useMemo(() => {
    if (!posting) return [];
    return posting.filter(
      (posting) =>
        posting.status === "published" &&
        posting.userPosting?._id === userProfile?.user?.id
    );
  }, [posting]);
  function handleCommentPost(event, id) {
    event.preventDefault();
    const index = arrPostPublish.findIndex((item) => item._id === id);
    const idDataPost = arrPostPublish[index];
    setSelectedPost(idDataPost);
  }

  const handleSubmitFormProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("email", email);
    formData.append("phoneNumber", phone);
    formData.append("img", newImage);
    try {
      const response = await axios.put(
        `http://localhost:3000/userProfile/${dataProfile?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userProfile.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cập nhật localStorage
      // const newData = response.data;
      // console.log(newData);
      // setFullName(newData?.fullname);
      // setEmail(newData?.email);
      // setPhone(newData?.phoneNumber)
      toastr.success("Update successfully", {
        position: "top-right",
        heading: "Done",
      });
    } catch (error) {
      toastr.error("Can not updateProfile", {
        position: "top-right",
        heading: "Done",
      });
      console.error(error);
    }
  };

  const handleDrop = (acceptedFiles) => {
    setNewImage(acceptedFiles[0]);
  };
  const handleDropEdit = (acceptedFiles) => {
    setNewImageEdit(acceptedFiles[0]);
  };
  const handleLike = (event, id) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3000/createFavouritePost",
        { postId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userProfile.accessToken}`,
          },
        }
      )
      .then((response) => {
        // console.log("Like added successfully");
        console.log(response);
      })
      .catch((error) => {
        console.error("Failed to add like", error);
      });
  };
  const handleEdit = () => {
    setIsDropzoneEnabled(!isDropzoneEnabled);
    setIsEditing(!isEditing);
  };
  const PostingPublic = <PublicOutlinedIcon style={{ color: "green" }} />;
  return (
    <DataContext.Provider value={{ selectedPost }}>
      <div className="posting-list">
        <DashboardWrapper>
          <DashboardWrapperMain>
            {Array.isArray(arrPostPublish) &&
              arrPostPublish
                .sort((a, b) => {
                  return (
                    new Date(b?.updatedAt).getTime() -
                    new Date(a?.updatedAt).getTime()
                  );
                })
                .map((post) => (
                  <form className="mt-3">
                    <div className="card p-3 shadow-sm bg-body rounded-3 border-0">
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
                          {isEditing ? (
                                <div>
                                  <input
                                    type="text"
                                    className="posting-list__titleName border-0 shadow rounded-3 p-2 mb-2"
                                    style={{ outline: "none" }}
                                    value={post.userPosting.fullname}
                                    onChange={(e) =>
                                      setPost({
                                        ...post,
                                        userPosting: {
                                          ...post.userPosting,
                                          fullname: e.target.value,
                                        },
                                      })
                                    }
                                  />
                                </div>
                              ) : (
                                <span className="posting-list__titleName">
                                  {post?.userPosting?.fullname}
                                </span>
                              )}
                            <span className="posting-list__titleName__date">
                              {new Date(post?.updatedAt).toLocaleString()}
                            </span>
                            <span className="ms-2">
                              {post?.status === "published" && PostingPublic}
                            </span>
                            <Button onClick={handleEdit}>click</Button>
                          </div>
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text mt-2 ms-2 d-block fw-bolder">
                        {post?.title}
                      </span>
                      <div className="row text-dark">
                        <div className="col-md-4 text-center">
                          <CropIcon /> {post?.rooms?.size}
                        </div>
                        <div className="col-md-4 text-center">
                          {" "}
                          <RoofingOutlinedIcon />{" "}
                          {post?.buildings?.buildingName}
                        </div>
                        <div className="col-md-4 text-center">
                          <PriceChangeOutlinedIcon />
                          {post?.rooms?.price}{" "}
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text my-2 ms-2 d-block">
                        {post?.description}
                      </span>
                      {isEditing ? (
                          <Dropzone
                            onDrop={handleDropEdit}
                            disabled={!isDropzoneEnabled}
                          >
                            {({ getRootProps, getInputProps }) => (
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <img
                                  className="rounded-3 mt-3"
                                  src={
                                    newImageEdit
                                      ? URL.createObjectURL(newImageEdit)
                                      : post?.img
                                  }
                                  alt=""
                                />
                              </div>
                            )}
                          </Dropzone>
                        ) : (
                          <img
                            className="rounded-3 mt-3"
                            src={post?.img}
                            alt=""
                          />
                        )}
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
                          <a href="" className="posting-list__feel">
                            {" "}
                            {
                              allCmt?.filter?.(
                                (like) => like?.post?._id === post?._id
                              )?.length
                            }{" "}
                            bình luận
                          </a>
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
                              isLiked?.filter((f) => f?.post?._id === post?._id)
                                ?.length > 0 ? (
                                <FavoriteIcon sx={{ color: "#ec2d4d" }} />
                              ) : (
                                <FavoriteIcon sx={{ color: "black" }} />
                              )
                            }
                            onClick={(event) => handleLike(event, post?._id)}
                          />

                          <div style={{ display: "flex" }}>
                            <Button
                              onClick={(event) =>
                                handleCommentPost(event, post._id)
                              }
                            >
                              submit
                            </Button>
                            <PostComment />
                          </div>
                          {/* </button> */}
                        </BottomNavigation>
                      </Box>
                    </div>
                  </form>
                ))}
          </DashboardWrapperMain>
          <DashboardWrapperRight>
            <div className="scroll-container">
              <div className="body-profile">
                <form onSubmit={handleSubmitFormProfile}>
                  <div className="text-dark">
                    <div className="text-center">
                      <Dropzone onDrop={handleDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Avatar
                              name={dataProfile?.fullname}
                              size="160"
                              round={true}
                              src={
                                newImage
                                  ? URL.createObjectURL(newImage)
                                  : dataProfile?.img
                              }
                              className="shadow-sm"
                            />
                          </div>
                        )}
                      </Dropzone>
                      <h4 className="mt-2">{dataProfile?.fullname}</h4>
                    </div>
                    <hr />
                    <div className="row">
                      <div className=" personal-info">
                        <div className="form-group">
                          <label className="control-label ms-1">
                            Full name:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setFullName(dataProfile?.fullname);
                              }
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">Email:</label>
                          <input
                            className="form-control"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setEmail(dataProfile?.email);
                              }
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">Phone:</label>
                          <input
                            className="form-control"
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setEmail(dataProfile?.phoneNumber);
                              }
                            }}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">
                            AdminID:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            defaultValue={dataProfile?.id}
                          />
                        </div>
                        <div className="form-group">
                          <label className=" control-label ms-1">
                            Username:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            defaultValue={dataProfile?.roleName}
                          />
                        </div>
                        <div className="form-group text-center">
                          <label className=" control-label" />
                          <input
                            type="submit"
                            className="btn btn-primary me-2 shadow"
                            value="Save"
                          />
                          <input
                            type="reset"
                            className="btn btn-default shadow ms-2"
                            value="Cancel"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </DashboardWrapperRight>
        </DashboardWrapper>
      </div>
    </DataContext.Provider>
  );
};
export default Profile;
