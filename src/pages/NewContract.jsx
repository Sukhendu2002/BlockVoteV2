import { Link } from "react-router-dom";
import ProtectedHeader from "../components/ProtectedHeader";
// import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import genericMultisigJSONfile from "../Contracts/generic.json";
import { connectWallet } from "../utils/wallet";
import { Tezos } from "../utils/tezos";
import { wallet } from "../utils/wallet";

const NewContract = () => {
  const { user } = useUser();
  const [info, setInfo] = useState({
    fullName: user.fullName,
    email: user.primaryEmailAddress.emailAddress,
    phoneNumber: "",
    votingTitle: "",
    description: "",
    // adminWalletAddress: "",
  });

  // const Tezos = new TezosToolkit("https://ghostnet.smartpy.io");
  // const wallet = new BeaconWallet({
  //   name: "Voting Dapp",
  //   preferredNetwork: "ghostnet",
  // });
  // Tezos.setWalletProvider(wallet);
  //TODO:Refactor and Add server
  const handleContructDeploy = async (e) => {
    e.preventDefault();
    if (
      info.fullName === "" ||
      info.email === "" ||
      info.phoneNumber === "" ||
      info.votingTitle === "" ||
      info.description === ""
      // info.adminWalletAddress === ""
    ) {
      alert("Please fill all the fields");
      return;
    }
    console.log(info);
    try {
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
        })
        .catch((error) =>
          console.log(`Error: ${JSON.stringify(error, null, 2)}`)
        );
      console.log("Got permissions:", permissions.address);
    } catch (error) {
      console.error("Got error:", error);
    }
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
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={handleContructDeploy}
          >
            Deploy Contract
          </button>
        </div>
      </form>
    </>
  );
};

export default NewContract;
