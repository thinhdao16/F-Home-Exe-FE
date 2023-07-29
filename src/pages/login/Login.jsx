import "./login.scss";
import React, { useContext, useEffect, useState } from "react";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../components/context/firebase";
import clientId from "./client_secret_624291541261-vsnpuqvrn48tah5ju43l048ug23a3hre.apps.googleusercontent.com.json";
import axios from "axios";
import { DataContext } from "../DataContext";
import { toast } from "react-toastify";
import Loading from "react-fullscreen-loading";
import { Textarea } from "@mui/joy";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import Modal from "@mui/joy/Modal";
import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import Dropzone from "react-dropzone";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { AuthContext } from "../../components/context/AuthContext";
import { Tabs } from "antd";
const { TabPane } = Tabs;
const Login = () => {
  const navigate = useNavigate();
  const { googleSignIn, accessToken, allUser, setUpdateUser } =
    useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilePoint, setSelectedFilePoint] = useState(null);
  const [point, setPoint] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true); // set loading to true before the API call
      await googleSignIn();
      if (accessToken !== undefined) {
        // Thêm điều kiện kiểm tra accessToken
        const user = auth.currentUser;
        if (user) {
          const idToken = await user.getIdToken();
          const accessToken = await user.getIdToken(true);
          const response = await axios.post(
            "https://f-home-be.vercel.app/login",
            { accessToken: accessToken },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          if ((response.status = 200)) {
            // const data = await response.json();
            if (
              response !== undefined &&
              response.data.data.user.roleName !== "admin" &&
              response.data.data.user.status.user !== true
            ) {
              localStorage.setItem(
                "access_token",
                JSON.stringify(response.data)
              );
              const token = JSON.parse(localStorage.getItem("access_token"));

              const headers = {
                Authorization: `Bearer ${token.data.accessToken}`,
              };
              axios
                .get("https://f-home-be.vercel.app/getRoomsByUserId", {
                  headers,
                })
                .then((response) => {
                  const roomIds = response.data;
                  if (roomIds) {
                    localStorage.setItem("roomIds", JSON.stringify(roomIds));
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
              toast.success("Login successfully", {
                position: "top-right",
                heading: "Done",
              });
              navigate("/home");
              //         }
            } else {
              toast.warn("please you are admin dont go", {
                position: "top-right",
                heading: "Done",
              });
            }
          } else {
            toast.error("Response not OK", {
              position: "top-right",
              heading: "Done",
            });
          }
        } else {
          toast.error("User not found", {
            position: "top-right",
            heading: "Done",
          });
        }
      } else {
        toast.error("Access token not found", {
          position: "top-right",
          heading: "Done",
        });
      }
      setIsLoading(false); // set loading to false after the API call
    } catch (error) {
      console.log(error);
      const userError = error?.response?.data?.data?.accessToken;
      if (error.message) {
        localStorage.setItem("user_error", JSON.stringify(userError));
      }
      setUpdateUser((preve) => !preve);
      toast.warn(`please wait for admin to confirm`, {
        position: "top-right",
        heading: "Done",
      });
      setIsLoading(false); // set loading to false after the API call
    }
  };

  useEffect(() => {
    const accessTokenString = localStorage.getItem("access_token");
    let accessToken = null;
    if (typeof accessTokenString === "string" && accessTokenString !== "") {
      accessToken = JSON.parse(accessTokenString);
    }

    const userDataString = localStorage.getItem("user_data");
    let userData = null;
    if (typeof userDataString === "string" && userDataString !== "") {
      userData = JSON.parse(userDataString);
    }

    if (accessToken && userData && userData.user.roleName !== "admin") {
      navigate("/home");
    } else {
      navigate("");
    }
  }, [navigate]);
  const handleFileChangePoint = (acceptedFiles) => {
    setSelectedFilePoint(acceptedFiles[0]);
  };

  const handleSubmitPoint = async (event) => {
    event.preventDefault();

    // Kiểm tra xem email đã tồn tại trong dữ liệu hiện có hay không
    const emailExists = allUser.some((user) => user.email === email);

    if (emailExists) {
      var formData = new FormData();
      formData.append("img", selectedFilePoint);
      formData.append("email", email);
      formData.append("point", point);
      formData.append("script", description);
      let isMounted = true;
      try {
        const response = await axios.post(
          "https://f-home-be.vercel.app/postformpointEmail",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Post successfully", {
          position: "top-right",
          heading: "Done",
        });

        setSelectedFilePoint(null);
        setEmail("");
        setPoint("");
        setDescription("");
        if (isMounted) {
          console.log(response.data);
          setOpen(false);
        }
      } catch (error) {
        toast.warn("You have contract need admin accept", {
          position: "top-right",
          heading: "Error",
        });
      }
    } else {
      // Xử lý trường hợp email không tồn tại trong dữ liệu
      // Ví dụ: Hiển thị thông báo lỗi
      toast.error("Please login with google and back here", {
        position: "top-right",
        heading: "Error",
      });
      setOpen(false);
    }
  };
  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: `Thinh`,
      children: `Content of Tab Pane 1`,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/auth-fhome.appspot.com/o/profilePics%2Ftpbank.jpg?alt=media&token=abe240f1-807a-4d77-b6c9-e916ff8d20d1", // Đường dẫn hình ảnh cho Tab 1
    },
    {
      key: "2",
      label: `Tin`,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/auth-fhome.appspot.com/o/profilePics%2F9280d23cc611154f4c00.jpg?alt=media&token=3daced94-55f4-4660-a54c-303862d56ca4", // Đường dẫn hình ảnh cho Tab 3
    },
  ];
  const itemss = [
    {
      key: "1",
      label: `Hoang`,
      children: `Content of Tab Pane 3`,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/auth-fhome.appspot.com/o/profilePics%2FIMG_2916.JPG?alt=media&token=1b90a24b-44c6-4649-b322-b5bfd0534e80", // Đường dẫn hình ảnh cho Tab 3
    },
    {
      key: "2",
      label: `Trieu`,
      children: `Content of Tab Pane 3`,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/auth-fhome.appspot.com/o/profilePics%2FQR%20trieu.jpg?alt=media&token=c3ae7cb6-d2fe-40b5-8bfd-f8e158d90929", // Đường dẫn hình ảnh cho Tab 3
    },
  ];
  return (
    <div className="body">
      <>
        {isLoading && (
          <Loading loading background="#fff" loaderColor="#ff9066" />
        )}
        {/* Your component JSX goes here */}
      </>

      <div id="wrap-main-content">
        <div className="identity-tabs">
          <a>Login</a>
        </div>
        <ul className="list-social-login">
          <li className="social-login-item">
            <GoogleButton
              className="googleButton"
              onClick={handleGoogleSignIn}
              data-clientid={clientId.web.client_id}
            />
          </li>
        </ul>
        <div className="wrap-form-field">
          <div className="form-group group-width-icon">
            <i className="fa-solid fa-user"></i>
            <input
              type="email"
              className="form-control input-validation-error"
              placeholder="Email"
              autoComplete="off"
              data-val="true"
              data-val-required="Password is required"
              id="Password"
              name="Password"
            />
          </div>
        </div>
        <div className="wrap-form-field">
          <div className="form-group group-width-icon">
            <i className="fa-solid fa-lock"></i>
            <input
              type="password"
              className="form-control input-validation-error"
              placeholder="Password"
              autoComplete="off"
              data-val="true"
              data-val-required="Password is required"
              id="Password"
              name="Password"
            />
          </div>
        </div>
        <div className="d-grid form-identify">
          <button className="btn btn-primary" type="button">
            Log in
          </button>
          <Link
            onClick={() => setOpen(true)}
            relative="path"
            className="change-rtn-home"
          >
            Return To Home Page
          </Link>
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
                  minWidth: 500,
                  borderRadius: "md",
                  pl: 2,
                  pr: 1,
                  py: 3,
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
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
                <Box
                  style={{
                    position: "relative",
                    maxHeight: "430px",
                    overflow: "auto",
                    paddingRight: "3px",
                  }}
                  bgcolor="white"
                  // borderRadius={5}
                  sx={{
                    "&::-webkit-scrollbar": {
                      width: "8px",
                    },
                    "&::-webkit-scrollbar-track": {
                      borderRadius: "10px",
                      background: "rgba(0, 0, 0, 0.1)",
                      border: "1px solid #ccc",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      borderRadius: "10px",
                      background: "linear-gradient(left, #fff, #e4e4e4)",
                      border: "1px solid #aaa",
                    },
                    "&::-webkit-scrollbar-thumb:hover": {
                      background: "#fff",
                    },
                    "&::-webkit-scrollbar-thumb:active": {
                      background: "linear-gradient(left, #22ADD4, #1E98BA)",
                    },
                  }}
                >
                  <div style={{display:"flex"}}>
                    <Tabs defaultActiveKey="1" onChange={onChange} style={{marginRight:"10px"}}>
                      {items.map((item) => (
                        <TabPane
                          tab={
                            <div style={{float:"right"}}>
                              <span>{item.label}</span>
                            </div>
                          }
                          key={item.key}
                        >
                          <img
                            src={item.imageUrl}
                            alt={`Ms ${item.key}`}
                            style={{
                              width: 230,
                              height: 230,
                              objectFit: "cover",
                              marginBottom: "10px",
                              borderRadius: "15px",
                              boxShadow:
                                " rgba(149, 157, 165, 0.2) 0px 8px 24px",
                            }}
                          />
                          {/* <h3>{item.label}</h3> */}
                        </TabPane>
                      ))}
                    </Tabs>
                    <Tabs defaultActiveKey="1" onChange={onChange}>
                      {itemss.map((item) => (
                        <TabPane
                          tab={
                            <div>
                              <span>{item.label}</span>
                            </div>
                          }
                          key={item.key}
                        >
                          <img
                            src={item.imageUrl}
                            alt={`Ms ${item.key}`}
                            style={{
                              width: 230,
                              height: 230,
                              objectFit: "cover",
                              marginBottom: "10px",
                              borderRadius: "15px",
                              boxShadow:
                                " rgba(149, 157, 165, 0.2) 0px 8px 24px",
                            }}
                          />
                          {/* <h3>{item.label}</h3> */}
                        </TabPane>
                      ))}
                    </Tabs>
                  </div>

                  <span className=" text-dark" style={{ fontSize: 14 }}>
                    <CurrencyExchangeIcon
                      style={{ color: "#b48845", fontSize: 17 }}
                    />{" "}
                    Point
                  </span>
                  <Textarea
                    name="Plain"
                    variant="plain"
                    className="shadow-sm rounded-3 mb-3 bg-white"
                    placeholder="Point ...  "
                    value={point}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (!isNaN(value)) {
                        setPoint(value);
                      }
                    }}
                    style={{ fontSize: 14 }}
                  />
                  <span className="text-dark" style={{ fontSize: 14 }}>
                    <ContentPasteIcon
                      style={{ color: "#b48845", fontSize: 17 }}
                    />{" "}
                    Email
                  </span>
                  <Textarea
                    name="Plain"
                    placeholder="Point score..."
                    variant="plain"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow-sm rounded-3 mb-1"
                    style={{ fontSize: 14 }}
                  />
                  <span className="text-dark" style={{ fontSize: 14 }}>
                    <ContentPasteIcon
                      style={{ color: "#b48845", fontSize: 17 }}
                    />{" "}
                    Description
                  </span>
                  <Textarea
                    name="Plain"
                    placeholder="Point score..."
                    variant="plain"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow-sm rounded-3 mb-1"
                    style={{ fontSize: 14 }}
                  />
                  {selectedFilePoint ? (
                    <div>
                      <img
                        className="rounded-3 shadow"
                        src={URL.createObjectURL(selectedFilePoint)}
                        alt="preview"
                        style={{
                          width: 470,
                          height: 470,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <span></span>
                  )}
                  <Dropzone onDrop={handleFileChangePoint} accept="image/*">
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
                          <span className="text-dark">Thêm hình ảnh</span>
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
                </Box>
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
        </div>
      </div>
    </div>
  );
};

export default Login;
