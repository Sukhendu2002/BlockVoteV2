import { Link } from "react-router-dom";
import ProtectedHeader from "../components/ProtectedHeader";
// import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import genericMultisigJSONfile from "../Contracts/generic.json";
import { connectWallet } from "../utils/wallet";
import { Tezos } from "../utils/tezos";
import { wallet } from "../utils/wallet";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewContract = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [info, setInfo] = useState({
    fullName: user.fullName,
    email: user.primaryEmailAddress.emailAddress,
    phoneNumber: "",
    votingTitle: "",
    description: "",
  });
  const [deploying, setDeploying] = useState(false);

  const handleContructDeploy = async (e) => {
    e.preventDefault();

    if (
      info.fullName === "" ||
      info.email === "" ||
      info.phoneNumber === "" ||
      info.votingTitle === "" ||
      info.description === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    console.log(info);
    try {
      setDeploying(true);
      console.log("Requesting permissions...");
      const permissions = await connectWallet();
      const accountPkh = await wallet.getPKH();
      let initStorage = `(Pair (Pair (Pair "${accountPkh}" (Pair "${info.email}" "${info.fullName}")) (Pair (Pair "${info.phoneNumber}" 0) (Pair {} "${info.description}"))) (Pair (Pair (Pair "${info.votingTitle}" False) (Pair False False)) (Pair (Pair 0 0) (Pair 0 {}))))`;
      console.log(initStorage);
      Tezos.wallet
        .originate({
          code: genericMultisigJSONfile,
          init: initStorage,
        })
        .send()
        .then((originationOp) => {
          console.log(`Waiting for confirmation of origination...`);
          return originationOp.contract();
        })
        .then((contract) => {
          console.log(`Origination completed for ${contract.address}.`);
          // setContractAddress(contract.address);
          uploadData(contract.address);
          setDeploying(false);
        })
        .catch((error) =>
          console.log(`Error: ${JSON.stringify(error, null, 2)}`)
        );
      console.log("Got permissions:", permissions.address);

      //Add contract to database
    } catch (error) {
      console.error("Got error:", error);
    }
  };

  const uploadData = async (contractAddress) => {
    const data = {
      email: info.email,
      contract: contractAddress,
      name: info.votingTitle,
    };
    const res = await axios.post("http://localhost:7000/add-contract", data);
    console.log(res);
    navigate("/dashboard");
  };

  return (
    <>
      <ProtectedHeader />
      <form className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 my-5">
        <div className="space-y-12">
          <div className=" border-gray-900/10 ">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              New Voting Contract
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              This information will be displayed publicly so be careful what you
              share.
            </p>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Organizer Information
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-full">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Full Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={info.fullName}
                    onChange={(e) =>
                      setInfo({ ...info, fullName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={info.email}
                    autoComplete="email"
                    className=" pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setInfo({ ...info, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="postal-code"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <input
                    type="number"
                    name="phone-number"
                    id="phone-number"
                    autoComplete="postal-code"
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setInfo({ ...info, phoneNumber: e.target.value })
                    }
                    value={info.phoneNumber}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Voting Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-full">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Voting Title
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setInfo({ ...info, votingTitle: e.target.value })
                    }
                    value={info.votingTitle}
                    required
                  />
                </div>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setInfo({ ...info, description: e.target.value })
                    }
                    value={info.description}
                    required
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Write a few sentences about your voting contract.
                </p>
              </div>
              {/* <div className="sm:col-span-6">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Admin Wallet Address
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    onChange={(e) =>
                      setInfo({ ...info, adminWalletAddress: e.target.value })
                    }
                    value={info.adminWalletAddress}
                    required
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Link
            to="/dashboard"
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
            style={{
              pointerEvents: deploying ? "none" : "auto",
              opacity: deploying ? "0.5" : "1",
            }}
          >
            Cancel
          </Link>
          {!deploying ? (
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={handleContructDeploy}
              disabled={deploying}
            >
              Deploy Contract
            </button>
          ) : (
            <button
              type="button"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              disabled={deploying}
            >
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
              Deploying...
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default NewContract;
