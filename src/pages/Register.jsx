import React from "react";
import Loader from "../components/Loader";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchStorage } from "../utils/tzkt.js";
import { getFullActitveAccount } from "../utils/wallet.js";
import { useNavigate } from "react-router-dom";
// import CameraComponent from "../components/CameraComponent";
import Camera from "../components/Camera";
import axios from "axios";
import { registerAsVoter } from "../utils/operation.js";

const Register = () => {
  const { contractAdd } = useParams();
  const navigate = useNavigate();
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWllConnected, setIsWllConnected] = useState(false);
  const [fileImgUrl, setFileImgUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [voterIdno, setVoterIdno] = useState("");
  const [currentPic, setCurrentPic] = useState("");
  const [currentVoterCard, setCurrentVoterCard] = useState("");
  const [currentPicIpfs, setCurrentPicIpfs] = useState(null);
  const [currentVoterCardIpfs, setCurrentVoterCardIpfs] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getStorage = async () => {
      const storage = await fetchStorage(contractAdd);
      console.log(storage);
      if (
        storage === null ||
        storage === "" ||
        storage.isElectionStarted === true
      ) {
        navigate("/");
      }
      setStorage(storage);
      setLoading(false);
    };
    getStorage();

    getFullActitveAccount().then((res) => {
      if (res) {
        setIsWllConnected(true);
      } else {
        navigate("/voting/" + contractAdd);
      }
    });
  }, [contractAdd]);

  useEffect(() => {
    if (fileImgUrl) {
      const file = dataURLtoFile(fileImgUrl, "image.jpg");
      setCurrentPic(file);
    }
  }, [fileImgUrl]);

  function dataURLtoFile(dataurl, filename) {
    if (typeof dataurl === "string" && dataurl.includes(",")) {
      var arr = dataurl.split(",");
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } else {
      // Handle invalid dataurl
      console.error("Invalid dataurl:", dataurl);
      return null; // or handle it in your own way
    }
  }

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", currentPic);
    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);
    const formData2 = new FormData();
    formData2.append("file", currentVoterCard);
    const metadata2 = JSON.stringify({
      name: "File name",
    });
    formData2.append("pinataMetadata", metadata2);
    const options2 = JSON.stringify({
      cidVersion: 0,
    });
    formData2.append("pinataOptions", options2);
    try {
      setUploading(true);
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
          },
        }
      );
      let pic1 = res.data.IpfsHash;
      setCurrentPicIpfs(res.data.IpfsHash);
      console.log("Image Uploaded " + res.data.IpfsHash);
      const res2 = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData2,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: `Bearer ${process.env.REACT_APP_PINATA_JWT}`,
          },
        }
      );
      let pic2 = res2.data.IpfsHash;
      setCurrentVoterCardIpfs(res2.data.IpfsHash);
      console.log("Image Uploaded " + res2.data.IpfsHash);

      const operation = await registerAsVoter(
        contractAdd,
        name,
        email,
        phone,
        voterIdno,
        pic1,
        pic2
      );
      console.log(operation);
      setUploading(false);
      navigate("/voting/" + contractAdd);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <section className="flex flex-col items-center  w-full h-screen px-6">
          <form>
            <div class="space-y-8">
              <h2 class="text-2xl font-semibold leading-7 text-gray-900">
                Register
              </h2>

              <div class="border-b border-gray-900/10 pb-12">
                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div class="sm:col-span-6">
                    <label
                      for="first-name"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autocomplete="given-name"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-4">
                    <label
                      for="email"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address
                    </label>
                    <div class="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autocomplete="email"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        value={email}
                        required
                      />
                    </div>
                  </div>
                  <div class="sm:col-span-2">
                    <label
                      for="postal-code"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Phone
                    </label>
                    <div class="mt-2">
                      <input
                        type="number"
                        name="postal-code"
                        id="postal-code"
                        autocomplete="postal-code"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => {
                          setPhone(e.target.value);
                        }}
                        value={phone}
                        required
                      />
                    </div>
                  </div>

                  <div class="sm:col-span-2 sm:col-start-1">
                    <label
                      for="city"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Voter Id
                    </label>
                    <div class="mt-2">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autocomplete="address-level2"
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        onChange={(e) => {
                          setVoterIdno(e.target.value);
                        }}
                        value={voterIdno}
                        required
                      />
                    </div>
                  </div>
                  <div class="sm:col-span-2 sm:col-start-1">
                    <label
                      for="city"
                      class="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Upload Identity Card
                    </label>
                    <div class="mt-2">
                      <input
                        type="file"
                        onChange={(e) => {
                          setCurrentVoterCard(e.target.files[0]);
                        }}
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2 sm:col-start-1">
                    <Camera setFileImg2={setFileImgUrl} />
                  </div>

                  {/* {fileImgUrl !== "" ? (
                    <div class="sm:col-span-6">
                      <img src={fileImgUrl} alt="img" />
                    </div>
                  ) : null} */}
                </div>
              </div>
            </div>

            <div class="my-6 flex items-center justify-end gap-x-6">
              <button
                type="button"
                class="text-sm font-semibold leading-6 text-gray-900"
                onClick={() => {
                  navigate("/voting/" + contractAdd);
                }}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={(e) => {
                  e.preventDefault();
                  handleUpload();
                }}
                disabled={uploading}
              >
                {uploading ? (
                  <svg
                    aria-hidden="true"
                    role="status"
                    class="inline mr-3 w-4 h-4 text-white animate-spin"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="#E5E7EB"
                    ></path>
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                ) : null}
                Save
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
};

export default Register;
