"use client";

import Link from "next/link";
import {
  Phone,
  Lock,
  LogIn,
} from "lucide-react";


export default function LoginPage(){

  return (

    <main className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-md px-4">

        <div className="rounded-3xl border bg-white p-8 shadow-sm">


          <h1 className="text-3xl font-bold text-navy">
            Login
          </h1>


          <p className="mt-2 text-navy/60">
            শ্রমবাজার অ্যাকাউন্টে প্রবেশ করুন
          </p>



          <form className="mt-8 space-y-5">


            <div>

              <label className="text-sm font-medium text-navy">
                মোবাইল নম্বর
              </label>


              <div className="relative mt-2">

                <Phone className="absolute left-3 top-3 h-5 w-5 text-navy/40"/>


                <input
                  className="h-12 w-full rounded-xl border pl-11 px-4"
                  placeholder="01XXXXXXXXX"
                />

              </div>

            </div>



            <div>

              <label className="text-sm font-medium text-navy">
                Password
              </label>


              <div className="relative mt-2">

                <Lock className="absolute left-3 top-3 h-5 w-5 text-navy/40"/>


                <input
                  type="password"
                  className="h-12 w-full rounded-xl border pl-11 px-4"
                  placeholder="Password"
                />

              </div>

            </div>



            <button
              className="flex h-12 w-full items-center justify-center rounded-xl bg-orange font-semibold text-white"
            >

              <LogIn className="mr-2 h-5 w-5"/>

              Login

            </button>


          </form>



          <p className="mt-6 text-center text-sm text-navy/60">

            নতুন অ্যাকাউন্ট?

            <Link
              href="/register"
              className="ml-2 font-semibold text-orange"
            >
              Register করুন
            </Link>

          </p>



        </div>

      </div>

    </main>

  );

}