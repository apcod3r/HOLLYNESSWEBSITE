import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  success: (msg: string) => void
  error: (msg: string) => void
  info: (msg: string) => void
}

const ToastContext = createContext<ToastContextValue>({
  success: () => {},
  error: () => {},
  info: () => {},
})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const add = useCallback((message: string, type: ToastType) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }, [])

  const remove = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const value: ToastContextValue = {
    success: (msg) => add(msg, 'success'),
    error:   (msg) => add(msg, 'error'),
    info:    (msg) => add(msg, 'info'),
  }

  const styles: Record<ToastType, { wrap: string; icon: string; Icon: typeof CheckCircleIcon }> = {
    success: {
      wrap: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-500',
      Icon: CheckCircleIcon,
    },
    error: {
      wrap: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
      Icon: XCircleIcon,
    },
    info: {
      wrap: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: 'text-blue-500',
      Icon: InformationCircleIcon,
    },
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80 pointer-events-none">
        {toasts.map(toast => {
          const { wrap, icon, Icon } = styles[toast.type]
          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto ${wrap}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${icon}`} />
              <span className="flex-1 text-sm font-medium leading-snug">{toast.message}</span>
              <button
                onClick={() => remove(toast.id)}
                className="text-current opacity-40 hover:opacity-80 transition-opacity flex-shrink-0"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
