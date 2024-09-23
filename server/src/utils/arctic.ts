import { Google } from "arctic";

const clientId = process.env.GOOGLE_CLIENT_ID as string;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET as string;
const redirectUri = process.env.GOOGLE_REDIRECT_URI as string;

export const google = new Google(clientId, clientSecret, redirectUri);
