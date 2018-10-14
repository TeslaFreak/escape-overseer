import { createMuiTheme } from '@material-ui/core/styles';

export const EOTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#263238',
    },
    secondary: {
      main:'#29b6f6',
    },
    good: {
      main: '#7cb342'
    },
    bad: {
      main: '#e53935'
    }

  },
  status: {
    error: 'red',
    good: 'green',
    danger: 'orange',
  },
});

export const EODarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#263238',
    },
    secondary: {
      main:'#29b6f6',
    }
  },
  status: {
    error: 'red',
    good: 'green',
    danger: 'orange',
  },
});