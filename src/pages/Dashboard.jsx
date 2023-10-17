import ProtectedHeader from "../components/ProtectedHeader";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    const initContract = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:7000/init-contract",
          {
            email: user.primaryEmailAddress.emailAddress,
          }
        );
        console.log(data);
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
            className="bg-black text-white px-6 py-2 rounded-md"
          >
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
                {data?.contract?.map((item) => (
                  <tr key={item.contract}>
                    <th className="px-6 py-4 font-medium text-gray-900">
                      {item.name}
                    </th>
                    <td className="px-6 py-4">
                      {new Date(
                        parseInt(item.date) * 1000
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{item.contract}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-3 w-3"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Paid
                      </span>
                    </td>
                    <td className="flex justify-end gap-4 px-6 py-4 font-medium">
                      <a href="">Delete</a>
                      <a href="" className="text-primary-700">
                        Edit
                      </a>
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
