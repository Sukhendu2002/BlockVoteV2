const Techs = () => {
  return (
    <section className="py-10  sm:py-16 lg:py-24">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h1
          className="text-3xl  leading-9 text-center font-mono font-extrabold text-black-900 sm:text-4xl sm:leading-10 md:text-5xl md:leading-14 mb-10"
          id="techs"
        >
          Technologies
        </h1>
        <div className="grid items-center grid-cols-2 gap-10 sm:gap-y-16 sm:grid-cols-3 xl:grid-cols-6">
          <div>
            <img
              className="object-contain w-auto mx-auto h-14
              "
              src="/logo192.png"
              alt=""
            />
          </div>

          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://upload.wikimedia.org/wikipedia/commons/6/68/Tezos_Logo_2022.png"
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://repository-images.githubusercontent.com/200548898/aaacbcc3-03e1-495f-a46e-70e06647b353"
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://smartpy.io/img/logo-only.svg"
              alt=""
            />
          </div>

          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://docs.walletbeacon.io/img/logo.svg"
              alt=""
            />
          </div>

          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://clerk.com/_next/image?url=%2Fimages%2Fclerk-logo.svg&w=96&q=75"
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://static-00.iconduck.com/assets.00/node-js-icon-1901x2048-mk1e13df.png"
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/1200px-MongoDB_Logo.svg.png"
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="/tailwind.png"
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://dappimg.com/media/image/dapp/f5eb7c0724e8444cb5a0982f8cda08a9.blob
              "
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://tzkt.io/logo.png"
              alt=""
            />
          </div>
          <div>
            <img
              className="object-contain w-auto mx-auto h-14"
              src="https://www.coywolf.news/wp-content/uploads/2021/05/pinata-logo.webp"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Techs;
