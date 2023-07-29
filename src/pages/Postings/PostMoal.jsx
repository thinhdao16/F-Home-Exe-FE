import {
  Avatar,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import Dropzone from "react-dropzone";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import { Textarea } from "@mui/joy";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../../components/context/AuthContext";
import { Audio } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

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

const PostModal = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [success, setSuccess] = useState(false);
  const [roomIds, setRoomIds] = useState([]);
  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data?.data?.buildings;
  const roomUserId = roomIds?.data?.rooms;
  const userPosting = JSON.parse(localStorage.getItem("access_token"));
  const userPostings = userPosting?.data?.user;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [buildingName, setBuildingName] = useState("");
  const [buildingId, setBuildingId] = useState("");
  const [loading, setLoading] = useState(false);

  const { setIsPendingUpdated, userProfile } = useContext(AuthContext);
  const handleSubmit = (event) => {
    event.preventDefault();
    const emailExists = userProfile?.phoneNumber;
    if (emailExists !== "") {
      const token = JSON.parse(localStorage.getItem("access_token"));
      if (!token) {
        console.log("No access token found.");
        return;
      }
      var formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("buildings", buildingId);
      formData.append("rooms", room);
      formData.append("img", selectedFile);
      if (token?.data?.user?.roleName === "landlord") {
        formData.append("type", "lease");
      } else if (token?.data?.user?.roleName === "fptmember") {
        formData.append("type", "share");
      }
      let isMounted = true;

      setLoading(true);

      axios
        .post("https://f-home-be.vercel.app/posts/create", formData, {
          headers: {
            Authorization: `Bearer ${token.data.accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          toast.success("Post successfully", {
            position: "top-right",
            heading: "Done",
          });
          if (isMounted) {
            setOpen(false);
          }
          setIsPendingUpdated((prev) => !prev);
        })
        .catch((error) => {
          toast.error("Can not post", {
            position: "top-right",
            heading: "Done",
          });
          console.error(error);
        })
        .finally(() => {
          setLoading(false);
        });

      return () => {
        isMounted = false;
      };
    } else {
      toast.warn("Please update phoneNumber", {
        position: "top-right",
        heading: "Error",
      });
      setOpen(false);
      navigate("/home/profiles");
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setShowDeleteButton(false);
  };
  const handleFileChange = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };
  const handleGetRoomUpdate = () => {
    setOpen(true);
    const token = JSON.parse(localStorage.getItem("access_token"));
    const headers = { Authorization: `Bearer ${token.data.accessToken}` };
    axios
      .get("https://f-home-be.vercel.app/getRoomsByUserId", { headers })
      .then((response) => {
        const roomIds = response.data;
        if (roomIds) {
          setRoomIds(roomIds);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function getBuildingName(roomId) {
    const room = roomUserId.find((room) => room?._id === roomId);
    const building = dataOfBuildings.find(
      (building) => building?._id === room?.buildings
    );
    setBuildingName(building?.buildingName);
    setBuildingId(building?._id);
  }

  return (
    <>
      <Button
        onClick={handleGetRoomUpdate}
        variant="contained"
        fullWidth={true}
        className="rounded-5 bg-light shadow-none text-secondary"
      >
        Posting
      </Button>
      {/* Modal */}
      <StyledModal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <form onSubmit={handleSubmit}>
          {loading ? (
            <Audio type="Puff" color="#00BFFF" height={100} width={100} />
          ) : (
            <Box
              style={{ position: "relative" }}
              width={500}
              minHeight={475}
              maxHeight={700}
              bgcolor="white"
              p={3}
              borderRadius={5}
              sx={{
                "::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {/* {componentToRender} */}
              {/* {showNextButton && <button onClick={handleNext}>Next</button>}
              {showBackButton && <button onClick={handleBack}>Back</button>} */}
              <div className="text-center">
                {" "}
                <span
                  sx={{
                    position: "absolute",
                    top: "0",
                    marginTop: 2,
                  }}
                  color="black"
                  textAlign="center"
                  style={{ fontWeight: 600, color: "black" }}
                >
                  Tạo bài viết
                </span>
              </div>
              <hr width="100%" size="5px" align="center" color="gray" />
              <div>
                <UserBox>
                  <div className="row">
                    <div className="col-md-2">
                      <Avatar
                        src={userPostings?.img}
                        sx={{ width: 40, height: 40, marginTop: 1.5 }}
                      />
                    </div>
                    <div className="col-md-9">
                      <Typography
                        fontWeight={500}
                        sx={{
                          color: "black",
                          fontSize: ".875rem",
                          fontWeight: 600,
                        }}
                        variant="span"
                      >
                        {userPostings?.fullname}
                      </Typography>
                      <Typography
                        style={{
                          marginLeft: 0,
                          fontSize: "0.75rem",
                          fontWeight: "500",
                          backgroundColor: "#e4e6eb",
                          boxShadow: "rgb(149 157 165 / 20%) 0px 8px 24px",
                          padding: "2px 4px",
                          borderRadius: "10px",
                          color: "black",
                        }}
                      >
                        <AccountCircleOutlinedIcon /> {userPostings?.roleName}
                      </Typography>
                    </div>
                  </div>
                </UserBox>
              </div>
              <div
                style={{
                  maxHeight: "284px",
                  overflow: "auto",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  marginBottom: 100,
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
                className="postmodal-scoll"
              >
                <Textarea
                  name="Plain"
                  placeholder="title"
                  variant="plain"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  sx={{ width: "100%", minHeight: 90 }}
                  id="standard-multiline-static"
                  multiline
                  rows={5}
                  placeholder={`${userPostings?.fullname} ơi bạn muốn đăng gì thế ?`}
                  variant="standard"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="col-md-6">
                    {" "}
                    <FormControl sx={{ minWidth: 180 }} size="small">
                      <div> Building: {buildingName}</div>
                    </FormControl>
                  </div>
                  <div className="col-md-6">
                    {" "}
                    <FormControl sx={{ minWidth: 180 }} size="small">
                      <InputLabel id="demo-select-small">Room</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={room}
                        label="Room"
                        onChange={(e) => {
                          setRoom(e.target.value);
                          getBuildingName(e.target.value);
                        }}
                        style={{ maxHeight: "50px", overflowY: "auto" }}
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {roomUserId?.map((room) => (
                          <MenuItem key={room._id} value={room._id}>
                            {room.roomName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>

                <div style={{ flex: 1 }}>
                  <Typography
                    style={{ fontSize: "15px", margin: 10, color: "black" }}
                  >
                    Đ. Nguyễn Xiển, Long Thạnh Mỹ, Quận 9, Thành phố Hồ Chí Minh
                    700000{" "}
                  </Typography>
                </div>
                {selectedFile ? (
                  <div>
                    <img
                      className="rounded-3 shadow"
                      src={URL.createObjectURL(selectedFile)}
                      alt="preview"
                    />
                    {showDeleteButton && (
                      <button onClick={handleDelete}>Delete</button>
                    )}
                  </div>
                ) : (
                  <span></span>
                )}
              </div>
              <ButtonGroup
                style={{
                  position: "absolute",
                  width: "91%",
                  bottom: "0",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "white",
                }}
              >
                <Dropzone onDrop={handleFileChange} accept="image/*">
                  {({ getRootProps, getInputProps }) => (
                    <div
                      {...getRootProps()}
                      style={{
                        border: "1px solid #e4e6eb",
                        borderRadius: 8,
                        marginBottom: 10,
                        height: 57,
                        marginTop: 10,
                      }}
                    >
                      <input {...getInputProps()} />
                      <p
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 600,
                          color: "#65676b",
                          marginTop: 12,
                          marginLeft: 16,
                          fontWeight: 500,
                        }}
                      >
                        <span className="text-dark">
                          Thêm vào bài post của bạn
                        </span>
                        <ImageOutlinedIcon
                          style={{
                            fontSize: "30px",
                            color: "#6ab175",
                            marginLeft: 50,
                          }}
                        />{" "}
                      </p>
                    </div>
                  )}
                </Dropzone>
                <Button
                  variant="contained"
                  fullWidth={true}
                  type="submit"
                  style={{ marginBottom: "12px", backgroundColor: "#b48845" }}
                >
                  Click me
                </Button>
              </ButtonGroup>
            </Box>
          )}
        </form>
      </StyledModal>

      {success && setOpen(false)}
    </>
  );
};

export default PostModal;
