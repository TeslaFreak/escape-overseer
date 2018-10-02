import React, { Component } from 'react';
import Sidebar from 'grommet/components/Sidebar';
import Split from 'grommet/components/Split';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Footer from 'grommet/components/Footer';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Button from 'grommet/components/Button';
import Article from 'grommet/components/Article';
import Value from 'grommet/components/Value';
import User from 'grommet/components/icons/base/User';
import MenuIcon from 'grommet/components/icons/base/Menu';
import SettingsOptionIcon from 'grommet/components/icons/base/SettingsOption';
import TreeIcon from 'grommet/components/icons/base/Tree';
import LineChartIcon from 'grommet/components/icons/base/LineChart';
import RunIcon from 'grommet/components/icons/base/Run';

class MainOverlay extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Split flex='right'>
        <Sidebar colorIndex='neutral-1'
          size='small'>
          <Header pad='small'
            justify='between'>
            <Title >
              <Value icon={<MenuIcon />}
                  value='Overseer'>
                </Value>
            </Title>
          </Header>
          <Box flex='grow'
            justify='start'>
            <Menu primary={true}>
              <Anchor href='#'
                icon={<RunIcon />}
                label='Control Screen'
                className='active'>
              </Anchor>
              <Anchor href='#'
                icon={<TreeIcon />}
                label='Configure Events'>
              </Anchor>
              <Anchor href='#'
                icon={<LineChartIcon />}
                label='Report Analytics'>
              </Anchor>
              <Anchor href='#'
                icon={<SettingsOptionIcon />}
                label='Settings'>
              </Anchor>
            </Menu>
          </Box>
          <Footer pad='small'>
            <Button icon={<User />} />
          </Footer>
        </Sidebar>
        <Article>
            {this.props.children} 
        </Article>
      </Split>
    );
  }
}

export default MainOverlay;
