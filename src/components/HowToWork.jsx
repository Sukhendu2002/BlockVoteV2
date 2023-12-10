import React from "react";

const HowToWork = () => {
  return (
    <section class="py-10  sm:py-16 lg:py-24">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">
            How does it work?
          </h2>
          <p class="max-w-lg mx-auto mt-4 text-base leading-relaxed text-gray-600">
            From Idea to Reality: Deploying and Managing Elections with
            BlockVote
          </p>
        </div>

        <div class="relative mt-12 lg:mt-20">
          <div class="absolute inset-x-0 hidden xl:px-44 top-2 md:block md:px-20 lg:px-28">
            <img
              class="w-full"
              src="https://cdn.rareblocks.xyz/collection/celebration/images/steps/2/curved-dotted-line.svg"
              alt=""
            />
          </div>

          <div class="relative grid grid-cols-1 text-center gap-y-12 md:grid-cols-3 gap-x-12">
            <div>
              <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span class="text-xl font-semibold text-gray-700"> 1 </span>
              </div>
              <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Create a free account
              </h3>
              <p class="mt-4 text-base text-gray-600">
                Get started by registering your cryptocurrency wallet, creating
                a secure and trusted identity within the BlockVote network.
              </p>
            </div>

            <div>
              <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span class="text-xl font-semibold text-gray-700"> 2 </span>
              </div>
              <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Contract Deployment
              </h3>
              <p class="mt-4 text-base text-gray-600">
                Enhance your voting contracts effortlessly. Define election
                parameters, customize options, and manage participants to match
                your specific requirements.
              </p>
            </div>

            <div>
              <div class="flex items-center justify-center w-16 h-16 mx-auto bg-white border-2 border-gray-200 rounded-full shadow">
                <span class="text-xl font-semibold text-gray-700"> 3 </span>
              </div>
              <h3 class="mt-6 text-xl font-semibold leading-tight text-black md:mt-10">
                Seamless Voting Experience
              </h3>
              <p class="mt-4 text-base text-gray-600">
                Launch your elections and invite participants with ease. Users
                can securely connect their wallets and participate, ensuring a
                transparent and tamper-proof voting process on the blockchain.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowToWork;
