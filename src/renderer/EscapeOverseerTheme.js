import { createMuiTheme } from '@material-ui/core/styles';

export const EOTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#263238',
      contrastText: '#29b6f6',
    },
    secondary: {
      main:'#29b6f6',
      contrastText: '#263238',
    },
    text: {
      primary: '#263238',
      secondary: '#29b6f6',
    },
  },
});

export const EODarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#263238',
      contrastText: '#29b6f6',
    },
    secondary: {
      main:'#29b6f6',
      contrastText: '#263238',
    },
    text: {
      primary: '#29b6f6',
      secondary: '#263238',
    },
    action: {
      active:'#29b6f6'},
  },
  
});