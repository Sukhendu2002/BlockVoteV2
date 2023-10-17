import Header from "../components/Header";
import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center py-10 sm:py-8 lg:py-6">
        <SignUp 
            redirectUrl="/dashboard"
            signInUrl="/sign-in"
        />
      </section>
    </>
  );
};

export default Signup;
