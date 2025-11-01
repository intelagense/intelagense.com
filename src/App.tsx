import Panel from './components/Panel'
import Caption from './components/Caption'
import CatalogForm from './components/CatalogForm'
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
  font-size: 1.65rem;
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
        <Caption type="header">This is our hero... I suppose.</Caption>
        <Caption type="footer">A Software engineer & community manager based in Houston, Texas.</Caption>
      </Panel>
      {/* <Panel background="/wobble.png" frequency={90} saturation={1} width="half" revealOnHover={true}>
        <Caption type="header">A Software engineer & community manager based in Houston, Texas.</Caption>
        <Caption type="footer">Constantly in motion, working on web apps, robots, games, IoT systems or whatever seems fun or useful to create.
        </Caption>
      </Panel> */}
      <Panel width="half">
        <p>Active in Houston’s tech scene, always helping organize meetups and keep new projects moving. Code and Coffee, Side Project Society... wherever builders gather they’re probably close by making sure things work.</p>
        <p>Fights for caffeine, Taco Bell, and thrift shop finds that somehow turn into projects. But without Spotify the hero starts to fade.</p>
        <p>But alas, without Spotify, the hero starts to fade.</p>
      </Panel>
      <Panel background="/bgcave.jpg" frequency={90} saturation={2} width="full">
        <Caption type="footer">
          <h2>Projects, projects, projects... </h2>
        </Caption>
      </Panel>
      <Panel background="/together.png" frequency={90} saturation={2} width="half" revealOnHover={true}>
        <Caption type="header">Together Calendar</Caption>
        <Caption type="footer">A web app for creating and sharing collaborative community events.</Caption>
      </Panel>
      <Panel background="/cortext.png" frequency={90} saturation={2} width="half" revealOnHover={true}>
        <Caption type="header">Cortext</Caption>
        <Caption type="footer">A retro-futurist dystopian point-and-click adventure.</Caption>
      </Panel>
      <Panel width="full">
        <h2>How to call?</h2>
      </Panel>
      <Panel width="half">
        <h3>Let's get social</h3>
      </Panel>
      <CatalogForm width="half" />
    </PageContainer>
  )
}

export default App
