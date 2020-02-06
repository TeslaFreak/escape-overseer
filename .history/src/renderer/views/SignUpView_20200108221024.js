import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { validate } from 'validate.js';
import PouchDataManager from '../PouchDataManager';
const electron = window.require('electron')

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Escape Overseer
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    error: {
        color: '#cc0033',
        display: 'inline-block',
        fontSize: '12px',
        lineHeight: '15px',
        minHeight: '15px',
        margin: '5px 0 0',
    },
}));

const constraints = {
    emailAddress: {
        presence: {
            allowEmpty: false,
            message: "^Please enter an email address"
        },
        email: {
            message: "^Please enter a valid email address"
        }
    },
    password: {
        presence: {
            allowEmpty: false,
            message: "^Please enter a password"
        },
    },
    confPassword: {
        presence: {
            allowEmpty: false,
            message: "^Please confirm your password"
        },
    }
};


export default function SignUp() {
    const classes = useStyles();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [error, setError] = useState('none');

    let db = PouchDataManager.localDB;


    const handleSignUpAttempt = (e) => {
        console.log('handleSignUpAttempt');
        console.log('network status: online')
        console.log('email variable:' + email);

        e.preventDefault();
        if (navigator.onLine) {

            const separator = "\n"
            const validationResult = validate({ emailAddress: email, password: password, confPassword: confPassword }, constraints);
            // validationResult is undefined if there are no errors
            if (validationResult) {
                if (validationResult['emailAddress']) {
                    setError(validationResult['emailAddress'][0]);
                }
                if (validationResult['password']) {
                    setError(validationResult['password'][0]);
                }
                if (validationResult['confPassword']) {
                    setError(validationResult['confPassword'][0]);
                }
            }
            else {
                setError('');

                fetch('https://21731c69.us-south.apigw.appdomain.cloud/escapeoverseerAPI/createEOProfile', {
                    method: 'POST',
                    headers: new Headers(),
                    body: JSON.stringify({ email: email, password: password })
                }).then((res) => res.json())
                    .then((data) => console.log(data))
                    .catch((err) => console.log(err))
            }
        }
        else {
            console.log('network status: offline')
            setError('An online connection is required to create your account at this time. Please connect to the internet and try again')
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
        </Typography>
                <form className={classes.form} noValidate>
                    <Typography className={classes.error} style={{ visibility: error == 'none' ? 'hidden' : '' }}>
                        {error}
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirm-password"
                        label="Confirm Password"
                        type="password"
                        id="confirm-password"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                    />
                    {"Make sure the email you use here matches the email you created your subscription with. Your account will not link to your subscription if these do not match"}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
          </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
              </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}