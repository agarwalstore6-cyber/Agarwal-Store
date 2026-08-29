/* =========================================================
   AGARWAL STORE
   CODE 13 — CLOUDINARY IMAGE FOUNDATION
   ========================================================= */

const AGARWAL_CLOUDINARY = {

  cloudName:
    "kohyufks",

  uploadPreset:
    "agarwal_store_images",

  uploadUrl:
    "https://api.cloudinary.com/v1_1/kohyufks/image/upload"

};


/* =========================================================
   CLOUDINARY IMAGE UPLOAD
   ========================================================= */

async function uploadImage(
  file,
  folder = "agarwal-store"
) {

  if (!file) {

    throw new Error(
      "Please select an image."
    );

  }


  const formData =
    new FormData();


  formData.append(
    "file",
    file
  );


  formData.append(
    "upload_preset",
    AGARWAL_CLOUDINARY.uploadPreset
  );


  formData.append(
    "folder",
    folder
  );


  const response =
    await fetch(
      AGARWAL_CLOUDINARY.uploadUrl,
      {
        method: "POST",
        body: formData
      }
    );


  if (!response.ok) {

    throw new Error(
      "Cloudinary image upload failed."
    );

  }


  const result =
    await response.json();


  if (!result.secure_url) {

    throw new Error(
      "Cloudinary did not return an image URL."
    );

  }


  return {

    url:
      result.secure_url,

    publicId:
      result.public_id,

    width:
      result.width,

    height:
      result.height,

    format:
      result.format,

    bytes:
      result.bytes

  };

}


/* =========================================================
   PUBLIC CLOUDINARY API
   ========================================================= */

window.AgarwalCloudinary = {

  uploadImage,

  config:
    AGARWAL_CLOUDINARY

};


/* =========================================================
   CLOUDINARY READY
   ========================================================= */

window.dispatchEvent(

  new CustomEvent(
    "agarwal:cloudinary-ready"
  )

);
