"use client";

import { RequirementsMatrix } from "../../RequirementsMatrix/RequirementsMatrix";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { API_CONFIG } from "@/app/config/api";

export default function TablePage() {
  const searchParams = useSearchParams();
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileId = searchParams.get("fileId");

  useEffect(() => {
    if (fileId) {
      setLoading(true);
      fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_FILE_DATA(fileId)}`
      )
        .then((res) => res.json())
        .then((data) => {
          setFileData(data.items);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching file data:", error);
          setLoading(false);
        });
    }
  }, [fileId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!fileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        File not found
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="overflow-x-auto">
        <RequirementsMatrix columns={fileData} />
      </div>
    </div>
  );
}
