import Panel from './components/Panel'
import Caption from './components/Caption'
import styled from 'styled-components'

const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 100ch;
  margin: 0 auto;
  border: 2px solid black;
  padding: 10px;
  background-color: #eee;
`

const TitleImage = styled.img`
  max-width: 80%;
  height: auto;
  display: block;
  margin: 0 auto;
`

const TitleText = styled.div<{ place: 'left' | 'right' }>`
  text-align: ${props => props.place === 'left' ? 'left' : 'right'};
  font-family: 'Comic Neue', cursive;
  text-transform: uppercase;
  font-weight: 700;
  padding: 0 2em ;
  font-size: 1.5rem;
`

function App() {
  return (
    <PageContainer>
      <Panel background="/bgfield.png" frequency={90} width="full">
        <TitleText place="left">Eric Wynn Romere</TitleText>
        <TitleImage src="/intelagensetitle.png" alt="logo" />
        <TitleText place="right">Software Engineer</TitleText>
      </Panel>
      <Panel background="/zoomflip.png" frequency={90} saturation={2} width="half">
        <Caption type="footer">Our hero I guess?</Caption>
      </Panel>
      <Panel background="/background.jpg" frequency={90} saturation={1} width="half">
        <Caption type="header">In the muggy shadows of the Houston tech scene our hero writes code among the smell of concrete and burning trash.</Caption>
        <Caption type="footer">INTELAGENSE</Caption>
      </Panel>
    </PageContainer>
  )
}

export default App
