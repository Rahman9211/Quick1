import { Scissors, Sparkles } from "lucide-react";
import React from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [object, setObject] = useState("");
  const [input, setInput] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!object.trim()) {
      setLoading(false);
      toast.error("Please select an object to remove");
    }
    if (!input) {
      setLoading(false);
      toast.error("Please upload an image");
    }
    try {
      const formData = new FormData();
      console.log(formData);

      formData.append("image", input);
      formData.append("object", object);
      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
            "Content-Type": "mulipart/form-data",
          },
        }
      );
      console.log(data);

      if (data.success) {
        setContent(data.content);
        toast.success("Object removed successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);

      toast.error(error.message || "Something went wrong");
    }
    setLoading(false);
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/*left column*/}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-bold">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          accept="image/*"
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none text-sm font-bold rounded-md border cursor-pointer border-gray-300 text-gray-600"
          required
        />

        <p className="mt-6 text-sm font-bold">Describe object to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., car in background, tree from the image"
          required
        />
        <p className=" text-sm text-gray-500">
          Be specific about what you want to remove
        </p>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 my-1 rounded-full border-2 border-t-transparent"></span>
          ) : (
            <Scissors className="w-5"></Scissors>
          )}
          Remove Object
        </button>
      </form>
      {/*right column*/}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Scissors className="w-5 h-5 text-[#4A7AFF]"></Scissors>
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        {!content ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm flex flex-col items-center ga-5 text-gray-400">
              <Scissors className="w-9 h-9"></Scissors>
              <p>Upload an image and describe what to remove</p>
            </div>
          </div>
        ) : (
          <img src={content} alt="content" className="w-full h-full mt-3" />
        )}
      </div>
    </div>
  );
};

export default RemoveObject;
