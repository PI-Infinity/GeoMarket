import Resizer from "react-image-file-resizer";

export const handleFileUpload = async (e, setFile) => {
  const uploadedFiles = e.target.files;
  if (!uploadedFiles) return; // Early return if no files selected

  const processedFiles = [];

  for (let i = 0; i < uploadedFiles.length; i++) {
    const file = uploadedFiles[i];
    const resizedFile = await resizeImage(file, 800, 800, "jpeg", 1);
    processedFiles.push(resizedFile);
  }

  setFile(processedFiles);
};

export const resizeImage = (file, maxWidth, maxHeight, format, quality) =>
  new Promise((resolve, reject) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      format,
      quality,
      0,
      (uri) => {
        // Assuming uri is a base64 string here
        const base64Data = uri.split(",")[1]; // Remove the data:image/jpeg;base64, part

        // Convert base64 to Blob
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        const resizedFile = {
          blob: blob,
          size: blob.size,
          type: blob.type,
          height: maxHeight, // Update with actual resized height
          width: maxWidth, // Update with actual resized width
        };

        resolve(resizedFile);
      },
      "base64",
      maxWidth,
      maxHeight
    );
  });
