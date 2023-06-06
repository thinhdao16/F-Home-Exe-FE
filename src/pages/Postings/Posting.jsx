import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DeleteIcon from "@mui/icons-material/Delete";
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  TextField,
  Typography,
} from "@mui/material";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DraftsIcon from "@mui/icons-material/Drafts";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
// import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
// import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Image } from "antd";
import { AccountCircle, CurrencyBitcoinOutlined, CurrencyExchange } from "@mui/icons-material";
import { Textarea } from "@mui/joy";
import { AuthContext } from "../../components/context/AuthContext";
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
function Posting({ children, filePath }) {
  const [success, setSuccess] = useState(false);

  const [open, setOpen] = useState(false);
  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting?.data?.user;

  const { posting, setPosting, allCmt, setAllCmt, isLiked, setIsLiked, point, setPoint, } =
    useContext(DataContext);
  console.log(isLiked)
  const { setIsPendingUpdated, isPendingUpdated, selectedPost, setSelectedPost } = useContext(AuthContext)
  // console.log(selectedPost)
  const [postingPush, setPostingPush] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/getAllFavourite", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        });
        setIsLiked(response.data?.data?.favourite);

        const responsePost = await axios.get("http://localhost:3000/posts/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        });
        setPostingPush(responsePost?.data?.data);

        const responsePostComment = await axios.get("http://localhost:3000/allComment/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        });
        setAllCmt(responsePostComment?.data?.data?.postingComments);

        const responsePoint = await axios.get(`http://localhost:3000/users/${userPostings.id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        });
        setPoint(responsePoint?.data);
      } catch (error) {
        toastr.error("Can not find post", {
          position: "top-right",
          heading: "Done",
        });
      }
    };
    fetchData();
  }, [isPendingUpdated]);
  const arrPostPublish = useMemo(() => {
    if (!postingPush) return [];
    return postingPush?.postings?.filter(
      (posting) => posting.status === "published"
    );
  }, [postingPush]);

  const arrPostDarft = useMemo(() => {
    if (!postingPush) return [];

    return postingPush?.postings?.filter(
      (posting) => posting.status === "draft" &&
        posting?.userPosting?._id === userPostings?.id
    );
  }, [postingPush]);

  const postCommentRef = useRef(null);
  const [value, setValue] = React.useState(0);

  function handleCommentPost(event, id) {
    console.log(id)
    event.preventDefault();
    const index = postingPush?.postings?.findIndex((item) => item._id === id);
    const idDataPost = postingPush?.postings[index];
    setSelectedPost(idDataPost);

    if (postCommentRef.current) {
      postCommentRef.current.click();
    }
  }
  function handlePostPending(event, id) {
    event.preventDefault();
    const confirmed = window.confirm("Bạn có chắc chắn muốn gửi bài này?");
    if (confirmed) {
      axios
        .put(
          `http://localhost:3000/posts/confirm/${id}`,
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
    }
  }


  function handlePostRejct(event, id) {
    event.preventDefault();

    if (window.confirm("Bạn có chắc muốn reject post này không?")) {
      axios
        .delete(`http://localhost:3000/posts/delete/${id}`, {
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

  const [pointScore, setPointScore] = useState("")
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
    console.log(pointScore)
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/postformpoint",
        { "point": pointScore },
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
  return (
    <>
      {/* {isLoading && (
      <Loading loading background="#666" loaderColor="#fff" />
    )} */}
      <DataContext.Provider value={{ selectedPost, arrPostPublish }}>
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
                        src={userPostings?.img}
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
                          {/* {post?.description} */}
                          {/* {setSelectedPost(post?.description)} */}
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
                                  .filter((f) => f?.user?._id === userPostings?.id)?.length > 0 ? (
                                  <FavoriteIcon sx={{ color: "#ec2d4d" }} />
                                ) : (
                                  <FavoriteIcon sx={{ color: "black" }} />
                                )
                              }
                              onClick={(event) =>
                                isLiked
                                  ?.filter((f) => f?.post?._id === post?._id)
                                  .filter((f) => f?.user?._id === userPostings?.id)?.length > 0
                                  ? handleDisLike(event, post?._id)
                                  : handleLike(event, post?._id)
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
                        src={userPostings?.img}
                      />
                    </Link>
                  </div>
                  <div className="col-md-10">
                    <div className="mt-2  ms-2">
                      <Link to="/home/profiles">
                        <span className="posting-list__titleName">
                          {userPostings?.fullname}
                        </span>
                      </Link>
                      {/* <span
                        className="posting-list__titleName__date"
                        onClick={handleRefresh}
                      >
                        user
                      </span> */}
                      <span className="posting-list__titleName__date">{point?.point}</span>
                      <AddCircleOutlineIcon className="fs-6 ms-1" onClick={() => setOpen(true)} />
                      <Modal
                        aria-labelledby="modal-title"
                        aria-describedby="modal-desc"
                        open={open}
                        onClose={() => setOpen(false)}
                        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        <form onSubmit={handleSubmitPoint}>
                          <Sheet
                            variant="outlined"
                            sx={{
                              maxWidth: 500,
                              borderRadius: 'md',
                              p: 3,
                            }}
                            style={{ 'border': 'none', 'background-color': 'white', 'boxShadow': '0 2px 12px 0 rgba(0 0 0 / 0.2)', }}
                          >
                            <ModalClose
                              variant="outlined"
                              sx={{
                                top: 'calc(-1/4 * var(--IconButton-size))',
                                right: 'calc(-1/4 * var(--IconButton-size))',
                                boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                                borderRadius: '50%',
                                bgcolor: 'background.body',
                              }}
                              style={{ 'background-color': 'white', 'border': 'none' }}
                            />
                            <Typography
                              component="h2"
                              id="modal-title"
                              level="h1"
                              fontWeight="lg"
                              mb={1}
                              className="text-center fs-3"
                              style={{ 'fontWeight': 500, }}
                            >
                              Deposit method
                            </Typography>
                            <div className="text-center d-block">
                              <img src="https://cdn.britannica.com/17/155017-050-9AC96FC8/Example-QR-code.jpg" style={{ 'width': 320, 'height': 320, 'objectFit': 'cover', 'marginBottom': "10px" }} />
                            </div>

                            <span className=" text-dark" style={{ 'fontSize': 14 }}>
                              {/* <DnsOutlinedIcon style={{ color: "#b48845" }} /> */}
                              <ContentPasteIcon style={{ "color": "#b48845", 'fontSize': 17 }} />  Transfer Contents
                            </span>
                            <Textarea
                              name="Plain"
                              variant="plain"
                              className="shadow-sm rounded-3 mb-3 bg-light"
                              defaultValue={userPostings?.email}
                              readOnly={true} style={{ 'fontSize': 14 }}
                            />

                            <span className="text-dark" style={{ 'fontSize': 14 }}>
                              {/* <DnsOutlinedIcon style={{ color: "#b48845" }} /> */}
                              <CurrencyExchangeIcon style={{ "color": "#b48845", 'fontSize': 17 }} />   Point
                            </span>
                            <Textarea
                              name="Plain"
                              placeholder="Point score..."
                              variant="plain"
                              value={pointScore}
                              onChange={(e) => setPointScore(e.target.value)}
                              className="shadow-sm rounded-3 mb-1" style={{ 'fontSize': 14 }}
                            />
                            <span className=" mt-3" style={{ 'fontSize': 14, "color": "#b48845" }}>
                              {/* <DnsOutlinedIcon style={{ color: "#b48845" }} /> */}
                              1D = 1000VND
                            </span>
                            <Button
                              variant="contained"
                              type="submit"
                              style={{ marginBottom: "12px", backgroundColor: "#b48845", 'display': 'block', 'margin': '10px 0 0 0' }}
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
//   axios.get("http://localhost:3000/getBuildings"),
//   axios.get("http://localhost:3000/getAllStatus"),
//   axios.get("http://localhost:3000/getRooms"),
//   axios.get("http://localhost:3000/getAllUsers"),
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
//   "http://localhost:3000/getFavouriteByUser",
//   {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${userPosting.data.accessToken}`,
//     },
//   }
// );
// setIsLiked(response.data);
