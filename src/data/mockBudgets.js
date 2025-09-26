import { faker } from '@faker-js/faker';

export const mockBudgetsData = Array.from({ length: 25 }, (_, index) => {
  const budgetValue = faker.number.float({ min: 10, max: 200, fractionDigits: 3 });
  return {
    budgetId: `PUR/3/${String(index + 1).padStart(4, '0')}`,
    employee: faker.helpers.arrayElement(['Lakshmi Kanth Pitchandi', 'John Anderson', 'Sarah Johnson', 'Mike Wilson']),
    enquiryId: `PCENQ${faker.number.int({ min: 2500000, max: 2500100 })}`,
    customer: faker.company.name(),
    status: faker.helpers.arrayElement(['Pending', 'Approved', 'Rejected']),
    budgetDate: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
    budgetValue: budgetValue,
    quoteSentDate: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
    closureDate: faker.date.recent({ days: 15 }).toISOString().split('T')[0],
    quoteSentStatus: faker.helpers.arrayElement(['YES', 'NO']),
    
    // Detailed fields for view/edit pages
    branch: faker.helpers.arrayElement(['DSS Oman', 'DSS Dubai', 'DSS Kuwait', 'DSS Qatar', 'DSS Bahrain']),
    billingAddress: faker.location.streetAddress(true),
    dispatchAddress: faker.location.streetAddress(true),
    paymentDays: faker.helpers.arrayElement(['15 Days', '30 Days', '45 Days', '60 Days']),
    taxType: 'VAT 5%',
    deliveryDays: '14 Days',
    licensesOffering: 'Standard',
    paymentTerm: 'Advance',
    currency: 'OMR',
    shipping: 'FOB',
    notes: 'Standard Terms and Conditions Apply.',
    products: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => ({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      qty: faker.number.int({ min: 5, max: 50 }),
      unit: 'Pieces',
      unitPrice: Number(faker.commerce.price()),
      buyingTax: 5,
      margin: 20,
      sellingTax: 5,
    })),
    freightCharges: {
      landFreight: faker.number.float({ min: 10, max: 100 }),
      airFreight: 0,
      seaFreight: 0
    },
    discount: faker.number.int({ min: 0, max: 10 }),
    vat: 5,
  };
});

// A function to find a budget, handling revision numbers
export const findBudget = (id) => {
    if (!id) return null;
    const baseId = id.split('/r')[0];
    return mockBudgetsData.find(b => b.budgetId === baseId);
}
