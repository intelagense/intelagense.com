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
  background-color: #faf6ee;
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

const ThoughtBubbleLink = styled.a<{ $hoverColor?: string; $hoverTextColor?: string }>`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 12px 50px;
  background: white;
  border: 2px solid black;
  border-radius: 25px;
  text-decoration: none;
  color: black;
  font-family: 'Comic Neue', cursive;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.1rem;
  transition: background 0.2s ease, color 0.2s ease;

  i {
    font-size: 1.8rem;
  }

  /* Thought bubble dots trailing away - left side default */
  &::before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background: white;
    border: 2px solid black;
    border-radius: 50%;
    bottom: -12px;
    left: 15px;
  }

  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 6px;
    background: white;
    border: 2px solid black;
    border-radius: 50%;
    bottom: -20px;
    left: 25px;
  }

  &:hover {
    background: ${props => props.$hoverColor || 'black'};
    color: ${props => props.$hoverTextColor || 'white'};
  }

  &:hover .icon-default { opacity: 0; }
  &:hover .icon-hover { opacity: 1 !important; }


`


const SocialList = styled.ul`
  list-style: none;
  padding: 0 0 40px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  li {
    margin: 0;
    
    /* Stagger alternating items */
    &:nth-child(odd) {
      align-self: flex-start;
      margin-left: 6rem;
    }
    
    &:nth-child(even) {
      align-self: flex-end;
      margin-right: 6rem;
    }
    
    /* Add class to right-aligned items for flipped bubbles */
    &:nth-child(even) a {
      &::before {
        left: auto;
        right: 15px;
      }
      
      &::after {
        left: auto;
        right: 25px;
      }
    }
  }
`

function App() {
  return (
    <PageContainer>
      <Panel background="bg.jpg" frequency={90} width="full">
        <TitleText place="left">Eric Wynn Romere as</TitleText>
        <TitleImage src="/intelagensetitle.png" alt="logo" />
        <TitleText place="right">The Software Engineer</TitleText>
      </Panel>
      <Panel background="/zoomflip.png" frequency={90} saturation={2} width="full">
        <Caption type="header">This is our hero... I suppose.</Caption>
        <Caption type="footer">A Software engineer & community manager based in Houston, Texas.</Caption>
      </Panel>
      <Panel width="half">
        <p>Constantly in motion, working on web apps, robots, games, IoT systems or whatever seems fun or useful to create.</p>
        <p>Active in Houston’s tech scene, always helping organize meetups and keep new projects moving. Code and Coffee, Side Project Society... wherever builders gather they’re probably close by making sure things work.</p>
        <p>Fights for caffeine, Taco Bell, and thrift shop finds that somehow turn into new projects.</p>
      </Panel>
      <Panel background="/vampire.webp" frequency={90} saturation={2} width="half">
        <Caption type="footer" backgroundColor="#6b8cae" color="white">
        But alas, without Spotify, the hero starts to fade.
        </Caption>
      </Panel>
      <Panel width="full" backgroundColor="#e8c840">
        <h2>Projects, projects, projects... </h2>
      </Panel>
      <Panel background="/together.png" frequency={90} saturation={2} width="half" revealOnHover={true}>
        <Caption type="header" backgroundColor="#c45040" color="white">Together Calendar</Caption>
        <Caption type="footer" backgroundColor="#c45040" color="white">A web app for creating and sharing collaborative community events.</Caption>
      </Panel>
      <Panel background="/cortext.png" frequency={90} saturation={2} width="half" revealOnHover={true}>
        <Caption type="header" backgroundColor="#5a8a5a" color="white">Cortext</Caption>
        <Caption type="footer" backgroundColor="#5a8a5a" color="white">A retro-futurist dystopian point-and-click adventure.</Caption>
      </Panel>
      <Panel width="full" backgroundColor="#e8c840">
        <h2>How to call our hero?</h2>
      </Panel>
      <Panel width="half" background="/solid-blue.png" frequency={90} saturation={2}>
        <Caption type="header" backgroundColor="#6b8cae" color="white">Let's get social</Caption>
        <SocialList>
            <li>
                <ThoughtBubbleLink href="https://github.com/intelagense/" $hoverColor="#333">
                    <i className="devicon-github-original"></i> GitHub
                </ThoughtBubbleLink>
            </li>
            <li>
                <ThoughtBubbleLink href="https://twitter.com/intelagense" $hoverColor="#000">
                    <i className="devicon-twitter-original" style={{ fontSize: '1.4rem' }}></i> X
                </ThoughtBubbleLink>
            </li>
            <li>
                <ThoughtBubbleLink href="https://www.codedex.io/@intelagense" $hoverColor="#ffe400" $hoverTextColor="black">
                    <span style={{ position: 'relative', width: '24px', height: '24px', flexShrink: 0 }}>
                      <img src="/codedex-vector-logo.svg" alt="" className="icon-default" style={{ width: '26px', height: '26px', position: 'absolute', top: 0, left: 0 }} />
                      <img src="/codedex-bot-val.gif" alt="" className="icon-hover" style={{ width: '34px', height: '34px', position: 'absolute', top: -4, left: -4, opacity: 0 }} />
                    </span>
                    Codédex
                </ThoughtBubbleLink>
            </li>
            <li>
                <ThoughtBubbleLink href="https://www.linkedin.com/in/eric-wynn-romere/" $hoverColor="#0A66C2">
                    <i className="devicon-linkedin-plain"></i> LinkedIn
                </ThoughtBubbleLink>
            </li>
        </SocialList>
      </Panel>
      <CatalogForm width="half" />
    </PageContainer>
  )
}

export default App
