export const defaultAlignment = {
    vertical: "center",
    horizontal: "left",
} as const;

export const calculateLeftPosition = (
    columnIndex: number,
    columnWidths: number[]
): number => {
    return columnWidths
        .slice(0, columnIndex)
        .reduce((acc, width) => acc + width, 0);
};

