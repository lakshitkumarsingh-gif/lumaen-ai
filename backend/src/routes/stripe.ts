import express, { Router, Request, Response } from 'express';
import stripe from 'stripe';
import { authMiddleware } from '../middleware/auth';
import UserModel from '../models/User';

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY || '');
const router: Router = express.Router();

interface AuthRequest extends Request {
  user?: any;
}

const pricingTiers: Record<string, { id: string; name: string; price: number; credits: number }> = {
  free: { id: 'price_free', name: 'Starter', price: 0, credits: 100 },
  pro: { id: 'price_pro', name: 'Pro', price: 999, credits: 10000 }, // $9.99/month
  premium: { id: 'price_premium', name: 'Premium', price: 2499, credits: 50000 }, // $24.99/month
  infinity: { id: 'price_infinity', name: 'InfinityBro', price: 9999, credits: 999999 }, // $99.99/month
};

// Create checkout session
router.post('/checkout', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { plan } = req.body;
    const userId = req.user?.id;

    const user = await UserModel.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tier = pricingTiers[plan];
    if (!tier) return res.status(400).json({ error: 'Invalid plan' });

    // Create or retrieve Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripeClient.customers.create({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
      });
      customerId = customer.id;
      await UserModel.updatePlan(userId, plan as any, customerId);
    }

    // Create checkout session
    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: tier.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

  try {
    const event = stripeClient.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const customerId = session.customer;

      // Find user by customer ID and update plan
      // Note: You'll need to query the database for this
      console.log('Payment successful:', session);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
});

// Get current subscription
router.get('/subscription', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await UserModel.getUserById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const tier = pricingTiers[user.plan];
    res.json({
      plan: user.plan,
      credits: user.credits,
      tier: tier,
      subscriptionEnd: user.subscription_end_date,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscription' });
  }
});

export default router;
