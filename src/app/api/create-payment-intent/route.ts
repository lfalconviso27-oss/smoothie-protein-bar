import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const { amount, metadata } = await request.json();

    if (!amount || typeof amount !== "number" || amount < 50) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // already in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        store: "Smoothie Protein Bar",
        address: "5985 NW 102nd Ave, Doral, FL 33178",
        ...metadata,
      },
    });

    return Response.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return Response.json({ error: message }, { status: 500 });
  }
}
