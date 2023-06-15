import { Link } from "react-router-dom";
import "./profile.scss";
import toastr from "cogo-toast";
import { DataContext } from "../DataContext";
import { useContext, useEffect, useMemo, useState } from "react";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import axios from "axios";
import { toast } from "react-toastify";
import Avatar from "react-avatar";
import Box from "@mui/material/Box";
import {
  BottomNavigation,
  BottomNavigationAction,
  Button,
  styled,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PostComment from "../Postings/PostComment";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import Dropzone from "react-dropzone";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import { AuthContext } from "../../components/context/AuthContext";
import LoadingOverlay from "react-loading-overlay";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import { Textarea } from "@mui/joy";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Modal from "@mui/joy/Modal";

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
});
const Profile = () => {
  const {
    setIsPendingUpdated,
    isPendingUpdated,
    point,
    setPoint,
    userProfile,
    postingPush,
  } = useContext(AuthContext);
  const userProfileToken = JSON.parse(
    localStorage.getItem("access_token")
  )?.data;
  const [value, setValue] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);

  // const [dataProfile, setDataProfile] = useState(userProfile?.user);
  const [fullName, setFullName] = useState(userProfile?.fullname);
  const [email, setEmail] = useState(userProfile?.email);
  const [phone, setPhone] = useState(userProfile?.phoneNumber);
  const [newImage, setNewImage] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isDropzoneEnabled, setIsDropzoneEnabled] = useState(false);
  const [posts, setPost] = useState("");
  const [newImageEdit, setNewImageEdit] = useState(null);

  const { posting, allCmt, isLiked } = useContext(DataContext);

  const arrPostPublish = useMemo(() => {
    if (!postingPush) return [];

    return postingPush?.postings?.filter(
      (posting) =>
        posting.status === "published"
        && posting?.userPosting?._id === userProfile?._id
    );
  }, [postingPush]);
  const handleSubmitFormProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", fullName);
    formData.append("email", email);
    formData.append("phoneNumber", phone);
    formData.append("img", newImage);
    try {
      const response = await axios.put(
        `http://localhost:3000/userProfile/${userProfile?._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userProfileToken.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // setReloadUserProfile((prev) => !prev)
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
            Authorization: `Bearer ${userProfileToken.accessToken}`,
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
  const [loading, setLoading] = useState(false);

  //comment
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [productComment, setProductComment] = useState(null);

  const [comments, setComments] = useState([]);
  console.log(comments);

  const handleClose = () => setOpenModal(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedPostComment = productComment?._id;
    var formData = new FormData();
    formData.append("description", description);
    formData.append("img", selectedFile);
    formData.append("posting", selectedPostComment);
    let isMounted = true;
    try {
      // setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/postAllPostingCommentByPost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${userProfileToken.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (isMounted) {
        setOpenModal(false);
        setIsPendingUpdated((prev) => !prev);
      }
      toastr.success("Comment successfully", {
        position: "top-right",
        heading: "Done",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  };
  const handleGetRoomUpdate = async (event, id) => {
    setOpenModal(true);
    event.preventDefault();
    const index = postingPush?.postings?.findIndex((item) => item._id === id);
    const idDataPost = postingPush?.postings[index];
    console.log(idDataPost);
    setProductComment(idDataPost);

    try {
      const response = await axios.get(
        `http://localhost:3000/getAllPostingCommentByPost/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userProfileToken.accessToken}`,
          },
        }
      );
      setComments(response.data.data.postingComments);
    } catch (error) {
      console.error(error);
      // Handle the error accordingly (e.g., show an error message to the user)
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setShowDeleteButton(false);
  };
  const handleFileChange = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };
  // end comment
  //dislike
  const handleDisLike = (event, id) => {
    const idLike = isLiked?.filter((like) => like?.post?._id === id)?.[0]._id;
    event.preventDefault();
    axios
      .delete(`http://localhost:3000/deleteFavouritePost/${idLike}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userProfileToken.accessToken}`,
        },
      })
      .then((response) => {
        setIsPendingUpdated((prev) => !prev);
      })
      .catch((error) => {
        console.error("Failed to add Dislike", error);
      });
  };
  //end

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
                            <span className="posting-list__titleName">
                              {post?.userPosting?.fullname}
                            </span>
                            <span className="posting-list__titleName__date">
                              {new Date(post?.updatedAt).toLocaleString()}
                            </span>
                            <span className="ms-2">
                              {post?.status === "published" && PostingPublic}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="fs-6 posting-list__color-text mt-2  d-block fw-bolder">
                        {post?.title}
                      </span>
                      <div className="row text-dark">
                        <div className="col-md-4 text-center">
                          <CropIcon style={{ color: "#b48845" }} />{" "}
                          {post?.rooms?.size}
                        </div>
                        <div className="col-md-4 text-center">
                          {" "}
                          <RoofingOutlinedIcon
                            style={{ color: "#b48845" }}
                          />{" "}
                          {post?.buildings?.buildingName}
                        </div>
                        <div className="col-md-4 text-center">
                          <PriceChangeOutlinedIcon
                            style={{ color: "#b48845" }}
                          />
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
                          <a href="" className="posting-list__feel">
                            {" "}
                            {
                              allCmt?.filter?.(
                                (cmt) => cmt?.posting?._id === post?._id
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
                              isLiked
                                ?.filter((f) => f?.post?._id === post?._id)
                                .filter((f) => f?.user?._id === userProfile?.id)
                                ?.length > 0 ? (
                                <FavoriteIcon sx={{ color: "#ec2d4d" }} />
                              ) : (
                                <FavoriteIcon sx={{ color: "black" }} />
                              )
                            }
                            onClick={(event) =>
                              isLiked
                                ?.filter((f) => f?.post?._id === post?._id)
                                .filter((f) => f?.user?._id === userProfile?.id)
                                ?.length > 0
                                ? handleDisLike(event, post?._id)
                                : handleLike(event, post?._id)
                            }
                            label="Like"
                          />
                          <BottomNavigationAction
                            icon={<ChatBubbleOutlineIcon />}
                            onClick={(event) =>
                              handleGetRoomUpdate(event, post._id)
                            }
                            label="Comment"
                          />
                          <StyledModal
                            open={openModal}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <form onSubmit={handleSubmit}>
                              <LoadingOverlay
                                active={loading}
                                spinner
                                text="Loading your content..."
                              >
                                <Box
                                  style={{
                                    position: "relative",
                                    padding: "24px 24px 0 24px",
                                    boxShadow:
                                      "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                                  }}
                                  width={700}
                                  // minHeight={475}
                                  maxHeight={650}
                                  bgcolor="white"
                                  borderRadius={5}
                                  overflow="auto"
                                  sx={{
                                    "::-webkit-scrollbar": {
                                      display: "none",
                                    },
                                  }}
                                >
                                  <div
                                    className="text-center"
                                    style={{
                                      margin: "-24px -24px 10px -24px",
                                      padding: 24,
                                      boxShadow:
                                        "rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px",
                                    }}
                                  >
                                    <span
                                      sx={{
                                        position: "absolute",
                                        top: "0",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        marginTop: 2,
                                        zIndex: 1,
                                      }}
                                      color="black"
                                      textAlign="center"
                                      style={{
                                        fontWeight: 600,
                                        color: "black",
                                        fontSize: "1.25rem",
                                      }}
                                    >
                                      Bài viết của{" "}
                                      {productComment?.userPosting?.fullname}
                                    </span>
                                  </div>
                                  <div
                                    style={{
                                      maxHeight: "497px",
                                      overflow: "auto",
                                      scrollbarWidth: "none",
                                      msOverflowStyle: "none",
                                      "::-webkit-scrollbar": {
                                        display: "none",
                                      },
                                    }}
                                    className="postmodal-scoll"
                                  >
                                    <div className="py-3 bg-body rounded-3 border-0">
                                      <div className="row">
                                        <div className="col-md-1">
                                          <Avatar
                                            name={
                                              productComment?.userPosting
                                                ?.fullname
                                            }
                                            size="40"
                                            round={true}
                                            src={
                                              productComment?.userPosting?.img
                                            }
                                          />
                                        </div>
                                        <div className="col-md-11">
                                          <div>
                                            <span className="posting-list__titleName">
                                              {
                                                productComment?.userPosting
                                                  ?.fullname
                                              }
                                            </span>
                                            <span className="posting-list__titleName__date">
                                              {new Date(
                                                productComment?.updatedAt
                                              ).toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <span className="fs-6 posting-list__color-text mt-2  d-block fw-bolder">
                                        {productComment?.title}
                                      </span>
                                      <div className="row">
                                        <div className="col-md-4 text-center">
                                          <CropIcon
                                            style={{ color: "#b48845" }}
                                          />{" "}
                                          {productComment?.rooms?.roomName}
                                        </div>
                                        <div className="col-md-4 text-center">
                                          {" "}
                                          <RoofingOutlinedIcon />{" "}
                                          {
                                            productComment?.buildings
                                              ?.buildingName
                                          }
                                        </div>
                                        <div className="col-md-4 text-center">
                                          <PriceChangeOutlinedIcon />
                                          {productComment?.rooms?.price}{" "}
                                        </div>
                                      </div>
                                      <span className="fs-6 posting-list__color-text my-2 d-block">
                                        {productComment?.description}
                                      </span>
                                      <img
                                        className="rounded-3 mt-3"
                                        src={productComment?.img}
                                        alt=""
                                        style={{ maxWidth: 600 }}
                                      />
                                    </div>
                                    {Array.isArray(comments) &&
                                      comments
                                        .sort((a, b) => {
                                          return (
                                            new Date(b?.updatedAt).getTime() -
                                            new Date(a?.updatedAt).getTime()
                                          );
                                        })
                                        .map((commentss) => (
                                          <div>
                                            <div className="row my-3">
                                              <div className="col-md-1">
                                                {" "}
                                                <Avatar
                                                  name={
                                                    commentss
                                                      ?.userPostingComment
                                                      ?.fullname
                                                  }
                                                  size="32"
                                                  round={true}
                                                  src={
                                                    commentss
                                                      ?.userPostingComment?.img
                                                  }
                                                />
                                              </div>
                                              <div
                                                className="col-md-11 rounded-3"
                                                style={{
                                                  marginLeft: "-10px",
                                                }}
                                              >
                                                <div
                                                  className="bg-light p-2 rounded-4"
                                                  style={{
                                                    width: "fit-content",
                                                  }}
                                                >
                                                  {" "}
                                                  <span className="fw-bolder fs-6 text-dark">
                                                    {
                                                      commentss
                                                        ?.userPostingComment
                                                        ?.fullname
                                                    }
                                                  </span>
                                                  <span className="d-block fs-6 text-dark">
                                                    {commentss?.description}
                                                  </span>
                                                </div>
                                                <span
                                                  className="d-block text-dark"
                                                  style={{
                                                    fontSize: 12,
                                                    marginLeft: 15,
                                                  }}
                                                >
                                                  {new Date(
                                                    commentss?.updatedAt
                                                  ).toLocaleString()}
                                                </span>
                                                <img
                                                  src={commentss?.img}
                                                  alt=""
                                                  style={{
                                                    maxWidth: 200,
                                                    borderRadius: 15,
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                  </div>
                                  <div
                                    style={{
                                      position: "sticky",
                                      width: "108%",
                                      bottom: "0",
                                      display: "flex",
                                      flexDirection: "column",
                                      backgroundColor: "white",
                                      margin: "0 -24px 0 -24px",
                                      padding: "12px 24px 0 24px",
                                      boxShadow:
                                        "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                                    }}
                                  >
                                    <UserBox>
                                      <Avatar
                                        src={userProfile?.img}
                                        size="32"
                                        round={true}
                                      />
                                      <Textarea
                                        sx={{
                                          width: "100%",
                                          backgroundColor: "#f0f2f5",
                                          color: "black",
                                          borderRadius: 25,
                                        }}
                                        id="standard-multiline-static"
                                        multiline
                                        rows={1}
                                        placeholder={`${userProfile?.fullname} ơi bạn muốn đăng gì thế ?`}
                                        variant="standard"
                                        value={description}
                                        onChange={(e) =>
                                          setDescription(e.target.value)
                                        }
                                      />
                                      <Dropzone
                                        onDrop={handleFileChange}
                                        accept="image/*"
                                      >
                                        {({ getRootProps, getInputProps }) => (
                                          <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <ImageOutlinedIcon
                                              style={{
                                                fontSize: "25px",
                                                color: "#b48845",
                                              }}
                                            />{" "}
                                          </div>
                                        )}
                                      </Dropzone>
                                      <Button
                                        variant="contained"
                                        type="submit"
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          backgroundColor: "#b48845",
                                          color: "white",
                                          border: "none",
                                          padding: 0,
                                        }}
                                      >
                                        <ForwardOutlinedIcon
                                          style={{
                                            fontSize: "25px",
                                            color: "#b48845",
                                            margin: -22,
                                          }}
                                        />
                                      </Button>
                                    </UserBox>
                                    <div
                                      style={{
                                        display: "block",
                                        marginLeft: 50,
                                      }}
                                    >
                                      {selectedFile ? (
                                        <div>
                                          <img
                                            className="rounded-3 shadow"
                                            src={URL.createObjectURL(
                                              selectedFile
                                            )}
                                            alt="preview"
                                            style={{
                                              maxHeight: 80,
                                              objectFit: "cover",
                                              width: "auto",
                                              marginBottom: 17,
                                              marginTop: -8,
                                            }}
                                          />
                                          {showDeleteButton && (
                                            <button onClick={handleDelete}>
                                              Delete
                                            </button>
                                          )}
                                        </div>
                                      ) : (
                                        <p
                                          className="text-center"
                                          style={{
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            color: "#65676b",
                                          }}
                                        ></p>
                                      )}
                                    </div>
                                  </div>
                                </Box>
                              </LoadingOverlay>
                            </form>
                          </StyledModal>
                          <PostComment />
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
                              name={userProfile?.fullname}
                              size="160"
                              round={true}
                              src={
                                newImage
                                  ? URL.createObjectURL(newImage)
                                  : userProfile?.img
                              }
                              className="shadow-sm"
                            />
                          </div>
                        )}
                      </Dropzone>
                      <h4 className="mt-2">{userProfile?.fullname}</h4>
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
                                setFullName(userProfile?.fullname);
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
                                setEmail(userProfile?.email);
                              }
                            }}
                            readOnly={true}
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
                                setEmail(userProfile?.phoneNumber);
                              }
                            }}
                          />
                        </div>
                        {/* <div className="form-group">
                          <label className=" control-label ms-1">
                            AdminID:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            defaultValue={userProfile?.id}
                          />
                        </div> */}
                        {/* <div className="form-group">
                          <label className=" control-label ms-1">
                            Username:
                          </label>
                          <input
                            className="form-control"
                            type="text"
                            defaultValue={userProfile?.roleName}
                          />
                        </div> */}
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
