"use client";

import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  CssBaseline,
} from "@mui/material";
import Head from "next/head";
import { styled } from "@mui/system";
import { PlayArrow } from "@mui/icons-material";


const GradientButton = styled(Button)({
  background: "linear-gradient(45deg, #ab47bc 30%, #8e24aa 90%)",
  borderRadius: 30,
  color: "white",
  padding: "10px 30px",
  boxShadow: "0 3px 5px 2px rgba(142, 36, 170, .3)",
  "&:hover": {
    background: "linear-gradient(45deg, #8e24aa 30%, #ab47bc 90%)",
  },
});

export default function Home() {
  const handleSubmit = async (amount) => {
    try {
      const checkoutSession = await fetch("/api/checkout_session", {
        method: "POST",
        headers: {
          origin: "http://localhost:3000",
        },
        body: JSON.stringify({ amount })
      });

      const checkoutSessionJson = await checkoutSession.json();

      if (checkoutSession.statusCode === 500) {
        console.error(checkoutSessionJson.message);
        return;
      }

      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({
        sessionId: checkoutSessionJson.id,
      });

      if (error) {
        console.warn(error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from your text" />
      </Head>

      <AppBar position="fixed" sx={{ background: "linear-gradient(45deg, #7b1fa2 30%, #6a1b9a 90%)" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard SaaS
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">
              Login
            </Button>
            <Button color="inherit" href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          textAlign: "center",
          mt: 10,
          pt: 10,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Flashcard SaaS
        </Typography>
        <Typography variant="h5" gutterBottom>
          The easiest way to make flashcards from your text
        </Typography>
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <GradientButton
              variant="contained"
              sx={{ mt: 2, minWidth: 200 }} // Adjust the minWidth as needed
              startIcon={<PlayArrow />}
              href="/generate"
            >
              GET STARTED
            </GradientButton>
          </Grid>
          <Grid item xs={12} md={6} lg={3} sx={{ display: 'flex', justifyContent: 'center' }}>
            <GradientButton
              variant="contained"
              sx={{ mt: 2, minWidth: 200 }} // Adjust the minWidth as needed
              startIcon={<PlayArrow />}
              href="/flashcards"
            >
              Collections
            </GradientButton>
          </Grid>
        </Grid>

        
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Easy Text Input
                </Typography>
                <Typography>
                  Simply input your text and let our software do the rest.
                  Creating flashcards has never been easier.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Smart Flashcards
                </Typography>
                <Typography>
                  Our AI intelligently breaks down your text into concise
                  flashcards, perfect for studying.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Accessible Anywhere
                </Typography>
                <Typography>
                  Access your flashcards from any device, at any time. Study on
                  the go with ease.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Basic
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $5 / month
                </Typography>
                <Typography>
                  Access to basic flashcard features and limited storage.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <GradientButton variant="contained" sx={{ mt: 2 }} startIcon={<PlayArrow />} onClick={() => handleSubmit(5)}>
                  Choose Basic
                </GradientButton>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                p: 3,
                textAlign: "center",
                borderRadius: 4,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Pro
                </Typography>
                <Typography variant="h6" gutterBottom>
                  $10 / month
                </Typography>
                <Typography>
                  Unlimited flashcards and storage, with priority support.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "center" }}>
                <GradientButton
                  variant="contained"
                  sx={{ mt: 2 }}
                  startIcon={<PlayArrow />}
                  onClick={() => handleSubmit(10)}
                >
                  Choose Pro
                </GradientButton>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
