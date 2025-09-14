import { X } from "lucide-react";
import { Progress } from "../ui/progress";
import { useExitModal } from "./use-exit-modal";
type props = {
  percentage: number;
};

export const Header = ({ percentage }: props) => {
  const {open} = useExitModal();
  return (
    <header className="lg:pt-[40px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1500px] mx-auto w-full">
      <X
        onClick={open}
        size={35}
        className="text-slate-500 hover:opacity-75 transition cursor-pointer"
      />
      <Progress className="[&>div]:bg-blue-600" value={percentage} />
    </header>
  );
};
