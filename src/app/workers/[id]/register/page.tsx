"use client";

import Link from "next/link";
import {
  UserRound,
  Building2,
  ArrowRight,
} from "lucide-react";


export default function RegisterPage(){

  return (

    <main className="min-h-screen bg-slate-50 py-16">

      <div className="mx-auto max-w-3xl px-4">


        <h1 className="text-center text-4xl font-bold text-navy">
          অ্যাকাউন্ট তৈরি করুন
        </h1>


        <p className="mt-3 text-center text-navy/60">
          আপনি কোন ধরনের অ্যাকাউন্ট তৈরি করতে চান?
        </p>



        <div className="mt-10 grid gap-6 md:grid-cols-2">



          {/* Worker */}

          <Link
            href="/register-worker"
            className="group rounded-3xl border bg-white p-8 transition hover:border-orange hover:shadow-lg"
          >

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange/10 text-orange">

              <UserRound className="h-10 w-10"/>

            </div>


            <h2 className="mt-6 text-2xl font-bold text-navy">
              আমি কর্মী
            </h2>


            <p className="mt-3 text-navy/60">
              আপনার দক্ষতা যোগ করুন এবং কাজের সুযোগ পান।
            </p>


            <div className="mt-5 flex items-center font-semibold text-orange">

              Register করুন

              <ArrowRight className="ml-2 h-4 w-4"/>

            </div>


          </Link>




          {/* Employer */}

          <Link
            href="/employer"
            className="group rounded-3xl border bg-white p-8 transition hover:border-orange hover:shadow-lg"
          >

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange/10 text-orange">

              <Building2 className="h-10 w-10"/>

            </div>


            <h2 className="mt-6 text-2xl font-bold text-navy">
              আমি নিয়োগকর্তা
            </h2>


            <p className="mt-3 text-navy/60">
              দক্ষ কর্মী খুঁজুন এবং কাজ পোস্ট করুন।
            </p>


            <div className="mt-5 flex items-center font-semibold text-orange">

              Register করুন

              <ArrowRight className="ml-2 h-4 w-4"/>

            </div>


          </Link>


        </div>


      </div>

    </main>

  );

}