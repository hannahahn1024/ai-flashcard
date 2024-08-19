"use client";

import { useUser } from "@clerk/nextjs";
import { db } from "@/firebase";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Slider,
} from "@mui/material";
import {
  collection,
  doc,
  getDoc,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [numFlashcards, setNumFlashcards] = useState(5); // Default number of flashcards to generate
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    fetch("api/generate", {
      method: "POST",
      body: JSON.stringify({ text, numFlashcards }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFlashcards(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        alert("Flashcard collection with the same name already exists.");
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });

    await batch.commit();
    handleClose();
    router.push("/flashcards");
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ color: "#7b1fa2" }}>
          Generate Flashcards
        </Typography>
        <Paper
          sx={{
            p: 4,
            width: "100%",
            backgroundColor: "#f3e5f5", // Light purple background
            boxShadow: "0px 4px 12px rgba(123, 31, 162, 0.2)", // Purple shadow
          }}
        >
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ab47bc", // Purple border
                },
                "&:hover fieldset": {
                  borderColor: "#8e24aa", // Darker purple border on hover
                },
              },
              "& .MuiInputLabel-root": {
                color: "#7b1fa2", // Purple label
              },
            }}
          />
          <Typography gutterBottom sx={{ color: "#7b1fa2" }}>
            Number of Flashcards: {numFlashcards}
          </Typography>
          <Slider
            value={numFlashcards}
            onChange={(e, newValue) => setNumFlashcards(newValue)}
            min={1}
            max={20}
            step={1}
            sx={{
              mb: 2,
              color: "#7b1fa2", // Purple slider
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#7b1fa2", // Purple background
              color: "white",
              "&:hover": {
                backgroundColor: "#6a1b9a", // Darker purple on hover
              },
            }}
            onClick={handleSubmit}
            fullWidth
          >
            Submit
          </Button>
        </Paper>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress sx={{ color: "#7b1fa2" }} />
        </Box>
      )}

      {!loading && flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ color: "#7b1fa2" }}>
            Flashcards Preview
          </Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    backgroundColor: "#f3e5f5", // Light purple background
                    boxShadow: "0px 4px 12px rgba(123, 31, 162, 0.2)", // Purple shadow
                  }}
                >
                  <CardActionArea
                    onClick={() => {
                      handleCardClick(index);
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          perspective: "1000px",
                          "& > div": {
                            transition: "transform 0.6s",
                            transformStyle: "preserve-3d",
                            position: "relative",
                            width: "100%",
                            height: "200px",
                            boxShadow: "0 4px 8px 0 rgba(0,0,0, 0.2)",
                            transform: flipped[index]
                              ? "rotateY(180deg)"
                              : "rotateY(0deg)",
                          },
                          "& > div > div": {
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            backfaceVisibility: "hidden",
                            display: "flex",
                            flexDirection: "column", // Align content vertically
                            justifyContent: "flex-start", // Start content at the top
                            alignItems: "center",
                            padding: 2,
                            boxSizing: "border-box",
                            overflowY: "auto", // Enable vertical scrolling
                          },
                          "& > div > div:nth-of-type(2)": {
                            transform: "rotateY(180deg)",
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{ color: "#7b1fa2", textAlign: "center" }} // Purple text
                            >
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="h5"
                              component="div"
                              sx={{ color: "#7b1fa2", textAlign: "center" }} // Purple text
                            >
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#7b1fa2", // Purple background
                color: "white",
                "&:hover": {
                  backgroundColor: "#6a1b9a", // Darker purple on hover
                },
              }}
              onClick={handleOpen}
            >
              Save
            </Button>
          </Box>
        </Box>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{ color: "#7b1fa2" }}>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#7b1fa2" }}>
            Please enter a name for your flashcards collection
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Collection Name"
            type="text"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#ab47bc", // Purple border
                },
                "&:hover fieldset": {
                  borderColor: "#8e24aa", // Darker purple border on hover
                },
              },
              "& .MuiInputLabel-root": {
                color: "#7b1fa2", // Purple label
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              color: "#7b1fa2",
              "&:hover": {
                backgroundColor: "#f3e5f5", // Light purple hover background
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={saveFlashcards}
            sx={{
              color: "#7b1fa2",
              "&:hover": {
                backgroundColor: "#f3e5f5", // Light purple hover background
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
