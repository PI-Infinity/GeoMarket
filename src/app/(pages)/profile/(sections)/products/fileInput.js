import Compressor from "compressorjs";
import Resizer from "react-image-file-resizer";

export const handleFileUpload = async (e, setFile) => {
  const uploadedFiles = e.target.files;
  if (!uploadedFiles) return; // Early return if no files selected

  const processedFiles = [];

  for (let i = 0; i < uploadedFiles.length; i++) {
    const file = uploadedFiles[i];
    const resizedFile = await resizeImage(file, 3000, 3000, "jpeg", 1);
    processedFiles.push(resizedFile);
  }

  setFile((prevFiles) => {
    const clonedProcessedFiles = processedFiles.map((file) => ({ ...file }));

    // Check if any of the previous files already has a cover
    const alreadyHasCover = prevFiles.gallery.some((file) => file.cover);

    // If there are processed files and none of the previous files has a cover, set the first processed file as cover
    if (clonedProcessedFiles.length > 0 && !alreadyHasCover) {
      clonedProcessedFiles[0].cover = true;
    }

    // Combine previous files with the updated processedFiles
    return {
      ...prevFiles,
      gallery: [...prevFiles.gallery, ...clonedProcessedFiles],
    };
  });
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
