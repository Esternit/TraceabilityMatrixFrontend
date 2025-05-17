import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function Sidebar({ files, selectedFileId, onFileSelect }) {
  return (
    <div className="w-64 border-r h-screen p-4">
      <h2 className="text-lg font-semibold mb-4">Файлы</h2>
      <ScrollArea className="h-[calc(100vh-6rem)]">
        <div className="space-y-2">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => onFileSelect(file.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors",
                selectedFileId === file.id && "bg-accent"
              )}
            >
              {file.readable_name}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
