"use client"

import { Check, CircleOff, Info, LoaderCircle, TriangleAlert } from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-right"
      richColors
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      icons={{
        success: <Check/>,
        error: <CircleOff/>,
        loading: <LoaderCircle className="animate-spin"/>,
        info: <Info/>,
        warning: <TriangleAlert/>,

      }}
      {...props}
    />
  )
}

export { Toaster }
