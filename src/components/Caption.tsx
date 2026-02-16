import styled from "styled-components"
import type { ReactNode } from 'react'

const CaptionContainer = styled.div<{
  $type: 'header' | 'footer'
  $backgroundColor?: string
  $color?: string
}>`
    position: absolute;
    left: 0;
    right: 0;
    ${props => props.$type === 'header' ? 'top: 0;' : 'bottom: 0;'}
    font-family: 'Comic Neue', cursive;
    color: ${props => props.$color || 'black'};
    text-transform: uppercase;
    font-weight: 700;
    background-color: ${props => props.$backgroundColor || '#e8c840'};
    padding: 8px 12px;
    border-top: ${props => props.$type === 'footer' ? '2px solid black' : 'none'};
    border-bottom: ${props => props.$type === 'header' ? '2px solid black' : 'none'};
    z-index: 2;
`

interface CaptionProps {
  type: 'header' | 'footer'
  backgroundColor?: string
  color?: string
  children?: ReactNode
}

function Caption({ type, backgroundColor, color, children }: CaptionProps) {
  return (
    <CaptionContainer $type={type} $backgroundColor={backgroundColor} $color={color}>
      {children}
    </CaptionContainer>
  )
}

export default Caption
