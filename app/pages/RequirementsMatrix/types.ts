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
    | "link";

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
