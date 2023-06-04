import axios from "axios";
import { useContext, useEffect, useMemo, useState } from "react";
import React from "react";
import toastr from "cogo-toast";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import Avatar from "react-avatar";
import { Link } from "react-router-dom";
import { CardContent, CardMedia, Typography, Card } from "@mui/material";
import DraftsIcon from "@mui/icons-material/Drafts";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
function PostingWait() {
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
  const PostingPending = <PendingIcon style={{ color: "blue" }} />;
  const PostingAprove = (
    <CheckCircleOutlineOutlinedIcon style={{ color: "violet" }} />
  );
  const [posting, setPosting] = useState([]);
  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting?.data?.user;
  const [refresh, setRefresh] = useState(false); // thêm state để xác định trạng thái của nút "Làm mới"

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/posts/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userPosting.data.accessToken}`,
        },
      });
      setPosting(response.data.data?.postings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refresh]); // thêm refresh vào dependency array để khi giá trị của refresh thay đổi thì useEffect sẽ chạy lại

  const handleRefresh = () => {
    setRefresh(!refresh); // đổi giá trị của refresh để gọi lại useEffect
  };

  const arrPostPeding = useMemo(() => {
    if (!posting) return [];

    return posting?.filter(
      (posting) =>
        posting?.status === "pending" &&
        posting?.userPosting?._id === userPostings?.id
    );
  }, [posting]);
  console.log(arrPostPeding);
  const arrPostApprove = useMemo(() => {
    if (!posting) return [];

    return posting?.filter(
      (posting) =>
        posting?.status === "approved" &&
        posting?.userPosting?._id === userPostings?.id
    );
  }, [posting]);
  return (
    <div className="posting-list">
      <DashboardWrapper>
        <DashboardWrapperMain>
          {Array.isArray(arrPostApprove) &&
            arrPostApprove
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
                            {post.status === "approved" && PostingAprove}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="fs-6 posting-list__color-text mt-2 ms-2 d-block fw-bolder">
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
                        <PriceChangeOutlinedIcon style={{ color: "#b48845" }} />
                        {post?.rooms?.price}{" "}
                      </div>
                    </div>
                    <span className="fs-6 posting-list__color-text my-2 ms-2 d-block">
                      {post?.description}
                    </span>
                    <img className="rounded-3 mt-3" src={post?.img} alt="" />
                    <div className=" mx-4 my-2 "></div>
                    <hr className="posting-list__hr" />
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
                  <span
                    className="posting-list__titleName__date"
                    onClick={handleRefresh}
                  >
                    user
                  </span>
                </div>
              </div>
            </div>
          </div>
          {Array.isArray(arrPostPeding) &&
            arrPostPeding
              .sort((a, b) => {
                return (
                  new Date(b?.createdAt).getTime() -
                  new Date(a?.createdAt).getTime()
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
                          {post.status === "pending" && PostingPending}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4" style={{ fontSize: 15 }}>
                        <CropIcon className="d-block" /> {post?.rooms?.size}
                      </div>
                      <div className="col-md-4" style={{ fontSize: 15 }}>
                        {" "}
                        <RoofingOutlinedIcon className="d-block" />{" "}
                        {post?.buildings?.buildingName}
                      </div>
                      <div className="col-md-4 " style={{ fontSize: 15 }}>
                        <PriceChangeOutlinedIcon className="d-block" />
                        {post?.rooms?.price}{" "}
                      </div>
                    </div>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxHeight: 80 }}
                    >
                      {post?.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
        </DashboardWrapperRight>
      </DashboardWrapper>
    </div>
  );
}

export default PostingWait;
