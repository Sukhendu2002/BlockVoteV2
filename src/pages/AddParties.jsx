import ProtectedHeader from "../components/ProtectedHeader.jsx";
import { useParams } from "react-router-dom";
import { useEffect, useState, Fragment, useRef } from "react";
import Loader from "../components/Loader.jsx";
import { Dialog, Transition } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { addCandidate, StartElect, verifyVoter } from "../utils/operation.js";
import { fetchStorage } from "../utils/tzkt.js";
import { connectWallet } from "../utils/wallet.js";

const AddParties = () => {
  const { contractAdd } = useParams();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [storage, setStorage] = useState(null);
  const cancelButtonRef = useRef(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(null);
  const [moto, setMotot] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    const getStorage = async () => {
      const storage = await fetchStorage(contractAdd);
      console.log(storage);
      getCandidateList(parseInt(storage.candidateCount), storage.candidates);
      getVotersList(parseInt(storage.voterCount), storage.voters);
      setStorage(storage);
      setLoading(false);
    };
    getStorage();
  }, [contractAdd]);

  //get canidate list
  const getCandidateList = async (count, candidates) => {
    if (count > 0) {
      axios
        .get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${candidates}/keys`)
        .then((res) => {
          setListData(res.data);
        });
    }
  };
  const getVotersList = async (count, voters) => {
    if (count > 0) {
      axios
        .get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${voters}/keys`)
        .then((res) => {
          setVoters(res.data);
          console.log(res.data);
        });
    }
  };

  const handleVerify = async (address) => {
    const account = await connectWallet();
    const res = await verifyVoter(contractAdd, address);
    console.log(res);
  };

  const sendFileToIPFS = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", photo);
    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);
    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);
    try {
      setUploadLoading(true);
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
      const candidate = await addCandidate(
        contractAdd,
        name,
        moto,
        res.data.IpfsHash
      );
      const data = await fetchStorage(contractAdd);
      getCandidateList(parseInt(data.candidateCount), data.candidates);
      setStorage(storage);
      console.log(candidate);
      setUploadLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <ProtectedHeader />
      {loading && <Loader />}
      {!loading && (
        <section className="flex flex-col items-center  w-full h-screen">
          <div className="flex flex-row items-center justify-between w-full h-1/4 px-[15%]">
            <div className="flex flex-col flex-left">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                {storage.electionName}
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600 flex gap-x-4">
                Contract Add: {contractAdd}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-4 h-6 text-black-500"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `http://localhost:3000/voting/${contractAdd}`
                    );
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              </p>
            </div>

            <div className="button flex flex-row gap-x-2">
              {storage && storage.candidateCount > 1 ? (
                <button
                  type="button"
                  className="text-white px-4 py-2 rounded-md flex gradient bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
                  // onClick={}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z"
                    />
                  </svg>
                  Start Election
                </button>
              ) : null}

              <button
                type="button"
                className="bg-black text-white px-4 py-2 rounded-md flex"
                onClick={() => setOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Add Candidate
              </button>
            </div>
          </div>
          <p
            className={`${
              listData.length > 1 ? "hidden" : "block"
            } text-gray-500 text-xl font-semibold mb-3`}
          >
            Please add atleast 2 candidates to start the election
          </p>
          {listData.length > 0 ? (
            <div className="flex flex-col items-center w-[70%] mb-4">
              <table className="w-full  bg-white text-left text-sm text-gray-500 border-collapse shadow-md rounded-md overflow-hidden ">
                <thead className="bg-gray-50 border-b border-gray-200 first-letter">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Moto
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Photo
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {listData?.map((item) => (
                    <tr key={item.hash}>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        {item.value.name}
                      </th>
                      <td className="px-6 py-4">{item.value.header}</td>
                      <td className="px-6 py-4">
                        <img
                          src={`https://gateway.pinata.cloud/ipfs/${item.value.image}`}
                          alt="candidate"
                          className="h-12 w-12 rounded-full"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900">
              No Candidates Found
            </h1>
          )}
          <p>
            <span className="text-gray-500 text-xl font-semibold ">
              Voters List
            </span>
          </p>
          {voters.length > 0 ? (
            <div className="flex flex-col items-center w-[70%] mt-5">
              <table className="w-full  bg-white text-left text-sm text-gray-500 border-collapse shadow-md rounded-md overflow-hidden ">
                <thead className="bg-gray-50 border-b border-gray-200 first-letter">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900 "
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Picture
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Identity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-gray-900"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {voters?.map((item) => (
                    <tr key={item.hash}>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        {item.value.name}
                      </th>
                      <td className="px-6 py-4">{item.value.voterAddress}</td>
                      <td className="px-6 py-4">
                        <img
                          src={`https://gateway.pinata.cloud/ipfs/${item.value.currentImage}`}
                          alt="candidate"
                          className="h-12 w-12 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <img
                          src={`https://gateway.pinata.cloud/ipfs/${item.value.voterIdImage}`}
                          alt="candidate"
                          className="h-12 w-12 rounded-full"
                        />
                      </td>
                      {item.value.isVerified ? (
                        <td className="px-6 py-4">Verified</td>
                      ) : (
                        <td className="px-6 py-4">
                          <button
                            type="button"
                            className="bg-black text-white px-4 py-2 rounded-md flex"
                            onClick={() =>
                              handleVerify(item.value.voterAddress)
                            }
                          >
                            Verify
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <h1 className="text-2xl font-semibold text-gray-900">
              No Voters Found
            </h1>
          )}

          <Transition.Root show={open} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              initialFocus={cancelButtonRef}
              onClose={setOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                      <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start ">
                          <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                            <Dialog.Title
                              as="h3"
                              className="text-base font-semibold leading-6 text-gray-900"
                            >
                              Add Candidate
                            </Dialog.Title>
                            <div className="col-span-full">
                              <label
                                htmlFor="photo"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Photo <span className="text-red-500">*</span>
                              </label>
                              <div className="mt-2 flex items-center gap-x-3">
                                {photo === null ? (
                                  <UserCircleIcon
                                    className="h-12 w-12 text-gray-300"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <img
                                    className="h-12 w-12 rounded-full"
                                    src={URL.createObjectURL(photo)}
                                    alt=""
                                  />
                                )}

                                <input
                                  accept="image/*"
                                  id="photo"
                                  name="photo"
                                  type="file"
                                  placeholder="Upload Photo"
                                  required
                                  onChange={(e) => {
                                    //check if file is selected
                                    console.log(e.target.files);
                                    if (e.target.files.length !== 0) {
                                      setPhoto(e.target.files[0]);
                                      console.log(e.target.files[0]);
                                    }
                                  }}
                                />
                              </div>
                            </div>

                            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-2 ">
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="first-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Candidate Name{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    autoComplete="given-name"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="sm:col-span-3">
                                <label
                                  htmlFor="last-name"
                                  className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                  Moto <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-2">
                                  <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    autoComplete="family-name"
                                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    required
                                    value={moto}
                                    onChange={(e) => setMotot(e.target.value)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                          type="button"
                          className="bg-black text-white px-6  rounded-md ml-2"
                          onClick={(e) => {
                            sendFileToIPFS(e);
                            // setOpen(false);
                          }}
                          disabled={uploadLoading}
                        >
                          {uploadLoading ? (
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
                          Add
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => {
                            setOpen(false);
                            setName("");
                            setPhoto(null);
                            setMotot("");
                          }}
                          ref={cancelButtonRef}
                          disabled={uploadLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </section>
      )}
    </>
  );
};

export default AddParties;
