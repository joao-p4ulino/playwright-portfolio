import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import { makeUserData, type UserData } from '../utils/testData';
import { test } from './fixtures/base';

type ApiEnvelope = {
  responseCode: number;
  message?: string;
};

type Product = {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: {
      usertype: string;
    };
    category: string;
  };
};

type Brand = {
  id: number;
  brand: string;
};

type UserDetail = {
  id: number;
  name: string;
  email: string;
  title: string;
  birth_day: string;
  birth_month: string;
  birth_year: string;
  first_name: string;
  last_name: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
};

async function apiJson<T extends ApiEnvelope>(response: APIResponse): Promise<T> {
  expect(response.ok()).toBeTruthy();
  return JSON.parse(await response.text()) as T;
}

function accountForm(user: UserData) {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title,
    birth_date: user.day,
    birth_month: user.month,
    birth_year: user.year,
    firstname: user.firstName,
    lastname: user.lastName,
    company: user.company,
    address1: user.address,
    address2: user.address2,
    country: user.country,
    zipcode: user.zipcode,
    state: user.state,
    city: user.city,
    mobile_number: user.mobileNumber
  };
}

async function createAccount(request: APIRequestContext, user: UserData): Promise<void> {
  const body = await apiJson<ApiEnvelope>(
    await request.post('/api/createAccount', {
      form: accountForm(user)
    })
  );
  expect(body).toMatchObject({ responseCode: 201, message: 'User created!' });
}

async function deleteAccount(request: APIRequestContext, user: Pick<UserData, 'email' | 'password'>): Promise<ApiEnvelope> {
  return apiJson<ApiEnvelope>(
    await request.delete('/api/deleteAccount', {
      form: {
        email: user.email,
        password: user.password
      }
    })
  );
}

async function safeDeleteAccount(request: APIRequestContext, user: Pick<UserData, 'email' | 'password'>): Promise<void> {
  try {
    const body = await deleteAccount(request, user);
    if (body.responseCode !== 200) {
      await test.info().attach('api-cleanup-warning.txt', {
        body: JSON.stringify(body, null, 2),
        contentType: 'application/json'
      });
    }
  } catch (error) {
    await test.info().attach('api-cleanup-warning.txt', {
      body: String(error),
      contentType: 'text/plain'
    });
  }
}

test.describe('Automation Exercise official API list', () => {
  test('API 1 - Get All Products List', async ({ request }) => {
    const body = await apiJson<ApiEnvelope & { products: Product[] }>(await request.get('/api/productsList'));

    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        price: expect.any(String),
        brand: expect.any(String),
        category: expect.any(Object)
      })
    );
  });

  test('API 2 - POST To All Products List is not supported', async ({ request }) => {
    const body = await apiJson<ApiEnvelope>(await request.post('/api/productsList'));

    expect(body).toMatchObject({
      responseCode: 405,
      message: 'This request method is not supported.'
    });
  });

  test('API 3 - Get All Brands List', async ({ request }) => {
    const body = await apiJson<ApiEnvelope & { brands: Brand[] }>(await request.get('/api/brandsList'));

    expect(body.responseCode).toBe(200);
    expect(body.brands.length).toBeGreaterThan(0);
    expect(body.brands.map(brand => brand.brand)).toContain('Polo');
  });

  test('API 4 - PUT To All Brands List is not supported', async ({ request }) => {
    const body = await apiJson<ApiEnvelope>(await request.put('/api/brandsList'));

    expect(body).toMatchObject({
      responseCode: 405,
      message: 'This request method is not supported.'
    });
  });

  test('API 5 - POST To Search Product', async ({ request }) => {
    const body = await apiJson<ApiEnvelope & { products: Product[] }>(
      await request.post('/api/searchProduct', {
        form: {
          search_product: 'top'
        }
      })
    );

    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    expect(
      body.products.some(product => {
        const searchableText = `${product.name} ${product.category.category}`.toLowerCase();
        return searchableText.includes('top');
      })
    ).toBeTruthy();
  });

  test('API 6 - POST To Search Product without search_product parameter', async ({ request }) => {
    const body = await apiJson<ApiEnvelope>(await request.post('/api/searchProduct'));

    expect(body).toMatchObject({
      responseCode: 400,
      message: 'Bad request, search_product parameter is missing in POST request.'
    });
  });

  test('API 7 - POST To Verify Login with valid details', async ({ request }) => {
    const user = makeUserData('api07');

    try {
      await createAccount(request, user);
      const body = await apiJson<ApiEnvelope>(
        await request.post('/api/verifyLogin', {
          form: {
            email: user.email,
            password: user.password
          }
        })
      );

      expect(body).toMatchObject({ responseCode: 200, message: 'User exists!' });
    } finally {
      await safeDeleteAccount(request, user);
    }
  });

  test('API 8 - POST To Verify Login without email parameter', async ({ request }) => {
    const body = await apiJson<ApiEnvelope>(
      await request.post('/api/verifyLogin', {
        form: {
          password: 'Password123!'
        }
      })
    );

    expect(body).toMatchObject({
      responseCode: 400,
      message: 'Bad request, email or password parameter is missing in POST request.'
    });
  });

  test('API 9 - DELETE To Verify Login is not supported', async ({ request }) => {
    const body = await apiJson<ApiEnvelope>(await request.delete('/api/verifyLogin'));

    expect(body).toMatchObject({
      responseCode: 405,
      message: 'This request method is not supported.'
    });
  });

  test('API 10 - POST To Verify Login with invalid details', async ({ request }) => {
    const body = await apiJson<ApiEnvelope>(
      await request.post('/api/verifyLogin', {
        form: {
          email: `missing.${Date.now()}@example.com`,
          password: 'not-a-real-password'
        }
      })
    );

    expect(body).toMatchObject({ responseCode: 404, message: 'User not found!' });
  });

  test('API 11 - POST To Create/Register User Account', async ({ request }) => {
    const user = makeUserData('api11');

    try {
      const body = await apiJson<ApiEnvelope>(
        await request.post('/api/createAccount', {
          form: accountForm(user)
        })
      );

      expect(body).toMatchObject({ responseCode: 201, message: 'User created!' });
    } finally {
      await safeDeleteAccount(request, user);
    }
  });

  test('API 12 - DELETE METHOD To Delete User Account', async ({ request }) => {
    const user = makeUserData('api12');
    await createAccount(request, user);

    const body = await deleteAccount(request, user);

    expect(body).toMatchObject({ responseCode: 200, message: 'Account deleted!' });
  });

  test('API 13 - PUT METHOD To Update User Account', async ({ request }) => {
    const user = makeUserData('api13');
    const updatedUser = {
      ...user,
      name: `${user.name} Updated`,
      firstName: 'Updated',
      city: 'San Francisco'
    };

    try {
      await createAccount(request, user);
      const body = await apiJson<ApiEnvelope>(
        await request.put('/api/updateAccount', {
          form: accountForm(updatedUser)
        })
      );

      expect(body).toMatchObject({ responseCode: 200, message: 'User updated!' });
    } finally {
      await safeDeleteAccount(request, user);
    }
  });

  test('API 14 - GET user account detail by email', async ({ request }) => {
    const user = makeUserData('api14');

    try {
      await createAccount(request, user);
      const body = await apiJson<ApiEnvelope & { user: UserDetail }>(
        await request.get('/api/getUserDetailByEmail', {
          params: {
            email: user.email
          }
        })
      );

      expect(body.responseCode).toBe(200);
      expect(body.user).toMatchObject({
        name: user.name,
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        company: user.company,
        address1: user.address,
        address2: user.address2,
        country: user.country,
        state: user.state,
        city: user.city,
        zipcode: user.zipcode
      });
    } finally {
      await safeDeleteAccount(request, user);
    }
  });
});
