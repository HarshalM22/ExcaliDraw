import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ReactNode } from "react";

export default function Layout({
  children
}: { children: ReactNode }) {
  return (
    // <html lang="en">
    //   <body>
    <div>
        <Navbar />
        {children}
        <Footer />
        </div>
    //   </body>
    // </html>
  );
}
