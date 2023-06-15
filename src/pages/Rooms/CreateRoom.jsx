import React, { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import DescriptionIcon from "@mui/icons-material/Description";
import DashboardWrapper, {
  DashboardWrapperMain,
  DashboardWrapperRight,
} from "../../components/dashboard-wrapper/DashboardWrapper";
import CropOutlinedIcon from "@mui/icons-material/CropOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import ApartmentIcon from '@mui/icons-material/Apartment';
import axios from "axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Textarea } from "@mui/joy";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import "./CreateRoom.scss";
import Dropzone from "react-dropzone";
import BedroomParentOutlinedIcon from "@mui/icons-material/BedroomParentOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import toastr from "cogo-toast";

function CreateRoom() {
  const localStorageDataBuildings = localStorage.getItem("buildings");
  const data = JSON.parse(localStorageDataBuildings);
  const dataOfBuildings = data.data.buildings;

  const [name, setName] = React.useState("");
  const [size, setSize] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [building, setBuilding] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState(null);

  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = JSON.parse(localStorage.getItem("access_token"));
    if (!token) {
      console.log("No access token found.");
      return;
    }
    var formData = new FormData();
    formData.append("roomName", name);
    formData.append("size", size);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("buildings", building);
    formData.append("img", selectedFile);

    axios
      .post("http://localhost:3000/createRoom", formData, {
        headers: {
          Authorization: `Bearer ${token.data.accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        toastr.success("Create Room successfully", {
          position: "top-right",
          heading: "Done",
        });
        setDataRoom((prevData) => {
          return {
            ...prevData,
            rooms: [...prevData.rooms, response.data.data],
          };
        });
      })
      .catch((error) => {
        toastr.fail("Create Room fail", {
          position: "top-right",
          heading: "Done",
        });
        console.error(error);
      });
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setShowDeleteButton(false);
  };

  useEffect(() => {
    // Lấy dữ liệu từ server
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("access_token"));
        // console.log(token)
        if (!token) {
          console.log("No access token found.");
          return;
        }
        const headers = { Authorization: `Bearer ${token.data.accessToken}` };
        const responses = await Promise.all([
          axios.get("http://localhost:3000/getBuildings"),
          axios.get("http://localhost:3000/getRoomsByUserId", { headers }),
          axios.get("http://localhost:3000/getAllUsers"),
        ]);
        const buildings = responses[0].data.data.buildings;
        const rooms = responses[1].data.data.rooms;
        const users = responses[2].data;
        const newData = rooms.map((room) => {
          const building = buildings.find((b) => b._id === room.buildings);
          const buildingName = building ? building.buildingName : "";

          const user = users.find((u) => u._id === room.users);
          const userEmail = user ? user.email : "";
          const userFullName = user ? user.fullname : "";
          const userImg = user ? user.img : "";
          return {
            ...room,
            buildingName,
            userEmail,
            userFullName,
            userImg,
          };
        });

        const buildingIds = buildings.map((post) => post.buildings);
        const filteredBuildingIds = buildings
          .filter((b) => buildingIds.includes(b._id))
          .map((b) => b._id);

        setDataRoom((prevState) => {
          return {
            ...prevState,
            buildings: newData,
            rooms,
            users,
            buildingIds: filteredBuildingIds,
          };
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const [dataRoom, setDataRoom] = useState({
    buildings: [],
    rooms: [],
    users: [],
  });
  const dataRooms = dataRoom.rooms;
  const handleFileChange = (acceptedFiles) => {
    setSelectedFile(acceptedFiles[0]);
  };
  return (
    <div className="posting-list">
      <DashboardWrapper>
        <DashboardWrapperMain>
          <form onSubmit={handleSubmit} className="bg-drak">
            <div className="p-4 bg-white rounded-3 shadow">
              <div style={{ textAlign: "center", display: "block" }}>
                <BedroomParentOutlinedIcon
                  style={{ fontSize: 50, color: "#b48845" }}
                />{" "}
              </div>
              <span className="m-3 text-dark">
                <DnsOutlinedIcon style={{color: "#b48845" }}/>
                Name
              </span>
              <Textarea
                name="Plain"
                placeholder="Room Name..."
                variant="plain"
                className="shadow-sm rounded-3 mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <span className="m-3 text-dark">
                <CropOutlinedIcon style={{color: "#b48845" }}/>
                Size (m²)
              </span>
              <Textarea
                name="Plain"
                placeholder="Room Size..."
                variant="plain"
                className="shadow-sm rounded-3 mb-3"
                value={size}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(value)) {
                    setSize(value);
                  }
                }}
              />

              <span className="m-3 text-dark">
                {" "}
                <MonetizationOnOutlinedIcon style={{color: "#b48845" }}/>
                Price (Kvnđ)
              </span>
              <Textarea
                name="Plain"
                placeholder="Room Price..."
                variant="plain"
                className="shadow-sm rounded-3 mb-3"
                value={price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!isNaN(value)) {
                    setPrice(value);
                  }
                }}
              />
              <span className=" m-3 text-dark">
                {" "}
                <DescriptionIcon style={{color: "#b48845" }}/>
                Description
              </span>
              <Textarea
              placeholder="Room Desciption..."
                className="border-0 shadow-sm rounded-3 mb-3"
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{
                  boxShadow: `box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;`,
                }}
              />

              <div style={{ display: "flex", marginBottom: 10 }}>
                <FormControl style={{ width: 100, marginRight: 12 }}>
                  <InputLabel id="demo-simple-select-label">
                    <ApartmentIcon  style={{color: "#b48845"}}/>
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={building}
                    label="Building"
                    onChange={(e) => setBuilding(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {dataOfBuildings.map(
                      (
                        building,
                        index // Thêm tham số index vào hàm map
                      ) => (
                        <MenuItem key={index} value={building?._id}>
                          {building?.buildingName}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
                <span className="text-dark fs-6">
                  512 đường Nguyễn Xiển, Phường Long Thạnh Mỹ, Quận 9, TP. Thủ
                  Đức
                </span>
              </div>
              {/* <input type="file" onChange={handleFileChange} /> */}

              <Dropzone onDrop={handleFileChange} accept="image/*">
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="text-center">
                    <input {...getInputProps()} />
                    {selectedFile ? (
                      <div>
                        <img
                          className="rounded-3 shadow mb-3 mt-1"
                          src={URL.createObjectURL(selectedFile)}
                          alt="preview"
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
                          color: "black",
                        }}
                      >
                        <ImageOutlinedIcon
                          style={{ fontSize: "30px", color: "#b48845" }}
                        />{" "}
                        Thêm ảnh
                      </p>
                    )}
                  </div>
                )}
              </Dropzone>
              <div className="text-center">
                {" "}
                <Button type="submit" variant="contained" style={{color:'white' , backgroundColor:'#b48845'}}>
                  Create Room
                </Button>
              </div>
            </div>
          </form>
        </DashboardWrapperMain>
        <DashboardWrapperRight>
          <div className="scroll-container">
            {Array.isArray(dataRooms) &&
              dataRooms
                .sort((a, b) => {
                  return (
                    new Date(b?.updatedAt).getTime() -
                    new Date(a?.updatedAt).getTime()
                  );
                })
                .map((rooms) => (
                  <Card sx={{ maxWidth: 345, marginBottom: 2 }}>
                    <CardMedia
                      sx={{ height: 140 }}
                      image={rooms.img}
                      title="green iguana"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {rooms.roomName}
                      </Typography>
                      <Typography gutterBottom variant="h5" component="div">
                        {rooms.buildingName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {rooms.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <span size="small" className="fs-6 text-ceneter"> <MonetizationOnOutlinedIcon  style={{color: "#b48845", display:'block'}}/> {rooms.price}</span>
                      <span size="small" className="fs-6 text-center"><CropOutlinedIcon  style={{color: "#b48845",display:'block'}}/> {rooms.size}</span>
                      <span style={{ fontSize: 15 }}>
                        {" "}
                        {new Date(rooms?.updatedAt).toLocaleString()}
                      </span>
                    </CardActions>
                  </Card>
                ))}
          </div>
        </DashboardWrapperRight>
      </DashboardWrapper>
    </div>
  );
}

export default CreateRoom;
