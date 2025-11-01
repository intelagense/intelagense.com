import styled from "styled-components"

const Caption = styled.div<{ type: 'header' | 'footer' }>`
    font-family: 'Comic Neue', cursive; 
    color: black;
    text-transform: uppercase;
    font-weight: 700;
    font-size: ${props => (props.type === 'header' ? '1.2rem' : '0.8rem')};
    margin-bottom: ${props => (props.type === 'header' ? '0.5rem' : '0')};
`

export default Caption
