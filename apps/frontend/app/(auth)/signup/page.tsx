'use client'

import Button from "@/components/Button";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Signup (){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");

  const router = useRouter();

  async function CreateUser(){
    const user = await axios.post(`${HTTP_BACKEND}/signup`,{
      email,
      password,
      name,
      username
    }) 
    
    if(!user){
      console.log('something brokeeeee.....')
    }
    router.replace("/login")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-mesh">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join thousands of teams using Excalidraw
            </p>
          </div>

          <div className=" bg-white/40 backdrop-blur-lg border-8 border-white/30 shadow-2xs hover:shadow-2xl transition-all duration-300 p-8 rounded-xl shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  User name
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="John_Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div>
                <Button onClick={CreateUser} className="w-full justify-center">
                  {"Create account"}
                </Button>
              </div>
            </form>

            
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="login"
                className="font-medium text-primary hover:text-primary/80"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};


