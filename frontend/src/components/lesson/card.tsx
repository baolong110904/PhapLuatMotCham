import { cn } from "@/lib/utils"

type Props = {
  id: number
  imageSrc: string | null
  text: string
  onClick: () => void
  disabled?: boolean
  status?: "correct" | "wrong" | "none"
}

export const Card = ({
  text,
  onClick,
  disabled = false,
  status = "none",
}: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full uppercase text-lg font-bold flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all cursor-pointer disabled:opacity-90",
        status === "none" &&
          "bg-white  border-slate-200 border-2 border-b-5 active:border-b-2 hover:bg-slate-100 text-slate-600 cursor-pointer",
        status === "correct" &&
          "bg-green-500 text-white border-green-700 border-b-5 active:border-b-0 cursor-pointer",
        status === "wrong" &&
          "bg-rose-600 text-primary-foreground border-rose-800 border-b-5 active:border-b-0 cursor-pointer"
      )}
    >
      {/* Optional image
      // {imageSrc && (
      //   <img
      //     src={imageSrc}
      //     alt={text}
      //     className="w-12 h-12 object-contain rounded-md border"
      //   />
      // )} */}

      <div className="flex flex-col">
        <span className="text-lg">{text}</span>
      </div>
    </button>
  )
}
