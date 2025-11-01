import styled from 'styled-components'
import Caption from './Caption'
import HalftoneBackground from './HalftoneBackground'

const PanelContainer = styled.div`
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

function Panel() {
  return (
    <PanelContainer>
      <BackgroundLayer>
        <HalftoneBackground src="/background.jpg" frequency={30} />
      </BackgroundLayer>
      <PanelContent>
        <Caption type="header"/>
        <p>In the muggy shadows of the Houston tech scene our hero writes code among the smell of concrete and burning trash.</p>
      </PanelContent>
    </PanelContainer>
  )
}

export default Panel