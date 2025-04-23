import styled from 'styled-components'
import { SettingsPanel } from './SettingsPanel'
import { useGeneralStatus } from '../store/general';
import KeypressSettings from './KeypressSettings';
import ScheduleSetting from './ScheduleSettings';

const Sidebar = styled.aside`
  grid-area: sidebar;
  background: #34495e;
  color: white;
  padding: 1rem;
  min-width: 200px;
  resize: horizontal;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Main = styled.main`
  grid-area: main;
  padding: 1rem;
  overflow: auto;
`;

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { mode } = useGeneralStatus();

  const renderModeContent = () => {
    switch (mode) {
      case 'keypress':
        return <KeypressSettings />;
      case 'schedule':
        return <ScheduleSetting />;
      default:
        return <div>Select a mode from the sidebar</div>;
    }
  };

  return (
    <>
      <Sidebar>
        <SettingsPanel />
      </Sidebar>
      <Main>
        {renderModeContent()}
        {children}
      </Main>
    </>
  );
};