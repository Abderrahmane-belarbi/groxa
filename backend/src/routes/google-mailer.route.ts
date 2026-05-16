import { Router, Request, Response } from 'express';
import { google } from 'googleapis';

const router = Router();

router.get("/google", (_req: Request, res: Response) => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_GOOGLE_REDIRECT_URI
      : process.env.PUBLIC_GOOGLE_REDIRECT_URI
  );

  const scopes = ['https://www.googleapis.com/auth/gmail.send'];

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline', // ← this is what asks Google for a refresh_token
    scope: scopes,
    prompt: 'consent', // ← forces Google to return refresh_token every time
    // access_type: 'offline' < is the key part. It tells Google "I need to act on the user's behalf even when they're not here" — so give me a long-lived refresh token, not just a short-lived access token.
  });

  res.redirect(url); // send user to Google login
});

// Handle the redirect/callback
// GET /google/callback — exchanges the one-time code for tokens:
router.get("/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code;

  if (!code || typeof code !== 'string') return res.status(400).send("No code returned from Google");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.NODE_ENV === "development"
      ? process.env.LOCAL_GOOGLE_REDIRECT_URI
      : process.env.PUBLIC_GOOGLE_REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    // tokens contain access_token and refresh_token
    console.log("Tokens:", tokens);

    // Here you can save refresh_token to your DB or env variable
    res.send("Authorization successful! You can close this tab.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error exchanging code for tokens");
  }
});

export default router;