import React, { CSSProperties } from 'react'
import { Tag } from 'antd'
import { useTheme } from '@superset-ui/core'

export type OnClickHandler = React.MouseEventHandler<HTMLElement>

export type Type = 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary' | 'secondary'

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  key?: string
  className?: string
  onClick?: OnClickHandler
  type?: Type
  style?: CSSProperties
  children?: React.ReactNode
  role?: string
}

export default function Label(props: LabelProps) {
  const theme = useTheme()
  const { colors, transitionTiming } = theme
  const { type, onClick, children, ...rest } = props
  const { primary, secondary, grayscale, success, warning, error, info } = colors

  let backgroundColor = grayscale.light3
  let backgroundColorHover = onClick ? primary.light2 : grayscale.light3
  let borderColor = onClick ? grayscale.light2 : 'transparent'
  let borderColorHover = onClick ? primary.light1 : 'transparent'
  let color = grayscale.dark1

  if (type && type !== 'default') {
    color = grayscale.light4

    let baseColor
    if (type === 'success') {
      baseColor = success
    } else if (type === 'warning') {
      baseColor = warning
    } else if (type === 'danger') {
      baseColor = error
    } else if (type === 'info') {
      baseColor = info
    } else if (type === 'secondary') {
      baseColor = secondary
    } else {
      baseColor = primary
    }

    backgroundColor = baseColor.base
    backgroundColorHover = onClick ? baseColor.dark1 : baseColor.base
    borderColor = onClick ? baseColor.dark1 : 'transparent'
    borderColorHover = onClick ? baseColor.dark2 : 'transparent'
  }

  return (
    <Tag
      css={{
        transition: `background-color ${transitionTiming}s`,
        whiteSpace: 'nowrap',
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        backgroundColor,
        borderColor,
        borderRadius: 21,
        padding: '0.35em 0.8em',
        lineHeight: 1,
        color,
        '&:hover': {
          backgroundColor: backgroundColorHover,
          borderColor: borderColorHover,
          opacity: 1,
        },
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Tag>
  )
}
