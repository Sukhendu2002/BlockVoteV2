import Header from "../components/Header";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <>
      <Header />
      <section className="flex flex-col items-center justify-center py-10 sm:py-8 lg:py-6">
        <SignIn redirectUrl="/dashboard" signUpUrl="/sign-up" />
      </section>
    </>
  );
};

export default Login;
