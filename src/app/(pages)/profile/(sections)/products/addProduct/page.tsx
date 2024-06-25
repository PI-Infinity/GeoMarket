"use client";
import { Input } from "@/app/components/input";
import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { FcAddImage } from "react-icons/fc";
import { MdClose, MdDelete } from "react-icons/md";
import { handleFileUpload } from "../fileInput";
import Button from "@/app/components/button";
import { useApp } from "@/app/context/app";
import Select from "@/app/components/select";
import { useAuth } from "@/app/context/auth";
import { useProfileContext } from "@/app/context/profile";
import Link from "next/link";
import { v4 } from "uuid";
import { useRouter } from "next/navigation";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/app/firebase";
import axios from "axios";
import { useProductsContext } from "@/app/context/products";
import Image from "@/app/components/image";
import UploadingRules from "./uploadingRules";

interface propsTypes {}

const AddProduct: React.FC<propsTypes> = () => {
  /**
   * app states
   */
  const { apiUrl, openBackDrop, setOpenBackDrop, activeLanguage } = useApp();

  /**
   * products context
   */
  const { categories } = useProductsContext();

  /**
   * current user state
   */
  const { currentUser } = useAuth();

  /* product state
   */
  const [product, setProduct] = useState({
    status: "inReview",
    title: { en: "", ka: "" },
    category: { value: "", label: "" },
    description: { en: "", ka: "" },
    price: { value: "", byOrder: false },
    gallery: [{ file: "" }],
    seller: {
      userId: currentUser?.userId,
      cover: currentUser?.cover,
      name: currentUser?.name,
    },
  });

  useEffect(() => {
    setProduct({
      status: "inReview",
      title: { en: "", ka: "" },
      category: { value: "", label: "" },
      description: { en: "", ka: "" },
      price: { value: "", byOrder: false },
      gallery: [],
      seller: {
        userId: currentUser?.userId,
        cover: currentUser?.cover,
        name: currentUser?.name,
      },
    });
  }, [currentUser]);

  // products context
  const { GetProducts, setAlert } = useProfileContext();

  // active language input switcher for title
  const [activeLanguageInputTitle, setActiveLanguageInputTitle] =
    useState("KA");

  // active language input switcher for description
  const [activeLanguageInputDesc, setActiveLanguageInputDesc] = useState("KA");

  // set product file as a cover image
  const setProductFileAsCover = (index: number) => {
    setProduct((prevProduct: any) => ({
      ...prevProduct,
      gallery: prevProduct.gallery.map((file: any, i: number) => ({
        ...file,
        cover: i === index, // Set true only for the clicked index
      })),
    }));
  };

  // disable uploading if some fields is not inputed
  const [disabled, setDisabled] = useState(true);
  const disable = () => {
    if (
      // product.title.en?.length < 1 ||
      product.title.ka.length < 1 ||
      // product.description.en.length < 1 ||
      product.description.ka.length < 1 ||
      product.gallery?.length < 1 ||
      product.price.value.length < 1 ||
      product?.category?.value?.length < 1
    ) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  };
  useEffect(() => {
    disable();
  }, [product]);

  /**
   * Product Upload ind cloud and db
   * */
  const router = useRouter();

  const close = () => {
    router.push("/profile/products");
  };

  const uploadFiles = async (event: any) => {
    const files = event.target.files;
    if (!files) return;

    const fileURLs = Array.from(files)
      .map((file) => {
        if (file instanceof Blob) {
          return {
            url: URL.createObjectURL(file),
            cover: false,
            file: file,
          };
        }
        return null;
      })
      .filter((file) => file !== null);

    setProduct((prev: any) => {
      const alreadyHasCover = prev.gallery.some((file: any) => file.cover);

      if (fileURLs.length > 0 && !alreadyHasCover) {
        if (fileURLs[0]) {
          fileURLs[0].cover = true;
        }
      }

      return {
        ...prev,
        gallery: [...prev.gallery, ...fileURLs],
      };
    });
  };

  const ProductUpload = async () => {
    setOpenBackDrop(true);

    const formData = new FormData();
    for (let i = 0; i < product.gallery.length; i++) {
      formData.append("gallery", product.gallery[i].file);
    }

    formData.append(
      "product",
      JSON.stringify({
        status: product.status,
        title: product.title,
        category: product.category.value,
        description: product.description,
        price: product.price,
        gallery: product.gallery.map(({ file, ...rest }) => rest), // Exclude file field
        seller: product.seller,
      })
    );

    try {
      const response = await axios.post(apiUrl + "/api/v1/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status === "success") {
        GetProducts();
        setProduct({
          status: "inReview",
          title: { en: "", ka: "" },
          category: { value: "", label: "" },
          description: { en: "", ka: "" },
          price: { value: "", byOrder: false },
          gallery: [],
          seller: {
            userId: currentUser?.userId, // replace with actual user ID
            cover: currentUser?.cover, // replace with actual cover URL
            name: currentUser?.name, // replace with actual name
          },
        });
        setTimeout(() => {
          close();
          setOpenBackDrop(false);
        }, 1000);
      }

      // Display success message or perform other actions as needed
    } catch (error: any) {
      console.error("Error during file upload:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 bg-white p-2 shadow-sm rounded-xl">
      <div className="w-full flex items-center justify-end">
        <div className="w-full text-xl font-semibold pl-0 laptop:pl-4">
          {activeLanguage.addProduct}
        </div>
        <div className="flex items-center gap-2 h-11">
          <div className="hidden laptop:flex w-40 h-full">
            <Button
              title={activeLanguage.upload}
              onClick={disabled ? () => undefined : () => ProductUpload()}
              background="green"
              color="white"
              disabled={disabled}
            />
          </div>
          <Link
            href="/profile/products"
            className="hover:brightness-105 w-11 h-11 bg-red-500 rounded-xl flex items-center justify-center cursor-pointer"
          >
            <MdClose size={32} color="white" />
          </Link>
        </div>
      </div>
      <div className="w-full laptop:w-1/2 laptop:px-4">
        <h4 className="ml-4">{activeLanguage?.rules}:</h4>
        <UploadingRules />
      </div>
      <div className="w-full flex-1 mt-2 flex flex-col laptop:flex-row pl-0 laptop:pl-4 overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setActiveLanguageInputTitle("KA")}
                countryCode="GE"
                style={{
                  opacity: activeLanguageInputTitle === "KA" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="Georgia"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setActiveLanguageInputTitle("EN")}
                countryCode="GB"
                style={{
                  opacity: activeLanguageInputTitle === "EN" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="United States"
              />
            </div>
            <div className="w-96">
              <Input
                label={`${activeLanguage.title}${
                  activeLanguageInputTitle === "KA" ? "*" : ""
                }`}
                value={
                  activeLanguageInputTitle === "KA"
                    ? product.title.ka
                    : product.title.en
                }
                onChange={(e: any) => {
                  const { value } = e.target;
                  setProduct((prev: any) => ({
                    ...prev,
                    title: {
                      ...prev.title,
                      [activeLanguageInputTitle === "KA" ? "ka" : "en"]: value,
                    },
                  }));
                }}
                type="text"
                maxLength={50}
              />
            </div>
          </div>
          <Select
            data={categories.filter((i: any) => i.value !== "")}
            value={product?.category}
            setValue={(e: any) => {
              setProduct((prev: any) => ({
                ...prev,
                category: e,
              }));
            }}
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setActiveLanguageInputDesc("KA")}
                countryCode="GE"
                style={{
                  opacity: activeLanguageInputDesc === "KA" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="Georgia"
              />
              <ReactCountryFlag
                className="emojiFlag"
                onClick={() => setActiveLanguageInputDesc("EN")}
                countryCode="GB"
                style={{
                  opacity: activeLanguageInputDesc === "EN" ? 1 : 0.5,
                  cursor: "pointer",
                }}
                aria-label="United States"
              />
            </div>
            <textarea
              id="desc"
              placeholder={`${activeLanguage.description}${
                activeLanguageInputDesc === "KA" ? "*" : ""
              }`}
              className="w-96 h-48 rounded-xl p-2 shadow-md bg-white"
              value={
                activeLanguageInputDesc === "KA"
                  ? product.description.ka
                  : product.description.en
              }
              onChange={(e) => {
                const { value } = e.target;
                setProduct((prev: any) => ({
                  ...prev,
                  description: {
                    ...prev.description,
                    [activeLanguageInputDesc === "KA" ? "ka" : "en"]: value,
                  },
                }));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const nextField = document.getElementById(
                    "price"
                  ) as HTMLInputElement;
                  if (nextField) {
                    nextField?.focus();
                  }
                }
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            {!product.price.byOrder && (
              <div className="w-96">
                <Input
                  label={activeLanguage.price + "* ₾"}
                  id="price"
                  value={product.price.value}
                  onChange={(e: any) =>
                    setProduct((prev: any) => ({
                      ...prev,
                      price: { ...prev.price, value: e.target.value },
                    }))
                  }
                  type="number"
                />
              </div>
            )}
            <FormControlLabel
              sx={{ color: "gray" }}
              style={{ width: "75%" }}
              control={
                <Checkbox
                  checked={product.price.byOrder}
                  onChange={(e: any) => {
                    setProduct((prev: any) => ({
                      ...prev,
                      price: {
                        ...prev.price,
                        value: "",
                        byOrder: !prev.price.byOrder,
                      },
                    }));
                  }}
                  name="byOrder"
                  sx={{ color: "Black" }}
                />
              }
              label={activeLanguage.byOrder + " " + activeLanguage.optional}
            />
            {product.price.byOrder && (
              <div className="w-96 mt-2">
                <Input
                  label={activeLanguage.createTime}
                  value={product.price.value}
                  onChange={(e: any) =>
                    setProduct((prev: any) => ({
                      ...prev,
                      price: { ...prev.price, value: e.target.value },
                    }))
                  }
                  type="text"
                  maxLength={50}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              multiple
              accept="image/jpeg, image/png, image/webp"
              onClick={(e: any) => {}}
              onChange={(e: any) => {
                e.preventDefault();
                if (e.target.files?.length > 5) {
                  alert(activeLanguage.maxFile);
                } else {
                  uploadFiles(e);
                }
              }}
            />
            <label
              htmlFor="fileInput"
              style={{ cursor: "pointer" }}
              className={`hover:brightness-105`}
            >
              <FcAddImage size={80} color={"red"} />
            </label>
            <span style={{ color: "red", fontSize: "14px" }}>
              {activeLanguage.maxFile}* კვადრატი 1:1 (იდეალური 1500px / 1500px)
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 laptop:grid-cols-3 laptop:max-h-96 gap-2 laptop:gap-0 mt-4 laptop:mt-0">
          {product.gallery.map((item: any, index) => {
            const cover = item?.cover;
            return (
              <div key={index} className="laptop:p-4 laptop:pl-6 rounded-md">
                <div
                  onClick={() => setProductFileAsCover(index)}
                  className={`border-red-500 ${
                    cover ? "border-[5px]" : "border-[0px]"
                  } w-full laptop:w-60 w-full laptop:h-60 overflow-hidden flex items-center rounded-xl relative bg-gray-300 shadow-sm`}
                >
                  {cover && (
                    <span className="absolute top-2 left-2 text-red-500 font-semibold z-10">
                      {activeLanguage.cover}
                    </span>
                  )}
                  <MdDelete
                    onClick={(e) => {
                      e.stopPropagation();

                      setProduct((prevProduct) => {
                        // Determine if the item being removed is the cover
                        const isCover = item.cover;

                        // Filter out the item
                        const newGallery: any = prevProduct.gallery.filter(
                          (i) => i !== item
                        );

                        // If the removed item was the cover, assign cover to the first item of the new array
                        if (isCover && newGallery.length > 0) {
                          newGallery[0].cover = true;
                        }

                        // Return the updated product with the new gallery
                        return {
                          ...prevProduct,
                          gallery: newGallery,
                        };
                      });
                    }}
                    size={24}
                    color="red"
                    className="absolute top-2 right-2 cursor-pointer z-10"
                  />
                  <Image
                    alt={currentUser?.name}
                    src={item?.url}
                    style={{
                      aspectRatio: 1,
                      cursor: "pointer",
                      objectFit: "cover",
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full laptop:hidden h-11 mb-16">
        <Button
          title={activeLanguage.upload}
          onClick={disabled ? () => undefined : () => ProductUpload()}
          background="green"
          color="white"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default AddProduct;
