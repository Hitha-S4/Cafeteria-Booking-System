import { useState } from "react";
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
import { Link } from "react-router-dom";
import animatedGif from "@/assets/signup-animation.gif"; // Add an animated gif for engagement
import backgroundImage from "@/assets/pexels-jplenio-1103970.jpg"; // Import the background image

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"employee" | "manager" | "admin">("employee");
  const [managerId, setManagerId] = useState("");

  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(name, email, password, role, managerId || undefined);
      toast.success("🎉 Registration successful!");
    } catch (error) {
      toast.error("❌ Registration failed. Try a different email.");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-cover bg-no-repeat"
      style={{
        backgroundImage: `url(${backgroundImage})`, // Set the background image
      }}
    >
      <div className="hidden md:block w-1/3 text-center"> {/* Smaller gif card */}
        <img
          src={animatedGif}
          alt="Register illustration"
          className="mx-auto w-3/4 rounded-xl shadow-lg animate-fade-in"
        />
        <h2 className="mt-4 text-xl font-semibold text-black animate-slide-in"> {/* Changed color to black */}
          Join Blue Reserve and reserve your seat today!
        </h2>
      </div>

      <div className="w-full md:w-[500px]"> {/* Increased the size of the register card */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-bluedollar">Blue</span> Reserve
          </h1>
          <p className="text-gray-600">Cafeteria seat booking made simple</p>
        </div>
        <Card className="shadow-lg p-6"> {/* Added padding for larger card */}
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full border p-2 rounded"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
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
                  />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-bluedollar hover:bg-bluedollar-dark transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </CardFooter>
            <div className="mb-4 text-center text-sm text-gray-500">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-bluedollar hover:underline">
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
