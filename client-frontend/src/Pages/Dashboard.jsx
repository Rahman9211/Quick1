import React, { useEffect, useState } from "react";
import { Sparkles, Gem } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import CreationItem from "../Component/CreationItem"; // ✅ correct path
import axios from "axios";
import toast from "react-hot-toast";

// Set default API base URL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  // Fetch user dashboard data
  const getDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get("/api/user/creations/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    getDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Plan Status</p>
            <h2 className="text-xl font-semibold">Premium</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      {loading ? (
        <div className="flex justify-center items-center h-3/4">
          <div className="animate-spin rounded-full h-11 w-11 border-4 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="mt-6 mb-4 text-lg font-semibold">Recent Creations</p>
          {creations.length > 0 ? (
            creations.map((item) => (
              <CreationItem key={item.id || item._id} item={item} />
            ))
          ) : (
            <p className="text-gray-500">No creations found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
