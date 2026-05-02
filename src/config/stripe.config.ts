import Stripe from "stripe";
import { envVars } from "./env";

const stripe = new Stripe(envVars.STRIPE.STRIPE_SECRET_KEY);
export default stripe;
