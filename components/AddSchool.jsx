"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddSchool({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [message, setMessage] = useState("");

  // Convert file ke base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = async (data) => {
    try {
      let base64File = null;

      if (data.image[0]) {
        base64File = await toBase64(data.image[0]); // ✅ kirim ke backend
      }

      const res = await fetch("/api/addSchool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          contact: data.contact,
          email_id: data.email_id,
          imageBase64: base64File, // ✅ backend expect ini
        }),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("School added successfully");
        reset();
        if (onSuccess) onSuccess();
      } else {
        setMessage(result.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error submitting form");
    }
  };

  return (
    <div className="w-full m-auto">
      <h1 className="text-2xl font-bold text-center mb-6 pb-4 border-b border-[#d1d1d1]">
        ADD SCHOOL
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white"
        encType="multipart/form-data"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          {/* Name */}
          <div>
            <label className="block font-medium text-base">School Name</label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="w-full p-2 rounded shadow-md border border-[#eaeaea] outline-none"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block font-medium">City</label>
            <input
              type="text"
              {...register("city", { required: "City is required" })}
              className="w-full p-2 rounded shadow-md border border-[#eaeaea] outline-none"
            />
            {errors.city && (
              <span className="text-red-500 text-sm">{errors.city.message}</span>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block font-medium">State</label>
            <input
              type="text"
              {...register("state", { required: "State is required" })}
              className="w-full p-2 rounded shadow-md border border-[#eaeaea] outline-none"
            />
            {errors.state && (
              <span className="text-red-500 text-sm">
                {errors.state.message}
              </span>
            )}
          </div>

          {/* Contact */}
          <div>
            <label className="block font-medium">Contact Us</label>
            <input
              type="number"
              {...register("contact", {
                required: "Contact is required",
                minLength: {
                  value: 10,
                  message: "Min 10 digits",
                },
              })}
              className="w-full p-2 rounded shadow-md border border-[#eaeaea] outline-none"
            />
            {errors.contact && (
              <span className="text-red-500 text-sm">
                {errors.contact.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              {...register("email_id", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-2 rounded shadow-md border border-[#eaeaea] outline-none"
            />
            {errors.email_id && (
              <span className="text-red-500 text-sm">
                {errors.email_id.message}
              </span>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium">Address</label>
            <input
              type="text"
              {...register("address", { required: "Address is required" })}
              className="w-full p-2 rounded shadow-md border border-[#eaeaea] outline-none"
            />
            {errors.address && (
              <span className="text-red-500 text-sm">
                {errors.address.message}
              </span>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="mt-4 mb-6">
          <label className="block font-medium mb-1" htmlFor="upload-img">
            School Image
          </label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: "Image is required" })}
            id="upload-img"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-3"
          />

          {errors.image && (
            <span className="text-red-500 text-sm">{errors.image.message}</span>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-xl font-bold text-white py-2 rounded-md hover:bg-blue-700"
        >
          SUBMIT
        </button>

        {message && <p className="text-center text-green-600">{message}</p>}
      </form>
    </div>
  );
}
