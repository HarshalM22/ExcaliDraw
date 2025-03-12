'use client'

import Button from '@/components/Button';
import { HTTP_BACKEND } from '@/config';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';



export default function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

 async function loginUser(){
  const res = await axios.post(`${HTTP_BACKEND}/login`,{
    email,
    password
  })
  if(!res){
    console.log("something brokeee......")
  }
  router.replace("/dashboard") ;

 }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
   
  };

  return (
    <div className="min-h-screen flex flex-col">
    
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-mesh">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-serif font-bold text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Login in to your Excalidraw account
            </p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-lg border-8 border-white/30 shadow-2xs hover:shadow-2xl transition-all duration-300  p-8 rounded-xl shadow-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button onClick={loginUser} className="w-full justify-center" >
                 {"Log in"}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:text-primary/80">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
      
    </div>
  );
};

