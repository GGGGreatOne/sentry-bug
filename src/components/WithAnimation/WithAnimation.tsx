import classNames from 'classnames'
import { ReactNode } from 'react'
import { InView } from 'react-intersection-observer'
import { useWithAnimationStyles } from './useWithAnimationStyles'
interface IAnimateInViewWrapProps {
  children?: ReactNode
  Component?: any
  triggerOnce?: boolean
  className?: any
  defaultAnimation?: boolean
  addClassInView?: any
  rootMargin?: string
  [otherProp: string]: any
  delay?: number
}

export const WithAnimation = ({
  children,
  triggerOnce = false,
  Component = 'div',
  className,
  defaultAnimation = true,
  addClassInView,
  delay = 300,
  rootMargin = '0px 0% -15% 0%',
  ...props
}: IAnimateInViewWrapProps) => {
  const classes = useWithAnimationStyles()

  return (
    <InView triggerOnce={triggerOnce} rootMargin={rootMargin} delay={delay}>
      {({ inView, ref }) => (
        <Component
          ref={ref}
          className={classNames(
            className,
            defaultAnimation && classes.awaitInView,
            defaultAnimation && inView && classes.inView,
            addClassInView && inView && addClassInView
          )}
          {...props}
        >
          {children && children}
        </Component>
      )}
    </InView>
  )
}
