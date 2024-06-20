import { readAndCompressImage } from "browser-image-resizer";

export const handleFileUpload = async (files, setFile) => {
  const resizeConfig = {
    quality: 0.8,
    maxWidth: 1500,
    maxHeight: 1500,
    autoRotate: true,
    debug: true,
    mimeType: "image/jpeg",
  };
  const processedFiles = [];

  for (const file of files) {
    try {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      await new Promise((resolve) => (img.onload = resolve));

      if (
        img.naturalWidth <= resizeConfig.maxWidth &&
        img.naturalHeight <= resizeConfig.maxHeight
      ) {
        // Skip resizing if already within size limits
        processedFiles.push({
          blob: file,
          size: file.size,
          type: file.type,
          height: img.naturalHeight,
          width: img.naturalWidth,
        });
      } else {
        const imageBlob = await readAndCompressImage(file, resizeConfig);
        const resizedImg = document.createElement("img");
        resizedImg.src = URL.createObjectURL(imageBlob);
        await new Promise((resolve) => (resizedImg.onload = resolve));

        const resizedFile = {
          blob: imageBlob,
          size: imageBlob.size,
          type: imageBlob.type,
          height: resizedImg.naturalHeight,
          width: resizedImg.naturalWidth,
        };

        processedFiles.push(resizedFile);
        URL.revokeObjectURL(resizedImg.src);
      }

      URL.revokeObjectURL(img.src);
    } catch (error) {
      console.error("Error resizing file:", error);
    }
  }

  setFile((prevFiles) => {
    const clonedProcessedFiles = processedFiles.map((file) => ({ ...file }));
    const alreadyHasCover = prevFiles.gallery.some((file) => file.cover);
    if (clonedProcessedFiles.length > 0 && !alreadyHasCover) {
      clonedProcessedFiles[0].cover = true;
    }
    return {
      ...prevFiles,
      gallery: [...prevFiles.gallery, ...clonedProcessedFiles],
    };
  });

  return processedFiles;
};

// import Compressor from "compressorjs";
// import Resizer from "react-image-file-resizer";

// export const handleFileUpload = async (e, setFile) => {
//   const uploadedFiles = e.target.files;
//   if (!uploadedFiles) return; // Early return if no files selected

//   const processedFiles = [];

//   for (let i = 0; i < uploadedFiles.length; i++) {
//     const file = uploadedFiles[i];
//     const resizedFile = await resizeImage(file, 3000, 3000, "jpeg", 1);
//     processedFiles.push(resizedFile);
//   }

//   setFile((prevFiles) => {
//     const clonedProcessedFiles = processedFiles.map((file) => ({ ...file }));

//     // Check if any of the previous files already has a cover
//     const alreadyHasCover = prevFiles.gallery.some((file) => file.cover);

//     // If there are processed files and none of the previous files has a cover, set the first processed file as cover
//     if (clonedProcessedFiles.length > 0 && !alreadyHasCover) {
//       clonedProcessedFiles[0].cover = true;
//     }

//     // Combine previous files with the updated processedFiles
//     return {
//       ...prevFiles,
//       gallery: [...prevFiles.gallery, ...clonedProcessedFiles],
//     };
//   });
// };

// export const resizeImage = (file, maxWidth, maxHeight, format, quality) =>
//   new Promise((resolve, reject) => {
//     Resizer.imageFileResizer(
//       file,
//       maxWidth,
//       maxHeight,
//       format,
//       quality,
//       0,
//       (uri) => {
//         // Assuming uri is a base64 string here
//         const base64Data = uri.split(",")[1]; // Remove the data:image/jpeg;base64, part

//         // Convert base64 to Blob
//         const byteCharacters = atob(base64Data);
//         const byteNumbers = new Array(byteCharacters.length);
//         for (let i = 0; i < byteCharacters.length; i++) {
//           byteNumbers[i] = byteCharacters.charCodeAt(i);
//         }
//         const byteArray = new Uint8Array(byteNumbers);
//         const blob = new Blob([byteArray], { type: "image/jpeg" });

//         const resizedFile = {
//           blob: blob,
//           size: blob.size,
//           type: blob.type,
//           height: maxHeight, // Update with actual resized height
//           width: maxWidth, // Update with actual resized width
//         };

//         resolve(resizedFile);
//       },
//       "base64",
//       maxWidth,
//       maxHeight
//     );
//   });
