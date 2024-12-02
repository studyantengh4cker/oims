import { Button } from "../ui/button";
import { FileIcon, MessageCircleQuestion } from "lucide-react";
import Notifications from "./Notifications";
import Image from "next/image";
import { SideNav } from "./SideBar";

export async function Topbar() {
  return (
    <nav className="z-50 bg-primary text-white fixed w-full top-0 left-0 px-5 py-5 border-b-2 flex items-center gap-4 justify-between">
      <div className="flex items-center gap-8 flex-1">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" height={40} width={40} alt="Logo" />
          <h1 className="font-black">OIMS</h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="md:flex items-center gap-1 hidden">
          <Button variant="link" className="space-x-1 text-white!">
            <MessageCircleQuestion />
            <p>Support</p>
          </Button>
          <Button variant="link" className="space-x-1 text-white!">
            <FileIcon />
            <p>Documentation</p>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Notifications />
          <SideNav />
        </div>
      </div>
    </nav>
  );
}
