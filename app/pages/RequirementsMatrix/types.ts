export type TextAlignment = {
    vertical: "top" | "center" | "bottom";
    horizontal: "left" | "center" | "right";
};

export type IconName =
    | "check"
    | "progress"
    | "warning"
    | "document"
    | "test-case"
    | "user"
    | "bug"
    | "link"
    | "folder"
    | "folder-open"
    | "file"
    | "file-check"
    | "file-warning"
    | "file-progress"
    | "file-error"
    | "file-code"
    | "file-search"
    | "file-spreadsheet"
    | "file-chart"
    | "file-pie"
    | "file-stack"
    | "file-symlink"
    | "file-up"
    | "file-down"
    | "file-input"
    | "file-output"
    | "file-json"
    | "file-type"
    | "file-archive"
    | "file-image"
    | "file-video"
    | "file-audio"
    | "file-cog"
    | "file-lock"
    | "file-key"
    | "file-heart"
    | "file-plus"
    | "file-minus"
    | "file-question";

export type Icon = {
    name: IconName;
    position: "left" | "right";
};

export type Cell = {
    cell_text: string;
    background_color?: string;
    text_color?: string;
    text_alignment?: TextAlignment;
    icon?: Icon;
    parent_id?: string,
    dependencies?: Cell[];
};

export type Column = {
    column_text: string;
    background_color?: string;
    text_color?: string;
    text_alignment?: TextAlignment;
    sorting?: {
        type: "alphabetical" | "numeric";
        enabled: boolean;
    };
    cells: Cell[];
};

export type Props = {
    columns: Column[];
};

export type SortConfig = {
    columnIndex: number;
    direction: "asc" | "desc";
} | null;

export type RequirementNode = {
    id: string;
    cell: Cell;
    children: RequirementNode[];
  };
