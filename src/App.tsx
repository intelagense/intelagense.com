import Panel from './components/Panel'
import Caption from './components/Caption'
import styled from 'styled-components'

const PageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  max-width: 1200px;
  margin: 0 auto;
  border: 2px solid black;
  padding: 10px;
  background-color: #eee;
`

function App() {
  return (
    <PageContainer>
      <Panel background="/background.jpg" frequency={90} width="full">
        <Caption type="header"/>
        <p>In the muggy shadows of the Houston tech scene our hero writes code among the smell of concrete and burning trash.</p>
      </Panel>
      <Panel background="/bg.jpg" frequency={90} width="half">
        <Caption type="header"/>
        <p>In the muggy shadows of the Houston tech scene our hero writes code among the smell of concrete and burning trash.</p>
      </Panel>
      <Panel background="/background.jpg" frequency={90} width="half">
        <Caption type="header"/>
        <p>In the muggy shadows of the Houston tech scene our hero writes code among the smell of concrete and burning trash.</p>
      </Panel>
    </PageContainer>
  )
}

export default App
