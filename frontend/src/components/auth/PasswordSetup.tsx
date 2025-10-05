// src/components/auth/PasswordSetup.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const PasswordSetup = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Assuming a service call to send the reset email goes here
    alert("Password reset link sent to your email.");

    // Redirect to login after a brief delay
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat" style={{ backgroundImage: `url('/assets/pexels-jplenio-1103970.jpg')` }}>
      <div className="flex flex-col items-center w-full max-w-md bg-white shadow-xl rounded-xl p-6 bg-opacity-80">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold mb-2 text-bluedollar">
            <span className="text-blue-700">Blue</span> Reserve
          </h1>
          <p className="text-gray-500">Reset your password to access your account</p>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Password Setup</CardTitle>
            <CardDescription>
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@ibm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-bluedollar hover:bg-bluedollar-dark">
                Send Reset Link
              </Button>
              <p className="text-sm text-gray-500 text-center">
                Remembered your password?{' '}
                <a href="/login" className="text-bluedollar hover:underline">
                  Login here
                </a>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PasswordSetup;
