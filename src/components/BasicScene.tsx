import { Avatar } from "./ui/avatar";
import { AvatarImage } from "./ui/avatar";
import { AvatarFallback } from "./ui/avatar";
import { useRef } from "react";

export default function BasicScene() {
  return (
    <div className="w-full h-screen bg-[#7fbfb6]">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="container mx-auto px-4 py-8">
          <nav className="flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Rapture.io</h1>
            <div className="flex gap-6">
              <button className="text-white">Try in VR</button>
              <button className="text-white">About</button>
            </div>
          </nav>
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <h1 className="text-white text-8xl font-bold mb-20">Fomosphere</h1>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white" />
              </div>
              <p className="text-white text-sm uppercase tracking-wider">
               Developed by Saimon Islam
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
