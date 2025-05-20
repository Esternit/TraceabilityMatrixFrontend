"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/app/config/api";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function RequirementsList() {
  const router = useRouter();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_FILES}`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
      })
      .catch((error) => console.error("Error fetching files:", error));
  }, []);

  const handleFileSelect = (fileId) => {
    router.push(`/requirements/${fileId}`);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar className="shrink-0">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Матрицы</SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="space-y-1">
                  {files.map((file) => (
                    <button
                      key={file.id}
                      onClick={() => handleFileSelect(file.id)}
                      className="w-full justify-start rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {file.readable_name}
                    </button>
                  ))}
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 h-screen overflow-auto w-[85%]">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">
              Выберите матрицу для просмотра
            </h1>
            <p className="text-gray-600">
              Нажмите на матрицу в боковой панели для просмотра
            </p>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
