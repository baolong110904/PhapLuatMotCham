"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useExitModal } from "./use-exit-modal";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const ExitModal = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { isOpen, close } = useExitModal();

  useEffect(() => setIsClient(true), []);

  if (!isClient) {
    return null;
  }
  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center w-full justify-center mb-5">
            <Image
              src="/assets/sad-emoji-svgrepo-com.svg"
              alt="Sad face"
              height={80}
              width={80}
            />
          </div>
          <DialogTitle className="text-center font-bold">Đừng đi mà!</DialogTitle>
          <DialogDescription className="text-center text-base font-bold">
            Bạn chưa hoàn thành quiz. Bạn có chắc muốn rời đi không?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mb-4">
          <div className="space-y-4">
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              onClick={close}
            >
              Học tiếp
            </Button>
            <Button
              variant="dangerOutline"
              className="w-full"
              size="lg"
              onClick={() => {
                close()
                router.push("/home");
              }}
            >
              Thoát
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
