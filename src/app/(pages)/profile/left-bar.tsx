import Image from "@/app/components/image";
import ShareComponent from "@/app/components/shareComponent";
import { useApp } from "@/app/context/app";
import { useAuth } from "@/app/context/auth";
import { storage } from "@/app/firebase";
import axios from "axios";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Link from "next/link";
import { usePathname } from "next/navigation";
import nProgress from "nprogress";
import { useState } from "react";
import { MdClose, MdDiamond, MdDone, MdShare, MdStar } from "react-icons/md";
import { readAndCompressImage } from "browser-image-resizer";
import { MoonLoader } from "react-spinners";
import { formatNumbers } from "@/app/utils/formatNumbers";

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
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInput = async (event: any) => {
    setUploadingCover(true);
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.patch(
        `${apiUrl}/api/v1/users/${currentUser?.userId}/cover`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === "success") {
        setCurrentUser((prev: any) => ({
          ...prev,
          cover: response.data.cover,
        }));
        setTimeout(() => {
          setUploadingCover(false);
        }, 500);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  /**
   * delete cover
   */
  const DeleteCover = async () => {
    try {
      setUploadingCover(true);
      const response = await axios.patch(
        apiUrl + "/api/v1/users/" + currentUser?.userId + "/delete-cover"
      );
      if (response.data.status === "success") {
        setCurrentUser((prev: any) => ({ ...prev, cover: null }));
        console.log("Cover image deleted successfully");

        setUploadingCover(false);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
    }
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
      <div className="relative">
        {currentUser?.cover?.url && (
          <div
            className="h-6 w-6 rounded-full flex items-center justify-center absolute top-2 right-2 z-10 cursor-pointer hover:brightness-95"
            onClick={(e) => e.stopPropagation()}
            style={{
              WebkitBackdropFilter: "blur(30px)",
              backdropFilter: "blur(30px)",
            }}
          >
            <MdClose
              size={20}
              color="red"
              className="shadow-xl"
              onClick={DeleteCover}
            />
          </div>
        )}

        <form
          id="uploadForm"
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
          {uploadingCover && (
            <div
              style={{ background: "rgba(0,0,0,0.2)" }}
              className="absolute z-10 w-full h-full flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:brightness-95">
                <MoonLoader size={24} color="white" />
              </div>
            </div>
          )}
        </form>
      </div>

      <div className="mt-4 text-lg font-semibold">{currentUser?.name}</div>

      <div className="flex items-center gap-1 mt-4">
        <MdStar size={24} color="orange" />
        <span>
          {currentUser?.rating ? formatNumbers(currentUser?.rating) : 0}
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
