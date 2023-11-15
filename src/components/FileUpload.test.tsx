import { render, screen, waitFor } from "@testing-library/react";
import FileUpload from "./FileUpload";
import userEvent from "@testing-library/user-event";

describe("Screen Test", () => {
  test("renders FileUpload component", () => {
    render(<FileUpload />);
    expect(screen.getByText("ファイルのアップロード")).toBeInTheDocument();
  });
});

describe("File Upload Test", () => {
  // ファイルのアップロードが正しくできるか確認するケース
  test("upload file", async () => {
    // デモファイル
    const file = new File(["hello"], "hello.png", { type: "image/png" });
    render(<FileUpload />);

    const input = screen.getByLabelText(/Upload file:/) as HTMLInputElement;
    userEvent.upload(input, file);

    // Upload数
    await waitFor(() => expect(input.files).toHaveLength(1));

    // テキストエリアに記載されたファイル名、アップロードされたものと同一か確認
    // findByDisplayValue: Returns the input, textarea, or select element that has the matching display value.
    await screen.findByDisplayValue("hello.png");
  });

  // 異常系：ファイル名の長さオーバー
  test("異常系:ファイル名が51文字以上の場合はエラー", async () => {
    const errFileName =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png";

    // デモファイル
    const file = new File(["hello"], errFileName, { type: "image/png" });
    render(<FileUpload />);

    const input = screen.getByLabelText(/Upload file:/) as HTMLInputElement;
    userEvent.upload(input, file);

    // テキストエリアに記載されたファイル名、アップロードされたものと同一か確認
    await screen.findByText(/ファイル名は50文字までで指定してください。/);
  });

  // 異常系：ファイルサイズが規定オーバー
  test("異常系:ファイルサイズが規定オーバー", async () => {
    // デモファイル(11MB)
    const data = new Uint8Array(11 * 1024 * 1024);
    const file = new File([data], "sizeOver.png", { type: "image/png" });
    render(<FileUpload />);

    const input = screen.getByLabelText("Upload file:") as HTMLInputElement;
    userEvent.upload(input, file);

    // テキストエリアに記載されたファイル名、アップロードされたものと同一か確認
    await screen.findByText(
      /10MB以上のファイルをアップロードすることはできません。/
    );
  });

  // 異常系：ファイル名に「¥ / : * ? " < > |」がある場合
  test("異常系:ファイル名に禁止文字列が含まれている", async () => {
    // デモファイル
    const file = new File(["hello"], "file?.png", { type: "image/png" });
    render(<FileUpload />);

    const input = screen.getByLabelText("Upload file:") as HTMLInputElement;
    userEvent.upload(input, file);

    // テキストエリアに記載されたファイル名、アップロードされたものと同一か確認
    await screen.findByText(
      '¥ / : * ? " < > | はファイル名に含めることはできません。'
    );
  });
});
