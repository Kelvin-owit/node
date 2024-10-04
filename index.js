import express from "express";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 4000;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

// middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// routes 

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/blog", async (req, res) => {
  try {
    const postsSnapshot = await getDocs(collection(db, "posts"));
    const posts = [];
    postsSnapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        title: doc.data().title,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl,
      });
    });
    res.render("blog.ejs", { posts });
  } catch (error) {
    res.status(500).send("Error fetching posts");
  }
});

app.get("/submit-post", (req, res) => {
  res.render("submit-post.ejs");
});

app.post("/submit-post", upload.single("image"), async (req, res) => {
  const { title, content } = req.body;
  const file = req.file;

  try {
    const storageRef = ref(storage, `images/${file.originalname}`);
    await uploadBytes(storageRef, file.buffer, {contentType:imageUrl.mimetype});
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, "posts"), { title, content, imageUrl });
    res.redirect("/blog");
  } catch (error) {
    res.status(500).send("Error submitting post: " + error.message);
  }
});

// Update a post
app.put("/post/:id", async (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;

  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, { title, content });
    res.send("Post updated successfully");
  } catch (error) {
    res.status(500).send("Error updating post: " + error.message);
  }
});

// Partially update a post
app.patch("/post/:id", async (req, res) => {
  const postId = req.params.id;
  const updates = req.body;

  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, updates);
    res.send("Post partially updated successfully");
  } catch (error) {
    res.status(500).send("Error partially updating post: " + error.message);
  }
});

// Delete a post
app.delete("/post/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const postRef = doc(db, "posts", postId);
    await deleteDoc(postRef);
    res.send("Post deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting post: " + error.message);
  }
});

app.listen(port, () => {
  console.log("server running on " + port);
});