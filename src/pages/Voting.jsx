import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchStorage } from "../utils/tzkt.js";
import axios from "axios";
import Loader from "../components/Loader.jsx";
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
                    : " Voting Not Started"}
                </span>
                <span className="border-2 border-yellow-500 rounded-md px-2 py-[0.5px] ml-3 text-sm">
                  {currentVoter?.value?.isRegistered &&
                  !currentVoter?.value?.isVerified
                    ? "Wait for Verification"
                    : currentVoter?.value?.isRegistered &&
                      currentVoter?.value?.isVerified
                    ? "Verified"
                    : "Not Registered"}
                </span>
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
              {!isWllConnected && (
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
        </section>
      )}
    </>
  );
};

export default Voting;
