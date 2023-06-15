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
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CropIcon from "@mui/icons-material/Crop";
import RoofingOutlinedIcon from "@mui/icons-material/RoofingOutlined";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AuthContext } from "../../components/context/AuthContext";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
function createData(
  name,
  calories,
  fat,
  carbs,
  protein,
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
];

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
  const [pointUser, setPointUser] = useState([])
  const { setIsPendingUpdated, isPendingUpdated } = useContext(AuthContext)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/posts/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        });
        setPosting(response.data.data?.postings);
        const responsePoint = await axios.get('http://localhost:3000/getformpoint', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userPosting.data.accessToken}`,
          },
        });
        const data = responsePoint?.data?.data?.point;
        setPointUser(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [isPendingUpdated])

  const handleApproved = (id) => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn gửi bài này?");
    if (confirmed) {
      fetch(`http://localhost:3000/deleteformpoint/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userPosting.data.accessToken}`,
        },
        body: JSON.stringify({
          status: "approved"
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          toastr.success("Successfully you wait pls", {
            position: "top-right",
            heading: "Done",
          });
          setIsPendingUpdated((prev) => !prev);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  const arrPostPeding = useMemo(() => {
    if (!posting) return [];

    return posting?.filter(
      (posting) =>
        posting?.status === "pending" &&
        posting?.userPosting?._id === userPostings?.id
    );
  }, [posting]);
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
          <form className="mt-3">
            <div className="card p-3 shadow-sm bg-body rounded-3 border-0">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>	Transfer Contents</TableCell>
                      <TableCell align="center">Point</TableCell>
                      <TableCell align="center">Date</TableCell>
                      <TableCell align="center">Progess</TableCell>
                      <TableCell align="center">Confirm</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pointUser.map((row) => (
                      <TableRow
                        key={row?.user?.email}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row?.user?.email}
                        </TableCell>
                        <TableCell align="center">{row?.point}</TableCell>
                        <TableCell align="center"> {new Date(row?.updatedAt).toLocaleString()}</TableCell>
                        <TableCell align="center"> <CircularProgress style={{'height':25, "width":25, 'color':"#b48845"}} /></TableCell>
                        <TableCell align="center">   <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleApproved(row?._id)}
                        >
                          Delete
                        </button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

            </div>
          </form>
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
                  // onClick={handleRefresh}
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
