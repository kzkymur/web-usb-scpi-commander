import styled from 'styled-components'
import { Layout } from './components/Layout'

export const Container = styled.div`
  display: grid;
  grid-template:
    'header header' auto
    'sidebar main' 1fr
    'footer footer' auto / [sidebar-start] auto [sidebar-end main-start] 1fr [main-end];
  grid-template-columns: auto 1fr;
  resize: horizontal;
  overflow: auto;
  height: 100vh;
  width: 100vw;
`;

export const Header = styled.header`
  grid-area: header;
  background: #2c3e50;
  color: white;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

function App() {
  return (
    <Container id="main-container">
      <Header>
        <Title>USB-SCPI Commander</Title>
      </Header>

      <Layout>
        <></>
      </Layout>

    </Container>
  )
}

export default App
