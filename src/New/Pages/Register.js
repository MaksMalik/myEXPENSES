import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import {Link, useNavigate} from "react-router-dom"
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useState} from "react";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {authentication} from "../../Firebase/firebase";
import ResponsiveAppBarBeforeLogin from "../ResponsiveAppBarBeforeLogin";

const theme = createTheme();

const Register = () => {

  const [registerEmail, setRegisterEmail] = useState()
  const [registerPassword, setRegisterPassword] = useState()
  const [failedRegister, setFailedRegister] = useState(false)
  const [succeededRegister, setSucceededRegister] = useState(false)

  let navigate = useNavigate()

  const handleSubmitRegister = (event) => {
    event.preventDefault();
    try {
      createUserWithEmailAndPassword (
        authentication,
        registerEmail,
        registerPassword)
      .then(() =>{
        setFailedRegister(false)
        setSucceededRegister(true)
        setTimeout(()=> {
          navigate("/login")
        }, 3000)
        }
      ).catch(() => {
        setFailedRegister(true)
        setSucceededRegister(false)
      })
    }catch (error) {
      setFailedRegister(true)
      setSucceededRegister(false)
    }
  };

  return (
    <>
      <ResponsiveAppBarBeforeLogin/>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" onSubmit={handleSubmitRegister} noValidate sx={{ mt: 1 }}>
              <TextField
                onChange={(event) => setRegisterEmail(event.target.value)}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                onChange={(event) => setRegisterPassword(event.target.value)}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              {failedRegister && (<div style={{color: 'red'}}>Wrong e-mail or password</div>)}
              {succeededRegister && (<div style={{color: 'green'}}>Successfully registered. Redirecting to login page.</div>)}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 1 }}
              >
                Sign up
              </Button>
              <Grid container>
                <Grid item xs>
                </Grid>
                <Grid item>
                  <Link to='/login'>
                    {"Already have and account"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </>
  );
}

export default Register