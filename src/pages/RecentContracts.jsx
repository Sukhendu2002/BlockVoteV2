import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const RecentContracts = () => {
  const [data, setData] = useState(null);
  useEffect(() => {
    const initContract = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/recent-contracts`
        );
        setData(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };
    initContract();
  }, []);
  return (
    <section className="flex flex-col items-center  w-full h-screen mt-5 ">
      <h1 className="text-2xl font-semibold text-gray-900">
        Recent Contracts{" "}
      </h1>

      <div className="flex flex-col items-center w-[45%] p-5">
        {data &&
          data.map((contract) => (
            <Link
              className="flex flex-col items-center w-full p-5
                border rounded-md mb-5 bg-gray-100 border-gray-300
            hover:bg-gray-200 transition-all duration-200"
              to={`/voting/${contract.contract}`}
            >
              <span
                className="flex items-center w-full 
                justify-between mb-4
              "
              >
                <h1 className="text-xl font-semibold text-gray-900">
                  {contract.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold ${
                    contract.status === "Not Started"
                      ? "text-red-600 bg-red-200"
                      : null
                  } 
                          ${
                            contract.status === "Started"
                              ? "text-green-600 bg-green-100"
                              : null
                          }

                          ${
                            contract.status === "Ended"
                              ? "text-blue-600 bg-blue-200"
                              : null
                          }
                        `}
                >
                  {contract.status === "Not Started" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}

                  {contract.status.charAt(0).toUpperCase() +
                    contract.status.slice(1)}
                </span>
              </span>
              <div className="flex justify-between w-full">
                <p className="text-base text-gray-700">{contract.date}</p>
                <p className=" text-gray-700 text-sm">{contract.contract}</p>
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
};

export default RecentContracts;
