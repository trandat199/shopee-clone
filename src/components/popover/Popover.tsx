import { FloatingPortal, useFloating, arrow, shift, Placement } from '@floating-ui/react'
import React, { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className: string
  placement?: Placement
}
const Popover = ({ children, renderPopover, className, placement }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = useRef<HTMLElement>(null)
  const { x, y, strategy, refs, middlewareData } = useFloating({
    placement: placement,
    middleware: [
      shift(),
      arrow({
        element: arrowRef
      })
    ]
  })
  const showPopover = () => {
    setIsOpen(true)
  }

  const hidePopover = () => {
    setIsOpen(false)
  }
  return (
    <li ref={refs.setReference} onMouseEnter={showPopover} onMouseLeave={hidePopover} className={className}>
      {children}
      <FloatingPortal>
        {isOpen && (
          <div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0
            }}
          >
            <span
              className='absolute bottom-full hidden border-[11px] border-x-transparent border-b-white border-t-transparent lg:block'
              style={{
                left: middlewareData.arrow?.x,
                top: middlewareData.arrow?.y
              }}
              ref={arrowRef}
            ></span>
            {renderPopover}
          </div>
        )}
      </FloatingPortal>
    </li>
  )
}

export default Popover
