const url=  `https://api.cloudinary.com/v1_1/dvhm6gctu/image/upload`
//const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`

const uploadImage  = async(image) => {
    const formData = new FormData()
    formData.append("file",image)
    formData.append("upload_preset","mern_product")
    

    const dataResponse = await fetch(url,{
        method : "post",
        body : formData
    })

    const data = await dataResponse.json();
  return data.secure_url;
}

export default uploadImage ;