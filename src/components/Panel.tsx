import styled from 'styled-components'
import type { ReactNode } from 'react'
import HalftoneBackground from './HalftoneBackground'

const PanelContainer = styled.div<{ $width?: 'full' | 'half' }>`
  position: relative;
  font-family: 'Comic Neue', cursive;
  color: black;
  padding: 5px;
  border-radius: 2px;
  border: 2px solid black;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 700;
  min-height: 300px;
  overflow: hidden;
  flex: ${props => props.$width === 'half' ? '1 1 calc(50% - 5px)' : '1 1 100%'};
`;

const PanelContent = styled.div`
  position: relative;
  z-index: 1;
  pointer-events: none;
`;

const BackgroundLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
`;

interface PanelProps {
  background?: string
  frequency?: number
  width?: 'full' | 'half'
  children: ReactNode
}

function Panel({ background, frequency = 30, width = 'full', children }: PanelProps) {
  return (
    <PanelContainer $width={width}>
      {background && (
        <BackgroundLayer>
          <HalftoneBackground src={background} frequency={frequency} />
        </BackgroundLayer>
      )}
      <PanelContent>
        {children}
      </PanelContent>
    </PanelContainer>
  )
}

export default Panel