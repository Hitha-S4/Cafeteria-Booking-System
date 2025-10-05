import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { checkIfEmployeeExists, getAllUsers } from "@/services/api";

import animatedGif from "@/assets/signup-animation.gif"; // Add an animated gif for engagement
import backgroundImage from "@/assets/pexels-jplenio-1103970.jpg"; // Import the background image

const RegisterForm = ({ defaultEmail = "", allowGuestRegistration = true }) => {
  const [accountType, setAccountType] = useState<"ibmer" | "guest">("ibmer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"employee" | "manager">("employee");
  const [managerId, setManagerId] = useState("");

  const { register, isLoading, setUser } = useAuth();
  const navigate = useNavigate();

  // If IBM user details exist from prior fetch, autofill
  useEffect(() => {
    const profile = localStorage.getItem("ibmProfile");
    if (profile && accountType === "ibmer") {
      const { name, email } = JSON.parse(profile);
      setName(name || "");
      setEmail(email || "");
    }
  }, [accountType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accountType === "ibmer") {
      const response: any = await checkIfEmployeeExists(email);
      console.log(response);
      if (response?.profiles.length) {
        const ibmuser = response.profiles[0];
        localStorage.setItem("ibm_user", JSON.stringify(ibmuser));
        const allUsers = await getAllUsers();
        let presentUser = allUsers.find((e) => e.email === email);
        if (presentUser) {
          // presentUser.role = presentUser.roles[0].name;
          localStorage.setItem("user", JSON.stringify(presentUser));
          setUser(presentUser);
          navigate("/IBMProfile");

          return;
        }

        setName(
          ibmuser.content?.name?.first + " " + ibmuser.content?.name?.last
        );
        setPassword("1234567890");
        setRole("employee");
        setManagerId("2");
      }
    }

    try {
      await register(name, email, password, role, managerId || undefined);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("Registration failed. Try a different email.");
    }
  };

  const isGuestDisabled = accountType === "guest" && !allowGuestRegistration;

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      {/* Smaller gif card */}
      <div className="hidden md:block w-1/3 text-center">
        <img
          src={animatedGif}
          alt="Register illustration"
          className="mx-auto w-3/4 rounded-xl shadow-lg animate-fade-in"
        />
        <h2 className="mt-4 text-xl font-semibold text-black animate-slide-in">
          Join Blue Reserve and reserve your seat today!
        </h2>
      </div>

      <div className="w-full md:w-[500px]">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-bluedollar">Blue</span> Reserve
          </h1>
          <p className="text-gray-600">Cafetaria seat booking made simple</p>
        </div>

        <Card className="shadow-lg p-6">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label>Register as</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="ibmer"
                      checked={accountType === "ibmer"}
                      onChange={() => setAccountType("ibmer")}
                    />
                    IBM Employee
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="guest"
                      checked={accountType === "guest"}
                      onChange={() => setAccountType("guest")}
                    />
                    Guest
                  </label>
                </div>
                {isGuestDisabled && (
                  <p className="text-red-500 text-sm">
                    Guest registration is currently disabled.
                  </p>
                )}
              </div>

              {accountType !== "ibmer" && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={isGuestDisabled}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {accountType !== "ibmer" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isGuestDisabled}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full border p-2 rounded"
                      disabled={isGuestDisabled}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>
                  {role === "employee" && (
                    <div className="space-y-2">
                      <Label htmlFor="managerId">Manager ID</Label>
                      <Input
                        id="managerId"
                        value={managerId}
                        onChange={(e) => setManagerId(e.target.value)}
                        placeholder="e.g. 2"
                        required
                        disabled={isGuestDisabled}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-bluedollar hover:bg-bluedollar-dark"
                disabled={isLoading || isGuestDisabled}
              >
                {accountType === "ibmer"
                  ? "Find your W3 ID"
                  : isLoading
                  ? "Registering..."
                  : "Register"}
              </Button>
            </CardFooter>

            <div className="mb-4 text-center text-sm text-gray-500">
              <p>
                Already have an account?{" "}
                <Link to="/" className="text-bluedollar">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;
