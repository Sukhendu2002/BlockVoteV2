import "./App.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewContract from "./pages/NewContract";

if (!process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function ProtectedPage() {
  return <Dashboard />;
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <ProtectedPage />
              </SignedIn>
              <SignedOut>
                <Landing />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/new-contract"
          element={
            <>
              <SignedIn>
                <NewContract />
              </SignedIn>
              <SignedOut>
                <Landing />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/sign-in"
          element={
            <>
              <SignedOut>
                <Login />
              </SignedOut>
              <SignedIn>
                <Landing />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/sign-up"
          element={
            <>
              <SignedOut>
                <Signup />
              </SignedOut>
              <SignedIn>
                <Landing />
              </SignedIn>
            </>
          }
        />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <ProtectedPage />
              </SignedIn>
              <SignedOut>
                <Landing />
              </SignedOut>
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <h1>Not found</h1>
              <UserButton />
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
};

export default App;
