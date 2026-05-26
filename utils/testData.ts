export type UserData = {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
};

export type PaymentData = {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
};

export function makeUserData(prefix = 'ae'): UserData {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    name: `Portfolio User ${suffix}`,
    email: `${prefix}.${suffix}@example.com`,
    password: 'Password123!',
    title: 'Mr',
    day: '10',
    month: 'May',
    year: '1991',
    firstName: 'Portfolio',
    lastName: `User ${suffix}`,
    company: 'QA Portfolio',
    address: `100 Test Avenue ${suffix}`,
    address2: 'Suite 200',
    country: 'United States',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90001',
    mobileNumber: '5551234567'
  };
}

export const paymentData: PaymentData = {
  nameOnCard: 'Portfolio User',
  cardNumber: '4111111111111111',
  cvc: '123',
  expiryMonth: '12',
  expiryYear: '2030'
};
