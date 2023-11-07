import ProtectedHeader from "../components/ProtectedHeader";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [contracts, setContracts] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    const initContract = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/init-contract`,
          {
            email: user.primaryEmailAddress.emailAddress,
          }
        );
        console.log(data.contract.reverse());
        setContracts(data.contract);
        setData(data);
      } catch (error) {
        console.log(error);
      }
    };
    initContract();
  }, [user.primaryEmailAddress.emailAddress]);

  return (
    <>
      <ProtectedHeader />
      <section className="flex flex-col items-center  w-full h-screen mt-5 ">
        <div className="flex justify-between items-center w-[70%] p-5">
          <h1 className="text-2xl font-semibold text-gray-900">
            All Contracts{" "}
          </h1>
          <Link
            to="/new-contract"
            className="bg-black text-white px-6 py-2 rounded-md flex"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6 mr-1"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Contract
          </Link>
        </div>
        {data && data.contract.length < 1 ? (
          <h1 className="text-2xl font-semibold text-gray-900">
            No Contracts Found
          </h1>
        ) : (
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
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Contract Address
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  ></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                {contracts.map((item) => (
                  <tr key={item.contract}>
                    <th className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </th>
                    <td className="px-6 py-4">{item.date}</td>
                    <td className="px-6 py-4">{item.contract}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold ${
                          item.status === "Not Started"
                            ? "text-red-600 bg-red-100"
                            : null
                        } 
                          ${
                            item.status === "Started"
                              ? "text-green-600 bg-green-100"
                              : null
                          }

                          ${
                            item.status === "Ended"
                              ? "text-blue-600 bg-blue-100"
                              : null
                          }
                        `}
                      >
                        {item.status === "Not Started" ? (
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

                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </span>
                    </td>
                    <td className="flex justify-end gap-4 px-6 py-4 font-medium">
                      {/* <a href="">Delete</a> */}
                      <Link
                        to={`/add-parties/${item.contract}`}
                        className="text-primary-700"
                      >
                        {item.status === "Not Started"
                          ? "Add Candidates"
                          : "View Contract"}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;
