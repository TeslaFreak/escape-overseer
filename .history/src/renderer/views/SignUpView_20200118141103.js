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
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
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
            <Link color="inherit">
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
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
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
    const [loading, setLoading] = useState(false);
    const [newUserCreated, setNewUserCreated] = useState(false);


    let db = PouchDataManager.localDB;


    const handleSignUpAttempt = async (e) => {
        console.log('handleSignUpAttempt');
        console.log('network status: online')
        console.log('email variable:' + email);

        setLoading(true);
        e.preventDefault();
        if (navigator.onLine) {

            const separator = "\n"
            const validationResult = validate({ emailAddress: email, password: password, confPassword: confPassword }, constraints);
            // validationResult is undefined if there are no errors
            if (validationResult) {
                if (validationResult['emailAddress']) {
                    setError(validationResult['emailAddress'][0]);
                }
                else if (validationResult['password']) {
                    setError(validationResult['password'][0]);
                }
                else if (validationResult['confPassword']) {
                    setError(validationResult['confPassword'][0]);
                }
            }
            else if(password != confPassword) {
                setError('Password confirmation does not match');
            }
            else {
                setError('');
                let response = await fetch('https://21731c69.us-south.apigw.appdomain.cloud/escapeoverseerAPI/syncNewUserInfo?email=' + email + '&password=' + password, {
                    method: 'POST',
                    headers: new Headers( {'Content-Type': 'application/json'})
                });

                let data = await response.json()
                if (data.errors && data.errors.status == '200') {
                    setError(data.errors.message)
                    console.log(data);
                }
                else if (data.errors && data.errors.status != '200') {
                    setError("An internal server error has occured. Please contact Escape Overseer if you continue to experience this problem")
                    console.log(data);
                }
                else {
                    //User successfully created, show them a success message and button to redirect to login
                    setNewUserCreated(true);
                }
            }
        }
        else {
            console.log('network status: offline')
            setError('An online connection is required to create your account at this time. Please connect to the internet and try again')
        }
        setLoading(false);
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
                {!newUserCreated &&
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
                        disabled={loading}
                        className={classes.submit}
                        onClick={handleSignUpAttempt}
                    >
                        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>}
                {newUserCreated &&
                    <Container component="main" maxWidth="xs">
                        <Avatar className={classes.avatar}>
                            <CheckIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Success! Your account has been created!
                        </Typography>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                            href="/login"
                        >
                            Continue To Login
                        </Button>
                    </Container>
                }
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}