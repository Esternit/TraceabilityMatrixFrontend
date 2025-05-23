import { ReactNode } from "react";
import {
    Check,
    Loader2,
    AlertTriangle,
    FileText,
    ClipboardList,
    User,
    Bug,
    Link as LinkIcon,
    FolderTree,
    FolderOpen,
    File,
    FileCheck,
    FileWarning,
    FileClock,
    FileX,
    FileCode,
    FileSearch,
    FileSpreadsheet,
    FileBarChart,
    FilePieChart,
    FileStack,
    FileSymlink,
    FileUp,
    FileDown,
    FileInput,
    FileOutput,
    FileJson,
    FileType,
    FileArchive,
    FileImage,
    FileVideo,
    FileAudio,
    FileCog,
    FileLock,
    FileKey,
    FileHeart,
    FilePlus,
    FileMinus,
    FileQuestion,
    FileText as FileTextIcon,
    FileCheck as FileCheckIcon,
    FileWarning as FileWarningIcon,
    FileClock as FileClockIcon,
    FileX as FileXIcon,
    FileCode as FileCodeIcon,
    FileSearch as FileSearchIcon,
    FileSpreadsheet as FileSpreadsheetIcon,
    FileBarChart as FileBarChartIcon,
    FilePieChart as FilePieChartIcon,
    FileStack as FileStackIcon,
    FileSymlink as FileSymlinkIcon,
    FileUp as FileUpIcon,
    FileDown as FileDownIcon,
    FileInput as FileInputIcon,
    FileOutput as FileOutputIcon,
    FileJson as FileJsonIcon,
    FileType as FileTypeIcon,
    FileArchive as FileArchiveIcon,
    FileImage as FileImageIcon,
    FileVideo as FileVideoIcon,
    FileAudio as FileAudioIcon,
    FileCog as FileCogIcon,
    FileLock as FileLockIcon,
    FileKey as FileKeyIcon,
    FileHeart as FileHeartIcon,
    FilePlus as FilePlusIcon,
    FileMinus as FileMinusIcon,
    FileQuestion as FileQuestionIcon,
} from "lucide-react";
import { IconName } from "./types";

const iconStyles = {
    default: "h-4 w-4 text-muted-foreground",
    success: "h-4 w-4 text-green-500",
    warning: "h-4 w-4 text-yellow-500",
    error: "h-4 w-4 text-red-500",
    info: "h-4 w-4 text-blue-500",
    primary: "h-4 w-4 text-primary",
    secondary: "h-4 w-4 text-secondary",
    accent: "h-4 w-4 text-accent",
    muted: "h-4 w-4 text-muted-foreground",
};

export const iconMap: Record<IconName, ReactNode> = {
    check: <Check className={iconStyles.success} />,
    progress: <Loader2 className={`${iconStyles.info} animate-spin`} />,
    warning: <AlertTriangle className={iconStyles.warning} />,
    
    document: <FileText className={iconStyles.default} />,
    "test-case": <ClipboardList className={iconStyles.info} />,
    user: <User className={iconStyles.primary} />,
    bug: <Bug className={iconStyles.error} />,
    link: <LinkIcon className={iconStyles.info} />,
    
    folder: <FolderTree className={iconStyles.primary} />,
    "folder-open": <FolderOpen className={iconStyles.primary} />,
    file: <File className={iconStyles.default} />,
    
    "file-check": <FileCheck className={iconStyles.success} />,
    "file-warning": <FileWarning className={iconStyles.warning} />,
    "file-progress": <FileClock className={iconStyles.info} />,
    "file-error": <FileX className={iconStyles.error} />,
    
    "file-code": <FileCode className={iconStyles.info} />,
    "file-search": <FileSearch className={iconStyles.info} />,
    "file-spreadsheet": <FileSpreadsheet className={iconStyles.info} />,
    "file-chart": <FileBarChart className={iconStyles.info} />,
    "file-pie": <FilePieChart className={iconStyles.info} />,
    "file-stack": <FileStack className={iconStyles.info} />,
    "file-symlink": <FileSymlink className={iconStyles.info} />,
    
    "file-up": <FileUp className={iconStyles.success} />,
    "file-down": <FileDown className={iconStyles.warning} />,
    "file-input": <FileInput className={iconStyles.info} />,
    "file-output": <FileOutput className={iconStyles.info} />,
    
    "file-json": <FileJson className={iconStyles.info} />,
    "file-type": <FileType className={iconStyles.info} />,
    "file-archive": <FileArchive className={iconStyles.info} />,
    "file-image": <FileImage className={iconStyles.info} />,
    "file-video": <FileVideo className={iconStyles.info} />,
    "file-audio": <FileAudio className={iconStyles.info} />,
    
    "file-cog": <FileCog className={iconStyles.info} />,
    "file-lock": <FileLock className={iconStyles.warning} />,
    "file-key": <FileKey className={iconStyles.warning} />,
    "file-heart": <FileHeart className={iconStyles.error} />,
    
    "file-plus": <FilePlus className={iconStyles.success} />,
    "file-minus": <FileMinus className={iconStyles.error} />,
    "file-question": <FileQuestion className={iconStyles.warning} />,
};
