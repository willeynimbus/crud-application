import React from "react";

export default function Header() {
  return (
    <section className="flex items-center justify-between bg-slate-50 h-full p-4">
      <div className="w-full h-full">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
          CRUD.io
        </h1>
      </div>
    </section>
  );
}
