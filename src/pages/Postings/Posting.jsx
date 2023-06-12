import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import Avatar from "react-avatar";
import "./posting.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PostModal from "./PostMoal";
import PostComment from "./PostComment";
import { DataContext } from "../DataContext";
import toastr from "cogo-toast";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  styled,
} from "@mui/material";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DraftsIcon from "@mui/icons-material/Drafts";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Textarea } from "@mui/joy";
import { AuthContext } from "../../components/context/AuthContext";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import Dropzone from "react-dropzone";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LoadingOverlay from "react-loading-overlay";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";

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

function Posting({ children, filePath }) {
  const [success, setSuccess] = useState(false);

  const [open, setOpen] = useState(false);
  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting?.data?.user;
  const { allCmt, isLiked } =
    useContext(DataContext);
  const { setIsPendingUpdated, point, userProfile ,postingPush,} =
    useContext(AuthContext);

  ;
  const arrPostPublish = useMemo(() => {
    if (!postingPush) return [];
    return postingPush?.postings?.filter(
      (posting) => posting.status === "published"
    );
  }, [postingPush]);

  const arrPostDarft = useMemo(() => {
    if (!postingPush) return [];

    return postingPush?.postings?.filter(
      (posting) =>
        posting.status === "draft" &&
        posting?.userPosting?._id === userPostings?.id
    );
  }, [postingPush]);
  const [value, setValue] = React.useState(0);

  function handlePostPending(event, id) {
    event.preventDefault();
    const confirmed = window.confirm("Bạn có chắc chắn muốn gửi bài này?");
    if (confirmed) {
      if (point?.point > 0) {
        axios
          .put(
            `https://f-home-be.vercel.app/posts/confirm/${id}`,
            { status: "pending" },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userPosting.data.accessToken}`,
              },
            }
          )
          .then((response) => {
            toastr.success("Successfully you wait pls", {
              position: "top-right",
              heading: "Done",
            });
            setIsPendingUpdated((prev) => !prev);
          })
          .catch((error) => {
            toastr.error("post fail", {
              position: "top-right",
              heading: "Done",
            });
            console.log(error);
          });
      } else {
        toastr.warn("You dont enough point", {
          position: "top-right",
          heading: "Fail",
        });
      }
    }
  }

  function handlePostRejct(event, id) {
    event.preventDefault();

    if (window.confirm("Bạn có chắc muốn reject post này không?")) {
      axios
        .delete(`https://f-home-be.vercel.app/posts/delete/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        })
        .then((response) => {
          toastr.success("delêt successfully", {
            position: "top-right",
            heading: "Done",
          });
          setIsPendingUpdated((prev) => !prev);
        })
        .catch((error) => {
          toastr.error("delete fail", {
            position: "top-right",
            heading: "Done",
          });
          console.log(error);
        });
    }
  }
  const handleLike = (event, id) => {
    event.preventDefault();
    axios
      .post(
        "https://f-home-be.vercel.app/createFavouritePost",
        { postId: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        }
      )
      .then((response) => {
        setIsPendingUpdated((prev) => !prev);
        // console.log("Like added successfully");
      })
      .catch((error) => {
        console.error("Failed to add like", error);
      });
  };
  const handleDisLike = (event, id) => {
    const idLike = isLiked?.filter((like) => like?.post?._id === id)?.[0]._id;
    event.preventDefault();
    axios
      .delete(`https://f-home-be.vercel.app/deleteFavouritePost/${idLike}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userPosting.data.accessToken}`,
        },
      })
      .then((response) => {
        setIsPendingUpdated((prev) => !prev);
      })
      .catch((error) => {
        console.error("Failed to add Dislike", error);
      });
  };

  const styleStatus = {
    display: "inline-block",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    backgroundColor: "white",
    color: "black",
    textAlign: "center",
    lineHeight: "40px",
    fontSize: 10,
    boxShadow: "0px 7px 29px 0px rgba(100, 100, 111, 0.2)",
    marginLeft: 13,
  };

  const PostingDraft = <DraftsIcon style={{ color: "brown" }} />;
  const PostingPublic = <PublicOutlinedIcon style={{ color: "green" }} />;

  const [pointScore, setPointScore] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitPoint = async (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem("access_token"));
    if (!token) {
      console.log("No access token found.");
      return;
    }
    var formData = new FormData();
    // formData.append("point", pointScore)
    let isMounted = true;
    console.log(pointScore);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://f-home-be.vercel.app/postformpoint",
        { point: pointScore },
        {
          headers: {
            Authorization: `Bearer ${token.data.accessToken}`,
            // "Content-Type": "multipart/form-data",
          },
        }
      );
      toastr.success("Post successfully", {
        position: "top-right",
        heading: "Done",
      });
      if (isMounted) {
        console.log(response.data);
        setOpen(false);
      }
    } catch (error) {
      toastr.warn("You have an unprocessed transaction", {
        position: "top-right",
        heading: "Done",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  };

  //comment
  const [openModal, setOpenModal] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [productComment, setProductComment] = useState(null);
  const token = JSON.parse(localStorage.getItem("access_token"));

  const [comments, setComments] = useState([]);

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
      setLoading(true);
      const response = await axios.post(
        "https://f-home-be.vercel.app/postAllPostingCommentByPost",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token.data.accessToken}`,
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
    console.log(idDataPost)
    setProductComment(idDataPost);

    try {
      const response = await axios.get(
        `https://f-home-be.vercel.app/getAllPostingCommentByPost/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token.data.accessToken}`,
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
  return (
    <>
      {/* {isLoading && (
      <Loading loading background="#666" loaderColor="#fff" />
    )} */}
      <DataContext.Provider value={{ arrPostPublish }}>
        {children}

        <div className="posting-list">
          <DashboardWrapper>
            <DashboardWrapperMain>
              <form className="card shadow-sm bg-body rounded-3 border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-1">
                      <Avatar
                        name="John Doe"
                        size="40"
                        round={true}
                        src={userProfile?.img}
                      />
                    </div>
                    <div className="col-md-11">
                      <PostModal />
                    </div>
                  </div>
                  <hr className="mx-1" />
                  <div className="row px-3 ">
                    <div className="col-md-4 text-center">Video trực tiếp</div>
                    <div className="col-md-4 text-center">Ảnh/video</div>
                    <div className="col-md-4 text-center">
                      Cảm xúc/hoạt động
                    </div>
                  </div>
                </div>
              </form>
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
                        <img
                          className="rounded-3 mt-3"
                          src={post?.img}
                          alt=""
                        />
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
                                  .filter(
                                    (f) => f?.user?._id === userPostings?.id
                                  )?.length > 0 ? (
                                  <FavoriteIcon sx={{ color: "#ec2d4d" }} />
                                ) : (
                                  <FavoriteIcon sx={{ color: "black" }} />
                                )
                              }
                              onClick={(event) =>
                                isLiked
                                  ?.filter((f) => f?.post?._id === post?._id)
                                  .filter(
                                    (f) => f?.user?._id === userPostings?.id
                                  )?.length > 0
                                  ? handleDisLike(event, post?._id)
                                  : handleLike(event, post?._id)
                              }
                              label="Like"
                            />
                            <BottomNavigationAction
                              icon={
                                <ChatBubbleOutlineIcon
                                />
                              }
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
                                                        ?.userPostingComment
                                                        ?.img
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
                                          {({
                                            getRootProps,
                                            getInputProps,
                                          }) => (
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
                            {/* </div> */}
                            <PostComment />
                          </BottomNavigation>
                        </Box>
                      </div>
                    </form>
                  ))}
            </DashboardWrapperMain>
            <DashboardWrapperRight>
              <div className="card border-0 mb-4  ">
                <div className="row">
                  <div className="col-md-2">
                    <Link to="/home/profiles">
                      <Avatar
                        name="John Doe"
                        size="55"
                        round={true}
                        src={userProfile?.img}
                      />
                    </Link>
                  </div>
                  <div className="col-md-10">
                    <div className="mt-2  ms-2">
                      <Link to="/home/profiles">
                        <span className="posting-list__titleName">
                          {userProfile?.fullname}
                        </span>
                      </Link>
                      <span className="posting-list__titleName__date">
                        {point?.point}
                      </span>
                      <AddCircleOutlineIcon
                        className="fs-6 ms-1"
                        onClick={() => setOpen(true)}
                      />
                      <Modal
                        aria-labelledby="modal-title"
                        aria-describedby="modal-desc"
                        open={open}
                        onClose={() => setOpen(false)}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <form onSubmit={handleSubmitPoint}>
                          <Sheet
                            variant="outlined"
                            sx={{
                              maxWidth: 500,
                              borderRadius: "md",
                              p: 3,
                            }}
                            style={{
                              border: "none",
                              "background-color": "white",
                              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                            }}
                          >
                            <ModalClose
                              variant="outlined"
                              sx={{
                                top: "calc(-1/4 * var(--IconButton-size))",
                                right: "calc(-1/4 * var(--IconButton-size))",
                                boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                                borderRadius: "50%",
                                bgcolor: "background.body",
                              }}
                              style={{
                                "background-color": "white",
                                border: "none",
                              }}
                            />
                            <Typography
                              component="h2"
                              id="modal-title"
                              level="h1"
                              fontWeight="lg"
                              mb={1}
                              className="text-center fs-3"
                              style={{ fontWeight: 500 }}
                            >
                              Deposit method
                            </Typography>
                            <div className="text-center d-block">
                              <img
                                src="https://firebasestorage.googleapis.com/v0/b/auth-fhome.appspot.com/o/profilePics%2Ftpbank.jpg?alt=media&token=abe240f1-807a-4d77-b6c9-e916ff8d20d1&_gl=1*euyfrm*_ga*MjY1NDExNDQuMTY4NTA5OTM4OQ..*_ga_CW55HF8NVT*MTY4NjU5NDkwNy40LjEuMTY4NjU5NDk0OC4wLjAuMA.."
                                style={{
                                  width: 320,
                                  height: 356,
                                  objectFit: "cover",
                                  marginBottom: "10px",
                                }}
                              />
                            </div>

                            <span
                              className=" text-dark"
                              style={{ fontSize: 14 }}
                            >
                              <ContentPasteIcon
                                style={{ color: "#b48845", fontSize: 17 }}
                              />{" "}
                              Transfer Contents
                            </span>
                            <Textarea
                              name="Plain"
                              variant="plain"
                              className="shadow-sm rounded-3 mb-3 bg-light"
                              defaultValue={userPostings?.email}
                              readOnly={true}
                              style={{ fontSize: 14 }}
                            />

                            <span
                              className="text-dark"
                              style={{ fontSize: 14 }}
                            >
                              <CurrencyExchangeIcon
                                style={{ color: "#b48845", fontSize: 17 }}
                              />{" "}
                              Point
                            </span>
                            <Textarea
                              name="Plain"
                              placeholder="Point score..."
                              variant="plain"
                              value={pointScore}
                              onChange={(e) => setPointScore(e.target.value)}
                              className="shadow-sm rounded-3 mb-1"
                              style={{ fontSize: 14 }}
                            />
                            <span
                              className=" mt-3"
                              style={{ fontSize: 14, color: "#b48845" }}
                            >
                              1D = 1000VND
                            </span>
                            <Button
                              variant="contained"
                              type="submit"
                              style={{
                                marginBottom: "12px",
                                backgroundColor: "#b48845",
                                display: "block",
                                margin: "10px 0 0 0",
                              }}
                            >
                              Submit
                            </Button>
                          </Sheet>
                        </form>
                      </Modal>
                      {success && setOpen(false)}
                    </div>
                  </div>
                </div>
              </div>
              {Array.isArray(arrPostDarft) &&
                arrPostDarft
                  .sort((a, b) => {
                    return (
                      new Date(b?.updatedAt).getTime() -
                      new Date(a?.updatedAt).getTime()
                    );
                  })
                  .map((post) => (
                    <Card sx={{ maxWidth: 270, marginBottom: 2 }}>
                      <CardMedia
                        component="img"
                        alt="green iguana"
                        height="140"
                        image={post?.img}
                      />
                      <CardContent>
                        <div className="row mb-2">
                          <div className="col-md-8">
                            <span
                              style={{
                                wordWrap: "break-word",
                                display: "block",
                                marginRight: -45,
                                overflow: "auto",
                                maxHeight: 35,
                              }}
                            >
                              {post?.title}
                            </span>
                          </div>{" "}
                          <div className="col-md-2" style={{ marginTop: -5 }}>
                            {" "}
                            <div style={styleStatus}>
                              {" "}
                              {post.status === "draft" && PostingDraft}
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4" style={{ fontSize: 15 }}>
                            <CropIcon
                              className="d-block"
                              style={{ color: "#b48845" }}
                            />{" "}
                            {post?.rooms?.size}
                          </div>
                          <div className="col-md-4" style={{ fontSize: 15 }}>
                            {" "}
                            <RoofingOutlinedIcon
                              className="d-block"
                              style={{ color: "#b48845" }}
                            />{" "}
                            {post?.buildings?.buildingName}
                          </div>
                          <div className="col-md-4 " style={{ fontSize: 15 }}>
                            <PriceChangeOutlinedIcon
                              className="d-block"
                              style={{ color: "#b48845" }}
                            />
                            {post?.rooms?.price}{" "}
                          </div>
                        </div>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ maxHeight: 80, overflow: "auto" }}
                        >
                          {post?.description}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small">
                          <DoneOutlinedIcon
                            sx={{ color: "green" }}
                            onClick={(event) =>
                              handlePostPending(event, post._id)
                            }
                          />
                        </Button>
                        <Button size="small">
                          {" "}
                          <DeleteOutlinedIcon
                            sx={{ color: "red" }}
                            onClick={(event) =>
                              handlePostRejct(event, post._id)
                            }
                          />
                        </Button>
                      </CardActions>
                    </Card>
                  ))}
            </DashboardWrapperRight>
          </DashboardWrapper>
        </div>
      </DataContext.Provider>
    </>
  );
}

export default Posting;

// const [dataPosting, setDataPosting] = useState({
//   buildings: [],
//   postings: [],
//   rooms: [],
//   users: [],
// });
// const arrPost = useMemo(() => dataPosting?.postings, [dataPosting]);
// const responses = await Promise.all([
//   axios.get("https://f-home-be.vercel.app/getBuildings"),
//   axios.get("https://f-home-be.vercel.app/getAllStatus"),
//   axios.get("https://f-home-be.vercel.app/getRooms"),
//   axios.get("https://f-home-be.vercel.app/getAllUsers"),
// ]);
// const buildings = responses[0].data.data.buildings;
// const postings = responses[1].data.data.postings;
// const rooms = responses[2].data.data.rooms;
// const users = responses[3].data;
// const newData = postings.map((post) => {
//   const building = buildings.find((b) => b._id === post.buildings);
//   const buildingName = building ? building.buildingName : "";
//   const room = rooms.find((r) => r._id === post.rooms);
//   const roomPrice = room ? room?.price : "";
//   const roomSize = room ? room?.size : "";
//   const roomName = room ? room?.roomName : "";

//   const user = users.find((u) => u._id === post?.userPosting?._id);
//   const userEmail = user ? user.email : "";
//   const userFullName = user ? user.fullname : "";
//   const userImg = user ? user.img : "";

//   return {
//     ...post,
//     buildingName,
//     roomName,
//     roomPrice,
//     roomSize,
//     userEmail,
//     userFullName,
//     userImg,
//   };
// });

// const buildingIds = newData.map((post) => post?.buildings);
// const filteredBuildingIds = buildings
//   .filter((b) => buildingIds.includes(b?._id))
//   .map((b) => b?._id);

// setDataPosting({
//   users,
//   rooms,
//   buildings,
//   postings: newData,
//   buildingIds: filteredBuildingIds,
// });

// // Get favorites
// const response = await axios.get(
//   "https://f-home-be.vercel.app/getFavouriteByUser",
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userPosting.data.accessToken}`,
//     },
//   }
// );
// setIsLiked(response.data);
