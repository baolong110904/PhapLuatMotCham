import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 break-words rounded-xl text-lg font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-white border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-600 cursor-pointer",
        primary: "bg-blue-500 text-primary-foreground hover:bg-blue-600/90 border-blue-600 border-b-4 active:border-b-0 cursor-pointer",
        primaryOutline: "bg-white text-blue-500 hover:bg-slate-100 cursor-pointer",
        secondary: "bg-green-600 text-white hover:bg-green-600/90 border-green-800 border-b-4 active:border-b-0 cursor-pointer",
        secondaryOutline: "bg-white text-green-500 hover:bg-slate-100 cursor-pointer",
        danger: "bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-700 border-b-4 active:border-b-0 cursor-pointer",
        dangerOutline: "bg-rose-100 text-rose-500 hover:bg-rose-200/100 cursor-pointer",
        question:"bg-white text-slate-600 border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 cursor-pointer",
      },
      size: {
        default: "min-h-11 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-12 rounded-md px-22 has-[>svg]:px-4",
        icon: "size-10",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
