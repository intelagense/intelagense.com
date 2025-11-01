import styled from 'styled-components'
import { Children, type ReactNode } from 'react'
import HalftoneBackground from './HalftoneBackground'
import Caption from './Caption'

const PanelContainer = styled.div<{ $width?: 'full' | 'half'; $hasBackground?: boolean }>`
  position: relative;
  font-family: 'Comic Neue', cursive;
  color: black;
  padding: 5px;
  border-radius: 2px;
  border: 2px solid black;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 700;
  ${props => props.$hasBackground ? 'min-height: 300px;' : ''}
  overflow: hidden;
  flex: ${props => props.$width === 'half' ? '1 1 calc(50% - 5px)' : '1 1 100%'};
  
  p {
    margin: 0;
    padding: 10px 0;
  }

  /* Force single column on mobile */
  @media (max-width: 768px) {
    flex: 1 1 100%;
    min-width: 100%;
  }
`;

const PanelContent = styled.div<{ $hasBackground?: boolean }>`
  position: relative;
  z-index: 1;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  justify-content: ${props => props.$hasBackground ? 'flex-end' : 'flex-start'};
  ${props => props.$hasBackground ? 'min-height: 100%;' : 'padding: 20px;'}
  
  /* Re-enable pointer events for interactive elements */
  a, button, input, textarea, select {
    pointer-events: auto;
  }
`;

const BackgroundLayer = styled.div<{ $background?: string; $revealOnHover?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  transition: transform 0.5s ease;
  transform-origin: center center;
  
  /* Original image overlay on hover */
  ${props => props.$revealOnHover && props.$background && `
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: url(${props.$background});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
      z-index: 1;
    }
  `}
`;

const PanelContainerHoverable = styled(PanelContainer)<{ $revealOnHover?: boolean }>`  
  ${props => props.$revealOnHover && `
    &:hover ${BackgroundLayer}::after {
      opacity: 1;
    }
  `}
  
  ${props => !props.$revealOnHover && props.$hasBackground && `
    &:hover ${BackgroundLayer} {
      transform: scale(1.01);
      
      &::before {
        animation: barrierFlash 1.2s ease-in-out forwards;
      }
    }
  `}
`;

interface PanelProps {
  background?: string
  frequency?: number
  saturation?: number
  width?: 'full' | 'half'
  revealOnHover?: boolean
  children: ReactNode
}

function Panel({ background, frequency = 30, saturation, width = 'full', revealOnHover = false, children }: PanelProps) {
  // Separate captions from other content
  const captions: ReactNode[] = []
  const content: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (child && typeof child === 'object' && 'type' in child && child.type === Caption) {
      captions.push(child)
    } else {
      content.push(child)
    }
  })

  const hasBackground = !!background

  return (
    <PanelContainerHoverable $width={width} $revealOnHover={revealOnHover} $hasBackground={hasBackground}>
      {background && (
        <BackgroundLayer $background={background} $revealOnHover={revealOnHover}>
          <HalftoneBackground src={background} frequency={frequency} saturation={saturation} />
        </BackgroundLayer>
      )}
      {captions}
      <PanelContent $hasBackground={hasBackground}>
        {content}
      </PanelContent>
    </PanelContainerHoverable>
  )
}

export default Panel