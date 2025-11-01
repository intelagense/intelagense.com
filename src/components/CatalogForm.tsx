import styled from 'styled-components'

const FormContainer = styled.div<{ $width?: 'full' | 'half' }>`
  position: relative;
  font-family: 'Comic Neue', cursive;
  color: black;
  padding: 5px;
  border-radius: 2px;
  text-transform: uppercase;
  font-size: 1rem;
  font-weight: 700;
  overflow: visible;
  flex: ${props => props.$width === 'half' ? '1 1 calc(50% - 5px)' : '1 1 100%'};
  
  /* Force single column on mobile */
  @media (max-width: 768px) {
    flex: 1 1 100%;
    min-width: 100%;
  }
`

const FormInner = styled.div`
  position: relative;
  padding: 15px;
  z-index: 2;
`

const CutLine = styled.div`
  position: absolute;
  border: 2px dashed black;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
  
  &::after {
    content: '✂';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    background: #eee;
    padding: 0 10px;
    z-index: 3;
  }
`

const FormFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  z-index: 2;
`

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  color: black;
`

const Input = styled.input`
  font-family: 'Comic Neue', cursive;
  font-size: 1rem;
  padding: 8px 5px;
  border: none;
  border-bottom: 2px solid black;
  background: transparent;
  outline: none;

  &:focus {
    border-bottom: 3px solid black;
  }
  
  &::placeholder {
    color: #999;
    text-transform: none;
    font-style: italic;
  }
`

const Textarea = styled.textarea`
  font-family: 'Comic Neue', cursive;
  font-size: 1rem;
  padding: 8px 5px;
  border: 2px solid black;
  background: transparent;
  outline: none;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    border: 3px solid black;
  }
  
  &::placeholder {
    color: #999;
    text-transform: none;
    font-style: italic;
  }
`

const SubmitButton = styled.input`
  font-family: 'Comic Neue', cursive;
  font-size: 1rem;
  font-weight: 700;
  padding: 12px 20px;
  background: white;
  border: 3px solid black;
  cursor: pointer;
  margin-top: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background: black;
    color: white;
  }
  
  &:active {
    transform: scale(0.98);
  }
`


interface CatalogFormProps {
  width?: 'full' | 'half'
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

function CatalogForm({ width = 'full', onSubmit }: CatalogFormProps) {
  return (
    <FormContainer $width={width}>
      <CutLine />
      <FormInner>
        <form method="post" data-netlify="true" onSubmit={onSubmit}>
          <input type="hidden" name="form-name" value="contact" />
          <FormFields>
            <FormField>
              <Label htmlFor="name">Your Name</Label>
              <Input type="text" name="name" id="name" required placeholder="Print clearly" />
            </FormField>
            <FormField>
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" name="email" id="email" required placeholder="your@email.com" />
            </FormField>
            <FormField>
              <Label htmlFor="message">Message</Label>
              <Textarea name="message" id="message" rows={4} required placeholder="Write your message here..."></Textarea>
            </FormField>
          </FormFields>
          <SubmitButton type="submit" value="Send Message" />
        </form>
      </FormInner>
    </FormContainer>
  )
}

export default CatalogForm

