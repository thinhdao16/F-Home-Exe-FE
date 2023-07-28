import * as React from "react";
import Typography from "@mui/joy/Typography";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import { TextField } from "@mui/material";
import { toast } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import axios from "axios";

export default function Upload() {
  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data.data.buildings;
  const localStorageDataProfile = localStorage.getItem("access_token");
  const dataProfile = JSON.parse(localStorageDataProfile);
  const dataProfiles = dataProfile.data.user;

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [room, setRoom] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);

  const roomUserId = JSON.parse(localStorage.getItem("roomIds")).data.rooms;
  // const handleDrop = (acceptedFiles) => {
  //   const file = acceptedFiles[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const preview = reader.result;
  //     setSelectedFile({ file });
  //     setImagePreview(preview);
  //   };
  //   reader.readAsDataURL(file);
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = JSON.parse(localStorage.getItem("access_token"));
    // console.log(token)
    if (!token) {
      console.log("No access token found.");
      return;
    }

    var formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("buildings", building);
    formData.append("rooms", room);
    formData.append("img", selectedFile);

    axios
      .post("http://localhost:3000/createPosting",formData, {
        headers: {
          Authorization: `Bearer ${token.data.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Successfully!");
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  return (
    <div className="posting-list">
      <DashboardWrapper>
        <DashboardWrapperMain>
          {" "}
          <form onSubmit={handleSubmit}>
            <Typography id="fade-modal-dialog-title" component="h2">
              Tạo bài viết
            </Typography>
            <hr />
            <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={2}>
              <Box gridColumn="span 1">
                <Link to="/home/profiles">
                  <Avatar
                    name="John Doe"
                    size="55"
                    round={true}
                    src={dataProfiles.img}
                  />
                </Link>
              </Box>
              <Box gridColumn="span 6">
                <div className="mt-2  ms-2">
                  <Link to="/home/profiles">
                    <span className="posting-list__titleName">
                      {dataProfiles.fullname}
                    </span>
                  </Link>
                  <span className="posting-list__titleName__date">user</span>
                </div>
              </Box>
            </Box>
            <TextField
              fullWidth
              id="fullWidth"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              fullWidth
              id="fullWidth"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div style={{ display: "flex" }}>
              <select
                // className="form-select"
                aria-label="Default select example"
                style={{
                  maxHeight: "100px",
                  overflowY: "auto",
                }}
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
              >
                <option value="" disabled>
                  Chọn tòa nhà
                </option>
                {dataOfBuildings.map(
                  (
                    building,
                    index // Thêm tham số index vào hàm map
                  ) => (
                    <option key={index} value={building._id}>
                      {building._id}
                    </option>
                  )
                )}
              </select>

              <span>
                512 đường Nguyễn Xiển, Phường Long Thạnh Mỹ, Quận 9, TP. Thủ Đức
              </span>
            </div>
            <div style={{ display: "flex" }}>
              <select
                // className="form-select"
                aria-label="Default select example"
                style={{
                  maxHeight: "100px",
                  overflowY: "auto",
                }}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              >
                <option value="" disabled>
                 chon phong
                </option>
                {roomUserId.map(
                  (
                    rooms,
                    index // Thêm tham số index vào hàm map
                  ) => (
                    <option key={index} value={rooms._id}>
                      {rooms._id}
                    </option>
                  )
                )}
              </select>

              <span>
                512 đường Nguyễn Xiển, Phường Long Thạnh Mỹ, Quận 9, TP. Thủ Đức
              </span>
            </div>
            <input type="file" onChange={handleFileChange} />
            {/* <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Image sx={{ marginRight: "25px" }} color="secondary" />
                  </div>
                )}
              </Dropzone>
              {imagePreview && <img src={imagePreview} alt="image preview" />} */}
            <button type="submit">submit</button>
          </form>
        </DashboardWrapperMain>

        <DashboardWrapperRight>
          <div className="card border-0">
            <div className="row">
              <div className="col-md-2">
                <Link to="/home/profiles">
                  <Avatar
                    name="John Doe"
                    size="55"
                    round={true}
                    src="https://scontent.fsgn5-9.fna.fbcdn.net/v/t39.30808-6/332852096_926438305374448_3458046676088362335_n.jpg?stp=cp6_dst-jpg&_nc_cat=102&ccb=1-7&_nc_sid=5cd70e&_nc_ohc=TWh7JGtK298AX9Qoz-L&_nc_ht=scontent.fsgn5-9.fna&oh=00_AfAONOi4yNqC8Fn632XAchTcaHudKDIuAWlXrb8YkfBFNA&oe=640C7DD9"
                  />
                </Link>
              </div>
              <div className="col-md-10">
                <div className="mt-2  ms-2">
                  <Link to="/home/profiles">
                    <span className="posting-list__titleName">MS PUIYI</span>
                  </Link>
                  <span className="posting-list__titleName__date">user</span>
                </div>
              </div>
            </div>
          </div>
        </DashboardWrapperRight>
      </DashboardWrapper>
    </div>
  );
}
