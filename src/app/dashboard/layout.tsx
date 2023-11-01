import Sidebar from "@/components/global/Sidebar";
import Header from "@/components/global/Header";
import FooterWithLogo from "@/components/global/Footer";
import AuthRoute from "@/components/auth/AuthRoute";
import { ChakraProvider } from "@chakra-ui/react";
import { fetchServerSideUser } from "@/lib/fetchServerSideUser";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchServerSideUser();
  if (!user) {
    redirect("/signin");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="w-full">
        <Header user={user} />
      </div>
      <div className="flex-grow flex overflow-hidden">
        <div className="flex flex-col justify-between mt-14">
          <Sidebar user={user} />
        </div>
        <section className="flex-grow mt-14">{children}</section>
      </div>
      <FooterWithLogo />
    </div>
  );
}
