import { createContext, useContext, ComponentProps, useState } from 'react'
import { createPortal } from 'react-dom'

import Modal from '@/components/shared/Modal'

type ModalProps = ComponentProps<typeof Modal>
type ModalOptions = Omit<ModalProps, 'open'>

interface ModalContextValue {
  open: (options: ModalOptions) => void
  close: () => void
}

const Context = createContext<ModalContextValue | undefined>(undefined)

const defaultValues: ModalProps = {
  open: false,
  body: null,
  onRightButtonClick: () => {},
  onLeftButtonClick: () => {},
}

export function ModalContext({ children }: { children: React.ReactNode }) {
  const [modalState, setModalState] = useState<ModalProps>(defaultValues)

  const $portal_root = document.getElementById('root-portal')

  const open = (options: ModalOptions) => {
    setModalState({ ...options, open: true })
  }

  const close = () => {
    setModalState(defaultValues)
  }

  const values = {
    open,
    close,
  }

  return (
    <Context.Provider value={values}>
      {children}
      {$portal_root != null
        ? createPortal(<Modal {...modalState} />, $portal_root)
        : null}
    </Context.Provider>
  )
}

// Modal Context로 감싸지 않고 사용하는 경우 방지
export function useModalContext() {
  const values = useContext(Context)

  if (values == null) {
    throw new Error('ModalContext 안에서 사용해주세요')
  }

  return values
}
