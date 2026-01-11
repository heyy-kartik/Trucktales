declare module "razorpay" {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface Contact {
    name: string;
    type?: string;
    reference_id?: string;
    email?: string;
    contact?: string;
    notes?: Record<string, string>;
  }

  interface VPA {
    address: string;
  }

  interface BankAccount {
    name: string;
    ifsc: string;
    account_number: string;
  }

  interface FundAccount {
    account_type: "vpa" | "bank_account";
    vpa?: VPA;
    bank_account?: BankAccount;
    contact: Contact;
  }

  interface PayoutCreateOptions {
    account_number: string;
    fund_account: FundAccount;
    amount: number;
    currency: string;
    mode: "UPI" | "IMPS" | "NEFT" | "RTGS";
    purpose: string;
    queue_if_low_balance?: boolean;
    reference_id?: string;
    narration?: string;
    notes?: Record<string, string>;
  }

  interface Payout {
    id: string;
    entity: string;
    fund_account_id: string;
    amount: number;
    currency: string;
    fees: number;
    tax: number;
    status: string;
    utr: string | null;
    mode: string;
    purpose: string;
    reference_id: string;
    narration: string;
    batch_id: string | null;
    failure_reason: string | null;
    created_at: number;
    processed_at: number | null;
  }

  interface Payouts {
    create(options: PayoutCreateOptions): Promise<Payout>;
    fetch(payoutId: string): Promise<Payout>;
    all(options?: { account_number: string }): Promise<{ items: Payout[] }>;
  }

  interface Order {
    id: string;
    entity: string;
    amount: number;
    amount_paid: number;
    amount_due: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    created_at: number;
  }

  interface OrderCreateOptions {
    amount: number;
    currency: string;
    receipt?: string;
    notes?: Record<string, string>;
    partial_payment?: boolean;
  }

  interface Orders {
    create(options: OrderCreateOptions): Promise<Order>;
    fetch(orderId: string): Promise<Order>;
    all(options?: Record<string, unknown>): Promise<{ items: Order[] }>;
  }

  interface Payment {
    id: string;
    entity: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    description: string;
    bank: string | null;
    wallet: string | null;
    vpa: string | null;
    email: string;
    contact: string;
    fee: number;
    tax: number;
    error_code: string | null;
    error_description: string | null;
    created_at: number;
    captured: boolean;
  }

  interface Payments {
    fetch(paymentId: string): Promise<Payment>;
    all(options?: Record<string, unknown>): Promise<{ items: Payment[] }>;
    capture(
      paymentId: string,
      amount: number,
      currency?: string
    ): Promise<Payment>;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    payouts: Payouts;
    orders: Orders;
    payments: Payments;
  }

  export = Razorpay;
}
