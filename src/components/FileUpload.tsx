import React, { useState } from "react";
import "./FileUpload.css";

const FileUpload = () => {
  // アップロードファイルの上限は10MB
  const fileSizeLimit = 1024 * 1024 * 10;

  // ファイル名の文字数
  const [selectedImageName, setSelectedImageName] = useState("");

  // 選択したファイル名の長さを管理する
  const [selectedNameCount, setSelectedNameCount] = useState("0");

  // 選択したファイル名の長さを管理する
  const [selectedFileSize, setSelectedFileSize] = useState("0");

  // エラー文の管理
  const [errorStr, setErrorStr] = useState("");

  // ファイル名のテキストに入力された場合
  const inputFileNameCount = (e: any) => {
    const name = e.target.value;
    setSelectedImageName(name);
    setSelectedNameCount(name.toString().length);
  };

  // ファイル名文字数確認
  const confirmStrCount = (count: string) => {
    // ファイル名が50文字超えたらエラー
    if (Number(count) > 50) {
      setErrorStr("ファイル名は50文字までで指定してください。");
      setSelectedImageName("");
      return;
    } else {
      setSelectedNameCount(count);
    }
  };

  // ファイルサイズ確認
  const confirmFileSize = (size: number) => {
    // ファイルのサイズが10MBを超えるとエラー
    if (size > fileSizeLimit) {
      setErrorStr("10MB以上のファイルをアップロードすることはできません。");
      setSelectedImageName("");
      setSelectedNameCount("0");
      return;
    } else {
      setSelectedFileSize(size.toString());
    }
  };

  // ファイル名に「¥ / : * ? " < > |」がないことを確認
  const invalidString = (fileName: string) => {
    // 禁止文字列
    const forbiddenCharactersRegex = /[¥/:*?"<>|]/;
    console.log(forbiddenCharactersRegex.test(fileName));
    if (forbiddenCharactersRegex.test(fileName)) {
      // 禁止文字列がファイル名に含まれる場合
      setErrorStr('¥ / : * ? " < > | はファイル名に含めることはできません。');
      return;
    }
  };

  // 選択したファイル格納
  const handleImageChange = (event: any) => {
    // TODO: 複数ファイル選択できるようにする
    const file = event.target.files[0];
    console.log(file.name);

    // 選択時キャンセルした場合は処理を実施しない
    if (file === undefined) return;

    // ファイル名の取得&格納
    const imageName = file.name;
    setSelectedImageName(imageName);
    // ファイル名に不正な文字が含まれてないか確認
    invalidString(imageName);

    // ファイル名文字数
    const fileNameCount = imageName.toString().length;
    confirmStrCount(fileNameCount);

    // ファイルサイズ確認
    const fileSize = file.size;
    confirmFileSize(fileSize);
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
        <button type="submit">Upload To AWS S3</button>
      </form>
      <hr />
      ファイル名：
      <input
        type="text"
        value={selectedImageName}
        onChange={inputFileNameCount}
      />
      <p className="error">{errorStr}</p>
      <hr />
      <h3>ファイル名の文字数(51文字以上はエラー)</h3>
      <label>文字数: {selectedNameCount}/50</label>
      <h3>ファイルサイズ(10MBまで)</h3>
      <label>ファイルサイズ: {selectedFileSize}</label>
    </>
  );
};

export default FileUpload;
