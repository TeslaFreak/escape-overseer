import { createMuiTheme } from '@material-ui/core/styles';

const darkBlue = '#263238';
const babyBlue = '#29b6f6';
const babyBlue_1HueDarker = '#0086c3';
const blueGrey = '#546e7a';

export const EOTheme = createMuiTheme({
  palette: {
    primary: {
      main: darkBlue,
      contrastText: babyBlue,
    },
    secondary: {
      main: babyBlue,
      contrastText: darkBlue,
    },
    text: {
      primary: darkBlue,
      secondary: babyBlue,
    },
  },
  typography: {
    h1: {
      fontSize: '5.25rem',
    },
  },
});

export const EODarkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: darkBlue,
      contrastText: babyBlue,
    },
    secondary: {
      main: babyBlue_1HueDarker,
      contrastText: darkBlue,
    },
    text: {
      primary: babyBlue,
      secondary: darkBlue,
    },
    action: {
      active: babyBlue_1HueDarker},
  },
  typography: {
    h1: {
      fontSize: '5.25rem',
    }
  },
});