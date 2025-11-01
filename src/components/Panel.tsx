import styled from 'styled-components'
import Caption from './Caption'

const PanelContainer = styled.div`
  font-family: 'Comic Neue', cursive;
  color: black;
  // letter-spacing: 1.1px; // keeping this in case i forget it later
  padding: 5px;
  // background-color: #f0f0f0;
  border-radius: 2px;
  border: 2px solid black;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 700;

  background-image: radial-gradient(
    circle at center,
    black 0.25rem,
    transparent 0
  );
  background-size: 1rem 1rem;
  background-repeat: round;

`;

function Panel() {
  return (
    <PanelContainer>
      <Caption type="header"/>
      <p>In the muggy shadows of the Houston tech scene our hero writes code among the smell of concrete and burning trash.</p>
    </PanelContainer>
  )
}

export default Panel