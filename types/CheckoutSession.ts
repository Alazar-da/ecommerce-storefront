export interface CheckoutSession {
  sessionId: string;
  amountTotal: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}
