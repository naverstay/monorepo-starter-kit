/* LIBRARIES */
import { Stripe } from "stripe";
import { stripeSubscriptionEvents } from "./events";
import { stripe } from "./stripe";
import { findFreePlan, findPlanByStripeId } from "./plans";
import { getUserInformationByCustomerId, updateSubscriptionInformationByUserId } from "db";

//SUBSCRIPTION
const subscriptionActions = async ({ event }: { event: Stripe.Event }) => {
  console.log(`🟢 Event type: ${event.type} | SUBSCRIPTION`);
  const eventObject = event.data.object;

  //CREATE SUBSCRIPTION
  if (event.type === "customer.subscription.created") {
    const subscription = eventObject as Stripe.Subscription;
    const user = await getUserInformationByCustomerId(subscription.customer as string);

    await updateSubscriptionInformationByUserId(user!.id, {
      subscriptionId: subscription.id,
    });
  }

  if (event.type === "customer.subscription.updated") {
    /* 
        - ACTION
          - UPDATE THE CURRENT SUBCRIPTION PLAN (Upgrade & downgrade) 
        
        - What did it happen to trigger this event?
          - Push and assign the new plan to the current subcription

        - MEANWHILE LOGSH.CO
          - Find the selected plan by the user by price Id
          - Update the current subscription with the new plan selected  
      */

    const subscription = eventObject as Stripe.Subscription;
    const user = await getUserInformationByCustomerId(subscription.customer as string);

    const priceId = subscription.items.data[0].price.id;

    //Find the plan by the priceId
    const plan = findPlanByStripeId(priceId)!;

    //Update the user subscription and assign the selected plan
    await updateSubscriptionInformationByUserId(user!.id, {
      planId: plan.price.stripeId,
      frequency: plan.price.type,
      status: subscription.status,
      billingCycleStart: subscription.start_date,
      billingCycleEnd: subscription.ended_at,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    });
  }

  if (event.type === "invoice.payment_failed") {
    /* 
        - ACTION
          - SEND EMAIL WITH SUBJECT -> UPDATE/RETRY PAYMENT METHOD TO CONTINUE USING LOGSH.CO
        
        - POSSIBLE ERRORS
          - Insufficient funds, expired cards, or other payment errors

        - Stripe
          - You can adjust this retry logic by going to your Stripe Dashboard under 
          Settings → Billing → Subscriptions and emails → Manage retry behavior.

        - MEANWHILE LOGSH.CO
          - Send alert notification to the frontend
          - Api 
            - The current subscription will be limited to the free plan limit usage of ¿2500?

      */
    /* const invoice = eventObject as Stripe.Invoice;
      const user = await getUserIdByCustomerId( invoice.customer as string );
      
      await prisma.subscription.update({
        where: { userId: user.id },
        data: {
          status: ""
        }
      }); */
  }

  if (event.type === "customer.subscription.deleted") {
    /* 
        - ACTION
          - DOWNGRADE PLAN TO "free" (CANCELLED) AND CLEAN THE SUBSCRIPTION ATTRIBUTES FROM THE DATABASE 
        
        - What did it happen to trigger this event?
          - The invoice was not paid and the cron job from event "invoice.payment_failed" was executed
          - The user cancelled the current subscription voluntarily

        - MEANWHILE LOGSH.CO
          - It cancels the current subscription
          - All attributes will be cleaned up
          - Downgrade plan to "free"
      */
    const subscription = eventObject as Stripe.Subscription;
    const user = await getUserInformationByCustomerId(subscription.customer as string);
    const plan = findFreePlan()!;

    await updateSubscriptionInformationByUserId(user!.id, {
      planId: plan.price.stripeId,
      status: "",
      subscriptionId: null,
      frequency: null,
      billingCycleStart: null,
      billingCycleEnd: null,
      cancelAtPeriodEnd: null,
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    /* 
        - ACTION
          - CHANGE THE CURRENT STATUS FROM THE SUBSCRIPTION
        
        - What did it happen to trigger this event?
          - The invoice was paid succesfully 

        - Why is it needed?
          - The subscription trigger "invoice.payment_failed" was executed and the user paid after the grace period

        - MEANWHILE LOGSH.CO
          - Restore access to the PAY-PLAN
          - Continue with the current usage. REMEMBER! The usage is set to 0 on the 1st of the month

      */
    const invoice = eventObject as Stripe.Invoice;
    const user = await getUserInformationByCustomerId(invoice.customer as string);

    await updateSubscriptionInformationByUserId(user!.id, {
      status: "paid",
    });
  }

  //PROVISIONAL ACCESS
  if (event.type === "checkout.session.completed") {
    const checkout = eventObject as Stripe.Checkout.Session;
    const user = await getUserInformationByCustomerId(checkout.customer as string);

    const checkoutListItems = await stripe.checkout.sessions.listLineItems(checkout.id);

    const priceIdSelectedByUser = checkoutListItems.data[0].price?.id;

    const plan = findPlanByStripeId(priceIdSelectedByUser!);

    await updateSubscriptionInformationByUserId(user!.id, {
      planId: plan?.price.stripeId,
      frequency: plan?.price.type,
    });
  }

  if (event.type === "radar.early_fraud_warning.created") {
    const fraudWarning = eventObject as Stripe.Radar.EarlyFraudWarning;

    const charge = await stripe.charges.retrieve(fraudWarning.charge.toString());
    const user = await getUserInformationByCustomerId(charge.customer?.toString() ?? "");
  }

  if (event.type === "charge.dispute.created") {
    const dispute = eventObject as Stripe.Dispute;

    const charge = await stripe.charges.retrieve(dispute.charge.toString());
    const user = await getUserInformationByCustomerId(charge.customer?.toString() ?? "");
  }
};

export const webhook = async ({ event }: { event: Stripe.Event }): Promise<{ status: number; message: string }> => {
  try {
    if (stripeSubscriptionEvents.includes(event.type)) {
      console.log("🔵 Subscription");

      await subscriptionActions({ event });
      return {
        status: 200,
        message: "🟢 Received.",
      };
    }

    console.log(`🟡 Unhandled event type: ${event.type}.`);
    return {
      status: 400,
      message: `🟡 Unhandled event type: ${event.type}.`,
    };
  } catch (error) {
    console.log(`🔴 Webhook error: Webhook handler failed. ${event.type}`);
    console.log(error);
    return {
      status: 400,
      message: `🔴 Webhook error: Webhook handler failed. View Logs.`,
    };
  }
};

export const verifyWebhook = (data: { body: string; signature: string }) => {
  const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET as string;
  return stripe.webhooks.constructEvent(data.body, data.signature, webhookSecretKey);
};
