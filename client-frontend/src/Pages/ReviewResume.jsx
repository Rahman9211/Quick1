import { FileText, Sparkles } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

// Set base URL for axios
const baseURL = import.meta.env.VITE_BASE_URL;
if (baseURL) {
  axios.defaults.baseURL = baseURL;
}

const ReviewResume = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!input) {
      toast.error("Please select a file first");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed successfully");
      } else {
        toast.error(data.message || "Failed to review resume");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-col md:flex-row items-start gap-4 text-slate-700">
      {/* left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>
        <p className="mt-6 text-sm font-bold">Upload Resume</p>
        <input
          onChange={(e) => setInput(e.target.files?.[0] || null)}
          accept="application/pdf,image/png,image/jpeg"
          type="file"
          className="w-full p-2 px-3 mt-2 outline-none cursor-pointer text-sm font-bold rounded-md border border-gray-300 text-gray-600"
          required
          disabled={loading}
        />

        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF, PNG, JPG formats (Max 5MB)
        </p>
        <button 
          disabled={loading || !input} 
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 my-1 rounded-full border-2 border-white border-t-transparent"></span>
          ) : (
            <FileText className="w-5 h-5"/>
          )}
          Review Resume
        </button>
      </form>
      
      {/* right column */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#00DA83]" />
          <h1 className="text-xl font-semibold">Analysis Results</h1>
        </div>
        
        {!content ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="w-9 h-9" />
              <p>Upload your resume and click &quot;Review Resume&quot; to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-auto text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;