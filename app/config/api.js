const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    GET_FILES: "/json-files",
    GET_FILE_DATA: (fileId) => `/json-files/${fileId}`,
  },
};
