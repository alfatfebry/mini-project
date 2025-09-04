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

  const onSubmit = async (data) => {
    try {
      let imageBase64 = null;

      if (data.image && data.image[0]) {
        const file = data.image[0];
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });
      }

      const payload = {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        contact: data.contact,
        email_id: data.email_id,
        imageBase64,
      };

      console.log("Payload to API:", payload); // debug

      const res = await fetch("/api/addSchool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Successfully added ✅");
        reset();
      } else {
        setMessage(result.error || "Something went wrong ");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error submitting form");
    }

    console.log("Payload to API:", payload);

  };

  return(
    <div className="w-3/6 m-auto">
      <div className="flex">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white">
      
          <h1 className="text-2xl font-bold text-center">Add School</h1>

          {/* Name */}
          <div>
            <label className="block font-medium"> School Name</label>
            <input type="text" {...register("name", {required: "Name is required"})} 
              className="w-full p-2 rounded border-b"
            />
            {errors.name && (<span className="text-red-500 text-sm">{errors.name.message}</span>)}
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium">Address</label>
            <textarea {...register("address", {required: "Address is required"})} className="border-zinc-500 border-b w-full p-2 rounded "/>
            {errors.address && (<span className="text-red-500 text-sm">{errors.address.message}</span>)}
          </div>

          {/* City */}
          <div>
            <label className="block font-medium">City</label>
            <input type="text" {...register("city", {required: "City is required"})} className="w-full p-2 rounded border-zinc-500 border-b"/>
            {errors.city && (<span className="text-red-500 text-sm">{errors.city.message}</span>)}
          </div>

          {/* State */}
          <div>
            <label className="block font-medium">State</label>
            <input type="text" {...register("state", {required: "State is required"})} className="w-full p-2 rounded border-zinc-500 border-b"/>
            {errors.state && (<span className="text-red-500 text-sm">{errors.state.message}</span>)}
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
        </form>
      </div>
    </div>
  )
};
