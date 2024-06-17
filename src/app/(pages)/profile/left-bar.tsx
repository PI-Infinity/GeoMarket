import Image from "@/app/components/image";
import ShareComponent from "@/app/components/shareComponent";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { storage } from "@/app/firebase";
import axios from "axios";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { MdDiamond, MdShare, MdStar } from "react-icons/md";
import { resizeImage } from "./(sections)/products/fileInput";

const LeftBar = () => {
  // app context
  const { setOpenBackDrop, apiUrl, activeLanguage, language } = useApp();
  // filter filter
  const filterItems = [
    {
      value: "products",
      label: activeLanguage.products,
    },
    {
      value: "favourites",
      label: activeLanguage.favourites,
    },
    {
      value: "info",
      label: activeLanguage.personalInfo,
    },
    {
      value: "invoices",
      label: activeLanguage.invoices,
    },
    {
      value: "settings",
      label: activeLanguage.settings,
    },
  ];
  // get section title
  const pathname = usePathname();
  const section = pathname.split("/")[2];

  // auth context
  const { currentUser, setCurrentUser } = useAuth();

  /**
   * cover uploading
   * */

  const coverInput = async (e: any) => {
    const uploadedFile = e.target.files[0];

    if (!uploadedFile) return; // Early return if no files selected

    const maxWidth = 750;
    const maxHeight = 750;
    const quality = 1;

    const resizedFile = await resizeImage(
      uploadedFile,
      maxWidth,
      maxHeight,
      "jpeg",
      quality
    );

    CoverUpload(resizedFile);
  };

  // cover upload in cloud and db

  async function CoverUpload(coverFile: any) {
    const addFileInCloud = async (file: any) => {
      const fileRef = ref(storage, `users/${currentUser?.userId}/cover`);
      setOpenBackDrop(true);
      const uploadTask = uploadBytesResumable(fileRef, file?.blob);

      // Return a promise that resolves with the download URL upon successful upload
      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            // Handle unsuccessful uploads
            console.error(error);
            reject(error);
          },
          async () => {
            // Handle successful uploads on complete
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadURL,
                type: file.blob.type,
                width: file.width,
                height: file.height,
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    };

    try {
      const coverObject = await addFileInCloud(coverFile);

      const updatedUser = { ...currentUser, cover: coverObject };

      await axios.patch(
        apiUrl + `/api/v1/users/${currentUser?.userId}`,
        updatedUser
      );
      setCurrentUser(updatedUser);
      setOpenBackDrop(false);
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  }

  // Function to format the rating
  const formatRating = (rating: any) => {
    if (rating < 1000) return rating;
    if (rating < 10000) return `${(rating / 1000).toFixed(0)}k`;
    if (rating < 1000000) return `${Math.floor(rating / 1000)}k`;
    return `${(rating / 1000000).toFixed(1)}m`;
  };

  /**
   * share options
   */
  const [openShareOptions, setOpenShareOptions] = useState(false);

  return (
    <div
      className={`static laptop:h-[calc(100%-5.5rem)] h-full pb-8 laptop:pb-0 laptop:fixed  w-full laptop:w-80 bg-white rounded-xl shadow-sm flex flex-col items-center text-black`}
    >
      <div className="flex gap-1 w-full items-center justify-between p-4">
        <Link
          href="/subscription"
          className="flex items-center gap-2 cursor-pointer"
        >
          <MdDiamond
            size={28}
            className={`${
              currentUser && currentUser?.subscription?.type !== "Free"
                ? "text-orange-500"
                : "text-gray-400"
            } cursor-pointer hover:brightness-90`}
          />

          <p className="font-semibold">{currentUser?.subscription?.type}</p>
        </Link>
        <MdShare
          size={24}
          className="text-gray-300 cursor-pointer hover:brightness-95 ml-auto"
          onClick={() => setOpenShareOptions(true)}
        />
      </div>
      {openShareOptions && (
        <div className="mb-4">
          <ShareComponent
            setOpenShareOptions={setOpenShareOptions}
            path={`/user/${currentUser?.userId}/products`}
          />
        </div>
      )}
      <div
        style={{ width: "150px", height: "150px" }}
        className="rounded-full overflow-hidden flex items-center justify-center relative"
      >
        <input
          type="file"
          id="fileInputLogo"
          style={{ display: "none" }}
          multiple={false}
          accept="image/*"
          onChange={coverInput}
        />
        <label htmlFor="fileInputLogo">
          <Image
            alt={currentUser?.name}
            src={currentUser?.cover?.url}
            style={{
              zIndex: 0,
              cursor: "pointer",
              objectFit: "cover",
              width: 150,
              height: 150,
            }}
          />
        </label>
      </div>

      <div className="mt-4 text-lg font-semibold">{currentUser?.name}</div>

      <div className="flex items-center gap-1 mt-4">
        <MdStar size={24} color="orange" />
        <span>
          {currentUser?.rating ? formatRating(currentUser?.rating) : 0}
        </span>
      </div>

      {(language === "ka" && currentUser?.about?.ka?.length > 0) ||
      (language === "en" && currentUser?.about?.en?.length > 0) ? (
        <div className="p-4 w-full rounded-md font-normal italic text-center">
          {language === "ka" ? currentUser?.about?.ka : currentUser?.about?.en}
        </div>
      ) : null}
      <ul className="mt-4 flex flex-col gap-2 w-80 laptop:w-64">
        {filterItems.map((item: any, index: number) => {
          return (
            <Link
              key={index}
              href={`/profile/${item.value}`}
              className="hover:brightness-95 flex items-center w-full bg-gray-50 text-black font-semibold cursor-pointer shadow-sm rounded-xl"
            >
              <div
                className={`w-4 h-4 ml-4 rounded-full bg-${
                  item.value === section ? "red" : "gray"
                }-500`}
              ></div>
              <div className="p-2 pl-4">{item.label}</div>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftBar;
