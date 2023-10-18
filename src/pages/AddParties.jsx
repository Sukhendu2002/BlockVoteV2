import ProtectedHeader from "../components/ProtectedHeader";

const AddParties = () => {
  return (
    <>
      <ProtectedHeader />
      <section
        className="flex flex-col items-center  w-full h-screen mt-5 "
        style={{ maxWidth: "1000px" }}
      >
        AddParties
      </section>
    </>
  );
};

export default AddParties;
