import styled from 'styled-components' 


const Balloon = styled.div<{ type: 'speech' | 'thought' | 'header' | 'footer' }>`
    font-family: 'Comic Neue', cursive; 
    color: black;
    text-transform: uppercase;
    font-weight: 700;
    // TODO: Add styling for different balloon types
`

export default Balloon