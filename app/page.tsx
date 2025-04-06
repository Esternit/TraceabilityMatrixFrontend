import Image from "next/image";
import TableDemo from "./pages/TableDemo";

export default function Home() {
  return (
    <div className="flex justify-center items-center mx-auto h-screen w-4/5">
      <TableDemo />
    </div>
  );
}
