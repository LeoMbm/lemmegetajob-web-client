import Sidebar from "@/components/global/Sidebar"
import Header from "@/components/global/Header"
import FooterWithLogo from "@/components/global/Footer"


export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) 
  {

    return (
      <div className="flex flex-col min-h-screen">
        <div className="w-full">
          <Header />
        </div>
        <div className="flex-grow flex overflow-hidden">
          <div className="flex flex-col justify-between mt-14">
            <Sidebar />
          </div>
          <section className="flex-grow overflow-y-auto mt-14">{children}</section>
        </div>
            <FooterWithLogo />
      </div>
    );
  }