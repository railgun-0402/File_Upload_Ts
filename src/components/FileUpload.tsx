import React, { useState } from "react";

const FileUpload = () => {
  //   const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageName, setSelectedImageName] = useState("");

  // 選択したファイル格納
  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    console.log(file.name);
    setSelectedImageName(file.name);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log("");
  };
  return (
    <>
      <h2>ファイルのアップロード</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <br />
        <br />
        <button type="submit">Upload</button>
      </form>
      <hr />
      ファイル名：
      <input type="text" defaultValue={selectedImageName} />
    </>
  );
};

export default FileUpload;
