import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchStorage } from "../utils/tzkt.js";
import axios from "axios";
import Loader from "../components/Loader.jsx";
import { vote } from "../utils/operation.js";
import {
  connectWallet,
  getFullActitveAccount,
  disconnectWallet,
} from "../utils/wallet.js";
const Voting = () => {
  const { contractAdd } = useParams();
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [isWllConnected, setIsWllConnected] = useState(false);
  const [currentVoter, setCurrentVoter] = useState(null);
  const [voters, setVoters] = useState([]);
  const [forceLoading, setForceLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votingStates, setVotingStates] = useState(
    Array(listData.length).fill(false)
  );

  useEffect(() => {
    console.log("useEffect");
    const getStorage = async () => {
      const storage = await fetchStorage(contractAdd);
      console.log(storage);
      getCandidateList(parseInt(storage.candidateCount), storage.candidates);
      getVotersList(parseInt(storage.voterCount), storage.voters);
      setStorage(storage);
      setLoading(false);
    };
    getStorage();
    getFullActitveAccount().then((res) => {
      if (res) {
        setIsWllConnected(true);
      }
    });
  }, [contractAdd, forceLoading]);

  //get canidate list
  const getCandidateList = async (count, candidates) => {
    if (count > 0) {
      axios
        .get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${candidates}/keys`)
        .then((res) => {
          setListData(res.data);
          console.log(res.data);
        });
    }
  };
  //get voters list
  const getVotersList = async (count, voters) => {
    if (count > 0) {
      axios
        .get(`https://api.ghostnet.tzkt.io/v1/bigmaps/${voters}/keys`)
        .then((res) => {
          setVoters(res.data);
          console.log(res.data);
          const add = localStorage.getItem("walletAddress");
          const voter = res.data.find((item) => item.key === add);
          if (voter) {
            setCurrentVoter(voter);
            console.log(voter);
          }
        });
    }
  };

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <section className="flex flex-col items-center  w-full h-screen">
          <div className="flex flex-row items-center justify-between w-full h-1/4 px-[15%]">
            <div className="flex flex-col flex-left">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                {storage.electionName}
                <span className="border-2 border-gray-500 rounded-md px-2 py-[0.5px] ml-3 text-sm">
                  {storage.isElectionStarted
                    ? " Voting Started"
                    : storage.isElectionEnded
                    ? "Voting Ended"
                    : "Not Started"}
                </span>
                {currentVoter?.value?.hasVoted ? (
                  <span className="border-2 border-green-500 rounded-md px-2 py-[0.5px] ml-3 text-sm">
                    Voted
                    {storage.isElectionStarted && !storage.isElectionEnded
                      ? "/Result will be declared soon"
                      : "/Result Declared"}
                  </span>
                ) : (
                  <span className="border-2 border-yellow-500 rounded-md px-2 py-[0.5px] ml-3 text-sm">
                    {currentVoter?.value?.isRegistered &&
                    !currentVoter?.value?.isVerified
                      ? "Wait for Verification"
                      : currentVoter?.value?.isRegistered &&
                        currentVoter?.value?.isVerified
                      ? "Verified"
                      : "Not Registered"}
                  </span>
                )}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-6"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open(
                      `https://better-call.dev/ghostnet/${contractAdd}/operations`,
                      "_blank"
                    );
                  }}
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </p>
            </div>

            <div className="button flex flex-row gap-x-2">
              {isWllConnected && (
                <button
                  type="button"
                  //make this button a red outline
                  className="bg-white px-4 py-2 rounded-md flex border-2 border-red-500 text-red-600
                    hover:bg-red-500 hover:text-white transition duration-500 ease-in-out
                   
                  "
                  onClick={() => {
                    disconnectWallet();
                    setIsWllConnected(false);
                    //clear all the states
                    // setListData([]);
                    // setVoters([]);
                    setCurrentVoter(null);
                  }}
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
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    />
                  </svg>

                  {isWllConnected && "Disconnect Wallet"}
                </button>
              )}
              {isWllConnected &&
                !storage.isElectionStarted &&
                !currentVoter && (
                  <Link
                    type="button"
                    className="bg-black text-white px-4 py-2 rounded-md flex"
                    to={`/register/${contractAdd}`}
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
                    Register to Vote
                  </Link>
                )}
              {!isWllConnected && !storage.isElectionEnded && (
                <button
                  type="button"
                  className="bg-black text-white px-4 py-2 rounded-md flex"
                  onClick={
                    isWllConnected
                      ? !storage.isElectionStarted
                        ? () => {
                            alert("Voting is already started");
                          }
                        : () => {
                            alert("Voting is already started");
                          }
                      : () => {
                          connectWallet().then((res) => {
                            setIsWllConnected(true);
                            const getStorage = async () => {
                              const storage = await fetchStorage(contractAdd);
                              console.log(storage);
                              getCandidateList(
                                parseInt(storage.candidateCount),
                                storage.candidates
                              );
                              getVotersList(
                                parseInt(storage.voterCount),
                                storage.voters
                              );
                              setStorage(storage);
                              setLoading(false);
                            };
                            getStorage();
                            getFullActitveAccount().then((res) => {
                              if (res) {
                                setIsWllConnected(true);
                              }
                            });
                          });
                        }
                  }
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
                  {isWllConnected
                    ? "Register For Vote"
                    : "Connect Wallet for Vote"}
                </button>
              )}
            </div>
          </div>

          {listData.length > 0 ? (
            <div className="flex flex-col items-center w-[70%]">
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
                    {storage.isElectionStarted &&
                      currentVoter?.value?.isVerified && (
                        <th
                          scope="col"
                          className="px-6 py-4 font-medium text-gray-900"
                        >
                          Vote
                        </th>
                      )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                  {listData?.map((item, index) => (
                    <tr key={item.hash}>
                      <th className="px-6 py-4 font-medium text-gray-900">
                        {item.value.name}
                      </th>
                      <td className="px-6 py-4">{item.value.header}</td>
                      <td className="px-6 py-4">
                        <img
                          src={`https://cloudflare-ipfs.com/ipfs/${item.value.image}`}
                          alt="candidate"
                          className="h-12 w-12 rounded-full"
                        />
                      </td>
                      <td className="px-6 py-4">
                        {storage.isElectionStarted &&
                        currentVoter?.value?.isVerified &&
                        !currentVoter?.value?.hasVoted ? (
                          <button
                            type="button"
                            className="bg-black text-white px-4 py-2 rounded-md flex"
                            disabled={voting} // Disable the button if it's in the loading state
                            onClick={() => {
                              // Update the loading state for this specific row
                              setVoting(true);
                              const updatedVotingStates = [...votingStates];
                              updatedVotingStates[index] = true;
                              setVotingStates(updatedVotingStates);
                              const res = connectWallet();
                              vote(contractAdd, index)
                                .then((res) => {
                                  // After voting is complete, reset the loading state for this row
                                  const updatedVotingStates = [...votingStates];
                                  updatedVotingStates[index] = false;
                                  setVotingStates(updatedVotingStates);
                                  const getStorage = async () => {
                                    const storage = await fetchStorage(
                                      contractAdd
                                    );
                                    console.log(storage);
                                    getCandidateList(
                                      parseInt(storage.candidateCount),
                                      storage.candidates
                                    );
                                    getVotersList(
                                      parseInt(storage.voterCount),
                                      storage.voters
                                    );
                                    setStorage(storage);
                                    setLoading(false);
                                    try {
                                      const smsData = await axios.post(
                                        `${process.env.REACT_APP_SERVER_URL}/send`,
                                        {
                                          number: currentVoter?.value?.phone,
                                          message: `You are successfully voted for ${listData[index]?.value?.name} in ${storage.electionName} election`,
                                        }
                                      );
                                    } catch (error) {
                                      console.log(error);
                                    }
                                  };
                                  getStorage();
                                  getFullActitveAccount().then((res) => {
                                    if (res) {
                                      setIsWllConnected(true);
                                    }
                                  });
                                  setVoting(false);
                                })
                                .catch((error) => {
                                  // Handle any errors and reset the loading state if necessary
                                  const updatedVotingStates = [...votingStates];
                                  updatedVotingStates[index] = false;
                                  setVotingStates(updatedVotingStates);
                                  const getStorage = async () => {
                                    const storage = await fetchStorage(
                                      contractAdd
                                    );
                                    console.log(storage);
                                    getCandidateList(
                                      parseInt(storage.candidateCount),
                                      storage.candidates
                                    );
                                    getVotersList(
                                      parseInt(storage.voterCount),
                                      storage.voters
                                    );
                                    setStorage(storage);
                                    setLoading(false);
                                  };
                                  getStorage();
                                  getFullActitveAccount().then((res) => {
                                    if (res) {
                                      setIsWllConnected(true);
                                    }
                                  });
                                });
                            }}
                          >
                            {votingStates[index] ? (
                              <div className="flex items-center">
                                <svg
                                  aria-hidden="true"
                                  role="status"
                                  className="inline mr-3 w-4 h-4 text-white animate-spin"
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
                                Voting...
                              </div>
                            ) : (
                              "Vote"
                            )}
                          </button>
                        ) : currentVoter?.value?.hasVoted ? (
                          <span className="border-2 border-green-500 rounded-md px-2 py-[0.5px] ml-3 text-sm">
                            Voted
                          </span>
                        ) : (
                          <span className="border-2 border-yellow-500 rounded-md px-2 py-[0.5px] ml-3 text-sm">
                            {currentVoter?.value?.isRegistered &&
                            !currentVoter?.value?.isVerified
                              ? "Wait for Verification"
                              : currentVoter?.value?.isRegistered &&
                                currentVoter?.value?.isVerified
                              ? "Verified"
                              : "Not Registered"}
                          </span>
                        )}
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

          {storage.isElectionEnded && (
            <>
              <p
                className="my-5 text-md leading-6 text-gray-600 flex gap-x-4
              bold text-2xl font-semibold text-gray-900
            "
              >
                Result
              </p>

              <div className="flex flex-col items-center w-[70%]">
                <span>
                  Total Vote:{" "}
                  {listData.reduce((acc, item) => {
                    return acc + parseInt(item.value.votes);
                  }, 0)}
                </span>
                {listData.map((item, index) => (
                  <div className="flex flex-row justify-between w-full">
                    <span>
                      {item.value.name}: {item.value.votes}
                    </span>
                    <span>
                      {((item.value.votes / storage.voterCount) * 100).toFixed(
                        2
                      )}
                      %
                    </span>
                  </div>
                ))}
                <span
                  className="my-5 text-md leading-6 text-black-600 flex gap-x-4
              bold text-2xl font-semibold text-gray-900
            "
                >
                  Winner:{" "}
                  {
                    listData.sort((a, b) => {
                      return b?.value?.votes - a?.value?.votes;
                    })[0]?.value?.name
                  }
                  🎉
                </span>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
};

export default Voting;
