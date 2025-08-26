import React, { useEffect, useState } from "react";
import { dummyPublishedCreationData } from "../assets/assets";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Heart, User } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get("/api/user/get-published-creations", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        {id},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user, getToken]); // ✅ Added getToken to dependency array

  if (loading) {
    return <div>Loading...</div>;
  }

  return !loading ? (
    <div className="flex-1 h-full flex flex-col gap-4 p-6">
      <div className="bg-white h-full w-full rounded-xl overflow-y-auto"> {/* ✅ Changed overflow-y-scroll to overflow-y-auto */}
        {creations.map((creation) => (
          <div
            key={creation.id || creation._id} // ✅ Added fallback for _id
            className="relative group inline-block pl-3 pt-3 w-full
            sm:w-1/2 lg:w-1/3"
          >
            <img
              src={creation.content}
              alt="AI creation"
              className="w-full h-full object-cover rounded-lg"
            />
            <div
              className="absolute bottom-0 top-0 right-0 left-3 flex gap-2
              items-end justify-end group-hover:justify-between p-3
              group-hover:bg-gradient-to-b from-transparent to-black/80 text-white
              rounded-lg"
            >
              <p className="text-sm hidden group-hover:block">
                {creation.prompt}
              </p>
              <div className="flex gap-1 items-center">
                <p>{creation.likes?.length || 0}</p>
                <Heart 
                  onClick={() => imageLikeToggle(creation.id || creation._id)} // ✅ Added fallback for _id
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    creation.likes?.includes(user.id) // ✅ Added optional chaining
                      ? "fill-red-500 text-red-600"
                      : "text-white"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-center h-full ">
      <span className="w-10 h-10 my-1 rounded-full border-3
      border-primary border-t-transparent animate-spin"></span>
    </div>
  )
};


export default Community;