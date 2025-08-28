import React from "react";
import { Copy, Edit, Sparkles } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: "Short (500-800 words)" },
    { length: 1200, text: "Medium (800-1200 words)" },
    { length: 1600, text: "Long (1200+ words)" },
  ];

  const [selectedLength, setSelectedLength] = React.useState(articleLength[0]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [content, setContent] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;
      const { data } = await axios.post(
        "/api/ai/generate-article",
        { prompt, length: selectedLength.length },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  // copy to clipboard
  const copyToClipboard = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(()=>{
        setCopied(false);
      },3000)
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.log("Failed to copy text:", error);
    }
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/*LEFT COLUMN*/}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#4A7AFF]" />
          <h1 className="text-xl font-semibold">Article Configuration</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="The Future of Artifical Intelligence is ..."
          required/>
        <p className="mt-4 text-sm font-medium">Article Length</p>

    <div className="mt-2 flex gap-3 mb-3 flex-wrap sm:max-w-9/11">
    {articleLength.map((item, index) => (<span onClick={() => setSelectedLength(item)}
    className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedLength.text === item.text
        ? "bg-blue-200 text-blue-700"
        : "bg-gray-50 text-gray-700"}`} key={index}>
              {item.text}
            </span>
          ))}
        </div>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="animate-spin w-4 h-4 my-1 rounded-full border-2 border-t-transparent"></span>
          ) : (
            <Edit className="w-5"></Edit>
          )}
          Generate Article
        </button>
      </form>
      {/*RIGHT COLUMN*/}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-[#4A7AFF]"></Edit>
          <h1 className="text-xl font-semibold">Generate Article</h1>
          <div className="ml-auto">
            <Copy
              className={`w-5 h-5 cursor-pointer ${
                !content ? "text-gray-400 cursor-not-allowed":
                 copied ? "text-green-500" : "text-[#4A7AFF]" }`}
              onClick={copyToClipboard}
              
            ></Copy>
          </div>
        </div>

        {!content ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="text-sm flex flex-col items-center ga-5 text-gray-400">
              <Edit className="w-9 h-9"></Edit>
              <p>Enter a Topic and "Generate Article" to get started</p>
            </div>
          </div>
        ) : (
<div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
  <div className="reset-tw">
    <Markdown>{content}</Markdown>
  </div>
</div>
  
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
