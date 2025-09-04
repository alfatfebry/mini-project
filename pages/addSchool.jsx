"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddSchool(){
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();

  const [message, setMessage] = useState("");

  const onSubmit = async(data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("city", data.city);
    formData.append("state", data.state);
    formData.append("contact", data.contact);
    formData.append("email_id", data.email_id);
    //formData.append("image", data.images[0]);

    const fileInput = document.querySelector('input[name="image"]');
    if(fileInput?.files[0]){
      formData.append("image", fileInput.files[0]);
    }

    try {

      const res = await fetch("/api/addSchool", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if(res.ok){
        setMessage("School added successfully");
        reset();
      } else{
        setMessage(result.error || "Something went wrong");
      }

    } catch(error){
      console.log(error);
      setMessage("Error submitting form");
    }
  };

  return(
    <div className="w-3/6 m-auto">
      <div className="flex">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white" encType="multipart/form-data">
      
      <h1 className="text-2xl font-bold text-center">Add School</h1>


      {/* Field Name */}
      <div>
        <label className="block font-medium"> School Name</label>
        <input type="text" {...register("name", {required: "Name is requires"})} 
          className="w-full p-2 rounded border-b"
        />
        {errors.name && (<span className="text-red-500 text-sm">{errors.name.message}</span>)}
      </div>

      {/* Field Address */}
      <div>
        <label className="block font-medium">Address</label>
        <textarea {...register("address", {required: "Address is required"})} className="border-zinc-500 border-b w-full p-2 rounded "/>
        {errors.address && (<span className="text-red-500 text-sm">{errors.address.message}</span>)}
      </div>

      {/* Field City */}
      <div>
        <label className="block font-medium">City</label>
        <input type="text" {...register("city", {required: "City is required"})} className="w-full p-2 rounded border-zinc-500 border-b"/>
        {errors.city && (<span className="text-red-500 text-sm">{errors.city.message}</span>)}
      </div>

      {/* State */}
      <div>
        <label className="block font-medium">State</label>
        <input type="text" {...register("state", {required: "State is required"})} className="w-full p-2 rounded border-zinc-500 border-b"/>
        {errors.city && (<span className="text-red-500 text-sm">{errors.state.message}</span>)}
      </div>


      {/* Contact */}
      <div>
        <label className="block font-medium">Contact Us</label>
        <input type="number" {...register("contact", {required: "Contact is required", minLength: {value:10, message: "Min 10 digits"}})} className="w-full p-2 rounded border-zinc-500 border-b"/>
        {errors.contact && (<span className="text-red-500 text-sm">{errors.contact.message}</span>)}
      </div>

      {/* Email */}
      <div>
        <label className="block font-medium">Email</label>
        <input
          type="email"
          {...register("email_id", { required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
          className="w-full border-b p-2 rounded border-zinc-500" 
        />
        {errors.email_id && (
          <span className="text-red-500 text-sm">
            {errors.email_id.message}
          </span>
        )}
      </div>

      {/* Image */}
        <div>
          <label className="block font-medium">School Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            className="w-full"
          />
          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image.message}</span>
          )}
        </div>
      

      {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {message && <p className="text-center text-green-600">{message}</p>}
        </form></div>
    </div>
  )

};