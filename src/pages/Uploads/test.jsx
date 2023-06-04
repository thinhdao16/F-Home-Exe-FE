import React, { useState } from "react";

const UploadImageForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("img", selectedFile);

        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log(data); // in ra đường dẫn ảnh trong Firebase Storage
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Please select an image to upload.");
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadImageForm;