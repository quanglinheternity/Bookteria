'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle 
} from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-4">
              <div className="mt-0.5 shrink-0">
                {variant === 'success' && <CheckCircle2 className="h-5 w-5" />}
                {variant === 'destructive' && <AlertCircle className="h-5 w-5" />}
                {variant === 'warning' && <AlertTriangle className="h-5 w-5" />}
                {variant === 'info' && <Info className="h-5 w-5" />}
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
