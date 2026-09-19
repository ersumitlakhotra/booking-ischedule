import FetchData from "../hook/fetchData.js";

export const getExtension = (file) => {
    if (!file) return "";

    const parts = file.split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
};

export const uploadToS3 = async ({ Name, Folder, File,FileType }) => {
    const Body = JSON.stringify({
        folder: Folder,
        name: `${Name}.${getExtension(File.name)}`,
        type: FileType
    })
    const response = await FetchData({
        method: 'POST',
        endPoint: 'uploadtos3',
        body: Body
    })
    const url = response.data.url;
    const success = response.data.success;
    const path = response.data.path;
    const message = response.data.message;
    if (!Boolean(success))
        return {status:false,message:"There was an issue while uploading the file. Please try again."}

    const result = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": FileType,
        },
        body: File,
    });
    if (result.ok)
        return {status:true,message:`${process.env.REACT_APP_AWS_BUCKET_URL}${path}`};
    else
        return {status:false,message:`Upload failed with error ${message}`};
}

export const handleFileChange = (event) => {
    return new Promise((resolve) => {
        const file = event.target.files?.[0];

        if (!file) {
            return resolve({
                status: false,
                error: "No file was selected.",
                file: null,
                fileType: null,
                base64: null,
            });
        }

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];

        if (!allowedTypes.includes(file.type)) {
            return resolve({
                status: false,
                error: "Only JPG and PNG image files are supported.",
                file: null,
                fileType: null,
                base64: null,
            });
        }

        const maxSizeMB = 4;

        if (file.size > maxSizeMB * 1024 * 1024) {
            return resolve({
                status: false,
                error: `The selected image exceeds the ${maxSizeMB} MB size limit.`,
                file: null,
                fileType: null,
                base64: null,
            });
        }

        const reader = new FileReader();

        reader.onload = () => {
            resolve({
                status: true,
                error: null,
                file,
                fileType: file.type,
                base64: reader.result,
            });
        };

        reader.onerror = () => {
            resolve({
                status: false,
                error: "We encountered an issue while reading the selected file.",
                file: null,
                fileType: null,
                base64: null,
            });
        };

        reader.readAsDataURL(file);
    });
};