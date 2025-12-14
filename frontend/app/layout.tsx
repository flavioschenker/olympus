import "./globals.css";
import SideMenu from "@/components/layout/SideMenu";
import SideProfile from "@/components/layout/SideProfile";

export default ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="en">
      <body>
        <div className='h-screen flex flex-row bg-layout-bg pt-4'>
            <div className='w-80 bg-jbcolor pl-5 pr-9 flex flex-col gap-5'>
                <div className="h-24 py-3 border-b border-border">
                    <SideProfile />
                </div>
                <div>
                    <SideMenu />
                </div>
            </div>
            <div className='flex-1 bg-white rounded-tl-4xl overflow-hidden border-border border'>{children}</div>
        </div>
      </body>
    </html>
  );
}
