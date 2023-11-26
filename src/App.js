import "./App.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewContract from "./pages/NewContract.jsx";
import AddParties from "./pages/AddParties.jsx";
import ProtectedHeader from "./components/ProtectedHeader";
import Header from "./components/Header";
import Voting from "./pages/Voting";
import Register from "./pages/Register";
import About from "./pages/About";
import RecentContracts from "./pages/RecentContracts.jsx";

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
          path="/add-parties/:contractAdd"
          element={
            <>
              <SignedIn>
                <AddParties />
              </SignedIn>
              <SignedOut>
                <Landing />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/voting/:contractAdd"
          element={
            <>
              <SignedIn>
                <>
                  <ProtectedHeader />
                  <Voting />
                </>
              </SignedIn>
              <SignedOut>
                <>
                  <Header />
                  <Voting />
                </>
              </SignedOut>
            </>
          }
        />
        <Route
          path="/register/:contractAdd"
          element={
            <>
              <SignedIn>
                <>
                  <ProtectedHeader />
                  <Register />
                </>
              </SignedIn>
              <SignedOut>
                <>
                  <Header />
                  <Register />
                </>
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
          path="/about"
          element={
            <>
              <SignedIn>
                <ProtectedHeader />
                <About />
              </SignedIn>
              <SignedOut>
                <Header />
                <About />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/recent-contracts"
          element={
            <>
              <SignedIn>
                <ProtectedHeader />
                <RecentContracts />
              </SignedIn>
              <SignedOut>
                <Header />
                <RecentContracts />
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
