import styled from 'styled-components'
import { ModeSelection } from './ModeSelection'
import SerialSettings from './SerialSettings';

const Sidebar = styled.aside`
  grid-area: sidebar;
  background: #34495e;
  color: white;
  padding: 1rem;
  min-width: 200px;
  resize: horizontal;
  overflow: auto;
`;

const Main = styled.main`
  grid-area: main;
  padding: 1rem;
  overflow: auto;
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Sidebar>
        <ModeSelection />
        <SerialSettings />
      </Sidebar>
      <Main>{children}</Main>
    </>
  );
};