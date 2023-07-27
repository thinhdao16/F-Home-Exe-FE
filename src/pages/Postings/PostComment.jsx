import { Avatar, Button, Modal, styled } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Dropzone from "react-dropzone";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Textarea } from "@mui/joy";
import { DataContext } from "../DataContext";
import ForwardOutlinedIcon from "@mui/icons-material/ForwardOutlined";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { toast } from 'react-toastify';
import CropIcon from "@mui/icons-material/Crop";
import LoadingOverlay from "react-loading-overlay";
import { AuthContext } from "../../components/context/AuthContext";

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

const PostComment = () => {
  const [open, setOpen] = useState(false);

  const [success, setSuccess] = useState(false);

  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting?.data?.user;

  const [description, setDescription] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const token = JSON.parse(localStorage.getItem("access_token"));

  const [comments, setComments] = React.useState([]);
  // console.log(comments)
  const [loading, setLoading] = useState(false);

  const {
    setIsPendingUpdated,
    isPendingUpdated,
    selectedPost,
    setSelectedPost,
    openModal,
    setOpenModal,
  } = useContext(AuthContext);

  const handleClose = () => setOpen(false);

  // console.log(selectedPost)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const selectedPostComment = selectedPost?._id;
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
        setOpen(false);
        setIsPendingUpdated((prev) => !prev);
      }
      toast.success("Comment successfully", {
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
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     try {
  //       const selectedPostComment = selectedPost._id;
  //       const response = await axios.get(
  //         `https://f-home-be.vercel.app/getAllPostingCommentByPost/${selectedPostComment}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token.data.accessToken}`,
  //           },
  //         }
  //       );
  //       setComments(response.data.data.postingComments);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchComments();
  // }, [isPendingUpdated]);

  const handleDelete = () => {
    setSelectedFile(null);
    setShowDeleteButton(false);
  };
  const handleFileChange = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };
  const handleGetRoomUpdate = () => {
    setOpen(true);
  };
  if (!selectedPost) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleGetRoomUpdate}
        variant="contained"
        fullWidth={true}
        className="rounded-5 bg-light shadow-none text-secondary"
      >
        Comments
      </Button>
      {/* Modal */}
      <StyledModal
        open={open}
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
              style={{ position: "relative", padding: "24px 24px 0 24px" }}
              width={700}
              minHeight={475}
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
                  style={{ fontWeight: 600, color: "black" }}
                >
                  Tạo bài viết
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
                <div className="p-3 bg-body rounded-3 border-0">
                  <div className="row">
                    <div className="col-md-1">
                      <Avatar
                        name={selectedPost?.userPosting?.fullname}
                        size="40"
                        round={true}
                        src={selectedPost?.userPosting?.img}
                      />
                    </div>
                    <div className="col-md-11">
                      <div>
                        <span className="posting-list__titleName">
                          {selectedPost?.userPosting?.fullname}
                        </span>
                        <span className="posting-list__titleName__date">
                          {new Date(selectedPost?.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="fs-6 posting-list__color-text mt-2  d-block fw-bolder">
                    {selectedPost?.title}
                  </span>
                  <div className="row">
                    <div className="col-md-4 text-center">
                      <CropIcon style={{ color: "#b48845" }} />{" "}
                      {selectedPost?.rooms?.roomName}
                    </div>
                    <div className="col-md-4 text-center">
                      {" "}
                      <RoofingOutlinedIcon />{" "}
                      {selectedPost?.buildings?.buildingName}
                    </div>
                    <div className="col-md-4 text-center">
                      <PriceChangeOutlinedIcon />
                      {selectedPost?.rooms?.price}{" "}
                    </div>
                  </div>
                  <span className="fs-6 posting-list__color-text my-2 d-block">
                    {selectedPost?.description}
                  </span>
                  <img
                    className="rounded-3 mt-3"
                    src={selectedPost?.img}
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
                              name={commentss?.userPostingComment.fullname}
                              size="10"
                              round={true}
                              src={commentss?.userPostingComment?.img}
                            />
                          </div>
                          <div className="col-md-11 rounded-3">
                            <div
                              className="bg-light p-2 rounded-4"
                              style={{ width: "fit-content" }}
                            >
                              {" "}
                              <span className="fw-bolder fs-6 text-dark">
                                {commentss?.userPostingComment?.fullname}
                              </span>
                              <span className="d-block fs-6 text-dark">
                                {commentss?.description}
                              </span>
                            </div>
                            <span
                              className="d-block text-dark"
                              style={{ fontSize: 12, marginLeft: 15 }}
                            >
                              {new Date(commentss?.updatedAt).toLocaleString()}
                            </span>
                            <img
                              src={commentss?.img}
                              alt=""
                              style={{ maxWidth: 200, borderRadius: 15 }}
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
                  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                }}
              >
                <UserBox>
                  <Avatar
                    src={userPostings.img}
                    sx={{ width: 35, height: 35 }}
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
                    placeholder={`${userPostings.fullname} ơi bạn muốn đăng gì thế ?`}
                    variant="standard"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Dropzone onDrop={handleFileChange} accept="image/*">
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <ImageOutlinedIcon
                          style={{ fontSize: "25px", color: "#b48845" }}
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
                <div style={{ display: "block", marginLeft: 50 }}>
                  {selectedFile ? (
                    <div>
                      <img
                        className="rounded-3 shadow"
                        src={URL.createObjectURL(selectedFile)}
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
                        <button onClick={handleDelete}>Delete</button>
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
      {/* {success && setOpen(false)} */}
    </>
  );
};

export default PostComment;
