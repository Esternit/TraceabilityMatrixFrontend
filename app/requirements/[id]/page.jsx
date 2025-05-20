"use client";

import { RequirementsMatrix } from "@/app/pages/RequirementsMatrix/RequirementsMatrix";
import { RequirementsDependencies } from "@/app/pages/RequirementsMatrix/RequirementsDependencies";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef, useState, useEffect } from "react";
import ChartBuilder from "@/app/pages/ChartBuilder/ChartBuilder";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { API_CONFIG } from "@/app/config/api";
import { useRouter } from "next/navigation";
import { use } from "react";

export default function RequirementsPage({ params }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("table");
  const [files, setFiles] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const [expandedIds, setExpandedIds] = useState(new Set());
  const fileId = use(params).id;

  useEffect(() => {
    fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_FILES}`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
      })
      .catch((error) => console.error("Error fetching files:", error));
  }, []);

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

  const handleRequirementClick = (id, expandedNodes) => {
    setActiveTab("table");
    setExpandedIds(new Set(expandedNodes));

    setTimeout(() => {
      const element = document.querySelector(`[data-requirement-id="${id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight-row");
        setTimeout(() => {
          element.classList.remove("highlight-row");
        }, 2000);
      }
    }, 100);
  };

  const handleFileSelect = (fileId) => {
    router.push(`/requirements/${fileId}`);
  };

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
        Матрица не найдена
      </div>
    );
  }

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
                      className={`w-full justify-start rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                        fileId === file.id
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="table">Таблица</TabsTrigger>
                <TabsTrigger value="dependencies">Зависимости</TabsTrigger>
                <TabsTrigger value="charts">Графики</TabsTrigger>
              </TabsList>
              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <RequirementsMatrix
                    columns={fileData}
                    ref={tableRef}
                    expandedIds={expandedIds}
                    onExpandedIdsChange={setExpandedIds}
                  />
                </div>
              </TabsContent>
              <TabsContent value="dependencies">
                <div className="overflow-x-auto">
                  <RequirementsDependencies
                    columns={fileData}
                    onRequirementClick={handleRequirementClick}
                  />
                </div>
              </TabsContent>
              <TabsContent value="charts">
                <ChartBuilder />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
