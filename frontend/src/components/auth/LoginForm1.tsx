import { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
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

import backgroundImage from "../../assets/pexels-jplenio-1103970.jpg";
import sideImage from "../../assets/mitchell-luo-T5FMxVClmqY-unsplash.jpg";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      toast.error("Invalid credentials. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Left Visual Section */}
      <div className="hidden lg:flex flex-col items-center justify-center w-1/2 pr-10">
        <img
          src={sideImage}
          alt="Corporate cafeteria"
          className="rounded-2xl shadow-2xl w-full max-w-[500px] h-auto object-cover transition-transform duration-300 hover:scale-105"
        />
        <p className="mt-4 text-white text-center max-w-md bg-black/60 p-4 rounded-lg text-lg font-semibold animate-fade-in-up shadow-lg">
          <span className="block text-xl text-white tracking-wide">
            Seamlessly reserve your cafeteria seats.
          </span>
          <span className="block text-blue-300 mt-1 italic">No queues.</span>
          <span className="block text-blue-400 font-bold text-lg mt-1 animate-pulse">
            Just Blu Dollars.
          </span>
        </p>
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col items-center w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 text-bluedollar">
            <span className="text-blue-700">Blue</span> Reserve
          </h1>
          <p className="text-gray-500">Cafeteria seat booking made simple</p>
        </div>
        <Card
          className="w-full transform transition-transform duration-500 hover:scale-105 hover:shadow-2xl font-sans"
          style={{
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Login
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@ibm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus:ring-2 focus:ring-blue-400"
                />
                <div className="text-right text-sm text-blue-500">
                  <Link to="/forgot-password" className="hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-bluedollar hover:bg-bluedollar-dark transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-bluedollar hover:underline">
                  Register here
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;
