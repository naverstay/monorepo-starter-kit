import Stripe from "stripe";

/* STRIPE RELEVANT EVENTS. NOTE: YOU CAN ADD MORE EVENTS HERE */
//REMEMBER CHECK THE EVENTS IN YOUR STRIPE/WEBHOOK/EVENTS TO LISTEN EVENTS IN PRODUCTION

// SUBSCRIPTIONS
export const stripeSubscriptionEvents: Stripe.Event.Type[] = [
  "customer.subscription.created",
  /* 
  The subscription was created → Create Record (If first-time login or new user)
  */
  "customer.subscription.updated",
  /* 
  The subscription was upgraded/downgraded → Provisional Access and Update Record
  */
  "customer.subscription.deleted",
  /* 
  The subscription was canceled → Set to "free"
  */
  "invoice.payment_failed",
  /* 
  The user's payment failed → Revoke access and Send email (optional) to prompt for payment/update method
  Sent when there’s an issue with the customer’s payment method each billing interval.
  */
  "invoice.payment_succeeded",
  /* 
  The user's payment was made → Provisional access
  Sent when a payment succeeds each billing interval.
  */
  "invoice.paid",
  /* 
    Triggered when an invoice is marked as paid.
    Action: Use this to finalize the customer's access or other features. This can be an alternative or complement to invoice.payment_succeeded.
  */
  "checkout.session.completed",
  /* 
  The user paid successfully and the subscription was created → Provisional Access
  Sent when a customer clicks the Pay or Subscribe button in Checkout, confirming a new purchase.
  */
  "invoice.upcoming",
  /* 
  Triggered when an upcoming invoice is generated (before the payment is attempted).
  Action: You can use this event to send a reminder to the user that their next payment is coming up. This is a good time to alert users about upcoming charges.
 */
];

export const earlyFraudEvents: Stripe.Event.Type[] = ["radar.early_fraud_warning.created"];
