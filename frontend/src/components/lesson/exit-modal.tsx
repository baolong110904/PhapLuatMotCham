"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "../ui/dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useExitModal } from "./use-exit-modal";

import OptimizedImage from '@/components/ui/OptimizedImage';
import { useRouter } from "next/navigation";

export const ExitModal = () => {
  const router = useRouter();
  const { isOpen, close } = useExitModal();


  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent tabIndex={-1} showCloseButton={false} className="max-w-md">
        <DialogClose
          tabIndex={-1}
          className="absolute right-3 top-3 border-1 rounded-lg p-1 text-gray-500 hover:text-black hover:bg-gray-150 cursor-pointer transition">
          <X className="h-5 w-5" />
        </DialogClose>
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <OptimizedImage
              src="/assets/crying-emoji-emoticon-svgrepo-com.svg"
              alt="Sad face"
              height={80}
              width={80}
              draggable={false}
            />
          </div>
          <DialogTitle className="text-center font-bold text-2xl">
            Đừng đi mà!
          </DialogTitle>
          <DialogDescription className="text-center font-bold text-2xl">
            Bạn chưa hoàn thành quiz. Bạn có chắc muốn rời đi không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full text-lg"
              size="lg"
              onClick={close}
              tabIndex={-1}
            >
              Học tiếp
            </Button>
            <Button
              variant="dangerOutline"
              className="w-full text-lg"
              size="lg"
              onClick={() => {
                close();
                router.push("/");
              }}
              tabIndex={-1}
            >
              Thoát
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
