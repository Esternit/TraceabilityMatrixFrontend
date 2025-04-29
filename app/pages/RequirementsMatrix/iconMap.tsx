import { ReactNode } from "react";
import {
    Check,
    Loader2,
    AlertTriangle,
    FileText,
    ClipboardList,
    User,
    Bug,
    Link as LinkIcon
} from "lucide-react";
import { IconName } from "./types";

export const iconMap: Record<IconName, ReactNode> = {
    check: <Check className="h-4 w-4" />,
    progress: <Loader2 className="h-4 w-4 animate-spin" />,
    warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    document: <FileText className="h-4 w-4" />,
    "test-case": <ClipboardList className="h-4 w-4" />,
    user: <User className="h-4 w-4" />,
    bug: <Bug className="h-4 w-4 text-red-500" />,
    link: <LinkIcon className="h-4 w-4 text-blue-500" />,
};
