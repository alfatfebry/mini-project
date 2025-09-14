"use client"
import React from "react";

export default function Modal({isOpen, onClose, children}){
  if(!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-2xl p-6 relative">
        <button onClick={onClose} className="cursor-pointer absolute top-3 right-3 text-gray-500 hover:text-red-500">
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}