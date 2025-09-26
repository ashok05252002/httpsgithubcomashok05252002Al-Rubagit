import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { faker } from '@faker-js/faker';
import { findBudget } from '../../data/mockBudgets';

// Mock enquiries data
const mockEnquiries = [
  {
    id: 'PCENQ2500001', customer: 'ISAG Consulting Engineers LLC', contact: 'John Anderson', products: [
      { name: 'Broiler Feed Starter', description: 'Premium quality starter feed', qty: 12, unit: 'Bags' }
    ]
  },
  {
    id: 'PCENQ2500002', customer: 'Tech Solutions Inc.', contact: 'Sarah Johnson', products: [
      { name: 'High-Performance Processor', description: 'Server grade CPU', qty: 50, unit: 'Pieces' },
      { name: 'Memory Modules', description: '32GB DDR5', qty: 100, unit: 'Pieces' }
    ]
  },
  {
    id: 'PCENQ2500003', customer: 'Global Manufacturing Co.', contact: 'Mike Wilson', products: [
      { name: 'Industrial Equipment', description: 'Heavy machinery parts', qty: 5, unit: 'Sets' }
    ]
  }
];

const BudgetCreateEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const isEditOrRevision = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [budgetData, setBudgetData] = useState({
    budgetId: '',
    enteredBy: '',
    branch: '',
    enquiryId: '',
    budgetDate: new Date().toISOString().split('T')[0],
    billingAddress: '',
    dispatchAddress: '',
    sameAsBilling: false,
    uploadedDocument: null,
    selectedEnquiry: null,
    budgetDetails: {
      dropdowns: { field1: '', field2: '', field3: '', field4: '', field5: '', field6: '' },
      notes: 'Standard Terms and Conditions Apply.',
      products: [],
      freightCharges: { landFreight: 0, airFreight: 0, seaFreight: 0 },
      discount: 0,
      vat: 5
    },
    quotationData: {
      companyName: 'RIYADA',
      companySubtitle: 'Public authority for small and medium enterprises development',
      offerNo: 'LA354-2025',
      date: new Date().toLocaleDateString('en-GB'),
      ourRef: 'Urgent requirement',
      attn: 'Procurement Engineer'
    }
  });

  useEffect(() => {
    const isRevision = location.state?.isRevision;
    if (id) {
        const budgetToLoad = findBudget(id);
        if (budgetToLoad) {
            let newId = budgetToLoad.budgetId;
            if (isRevision) {
                const baseId = budgetToLoad.budgetId;
                const revisionMatch = id.match(/\/r(\d+)$/);
                const currentRevision = revisionMatch ? parseInt(revisionMatch[1], 10) : 0;
                newId = `${baseId.split('/r')[0]}/r${currentRevision + 1}`;
            }

            setBudgetData({
                ...budgetData,
                budgetId: newId,
                enteredBy: budgetToLoad.employee,
                branch: budgetToLoad.branch,
                enquiryId: budgetToLoad.enquiryId,
                budgetDate: budgetToLoad.budgetDate,
                billingAddress: budgetToLoad.billingAddress,
                dispatchAddress: budgetToLoad.dispatchAddress,
                sameAsBilling: budgetToLoad.billingAddress === budgetToLoad.dispatchAddress,
                selectedEnquiry: mockEnquiries.find(e => e.id === budgetToLoad.enquiryId) || null,
                budgetDetails: {
                    ...budgetData.budgetDetails,
                    notes: budgetToLoad.notes,
                    products: budgetToLoad.products.map(p => ({ ...p, unitPrice: Number(p.unitPrice) })),
                    freightCharges: budgetToLoad.freightCharges,
                    discount: budgetToLoad.discount,
                    vat: budgetToLoad.vat,
                },
            });
        }
    }
  }, [id, location.state]);

  const handleInputChange = (field, value) => {
    setBudgetData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEnquiryChange = (enquiryId) => {
    const selectedEnq = mockEnquiries.find(enq => enq.id === enquiryId);
    if (selectedEnq) {
      setBudgetData(prev => ({
        ...prev,
        enquiryId: enquiryId,
        selectedEnquiry: selectedEnq,
        budgetDetails: {
          ...prev.budgetDetails,
          products: selectedEnq.products.map((product, index) => ({
            id: index + 1,
            name: product.name,
            description: product.description,
            qty: product.qty,
            delivery: '24',
            unit: product.unit,
            unitPrice: faker.number.float({ min: 10, max: 100, fractionDigits: 2 }),
            amount: 0,
            buyingTax: 5,
            margin: 20,
            sellingTax: 5,
          }))
        }
      }));
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center mb-8">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
        1
      </div>
      <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}>
        Customer Details
      </span>

      <div className={`w-12 h-0.5 mx-4 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
        2
      </div>
      <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}>
        Budget Details
      </span>

      <div className={`w-12 h-0.5 mx-4 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>

      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
        }`}>
        3
      </div>
      <span className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}>
        Quotation Preview
      </span>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Entered By: <span className="text-red-500">*</span>
          </label>
          <select
            value={budgetData.enteredBy}
            onChange={(e) => handleInputChange('enteredBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
            required
          >
            <option value="">- Choose -</option>
            <option value="Lakshmi Kanth Pitchandi">Lakshmi Kanth Pitchandi</option>
            <option value="John Anderson">John Anderson</option>
            <option value="Sarah Johnson">Sarah Johnson</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch: <span className="text-red-500">*</span>
          </label>
          <select
            value={budgetData.branch}
            onChange={(e) => handleInputChange('branch', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
            required
          >
            <option value="">- Choose -</option>
            <option value="Main Branch">Main Branch</option>
            <option value="North Branch">North Branch</option>
            <option value="South Branch">South Branch</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enquiry Id: <span className="text-red-500">*</span>
          </label>
          <select
            value={budgetData.enquiryId}
            onChange={(e) => handleEnquiryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
            required
          >
            <option value="">- Choose -</option>
            {mockEnquiries.map(enq => (
              <option key={enq.id} value={enq.id}>{enq.id}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Budget Date:</label>
          <input
            type="date"
            value={budgetData.budgetDate}
            onChange={(e) => handleInputChange('budgetDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Billing Address: <span className="text-red-500">*</span>
        </label>
        <textarea
          value={budgetData.billingAddress}
          onChange={(e) => handleInputChange('billingAddress', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          id="sameAsBilling"
          checked={budgetData.sameAsBilling}
          onChange={(e) => {
            const checked = e.target.checked;
            setBudgetData(prev => ({
              ...prev,
              sameAsBilling: checked,
              dispatchAddress: checked ? prev.billingAddress : ''
            }));
          }}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="sameAsBilling" className="ml-2 text-sm text-gray-700">
          Same as Billing Address
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dispatch Address: <span className="text-red-500">*</span>
        </label>
        <textarea
          value={budgetData.dispatchAddress}
          onChange={(e) => handleInputChange('dispatchAddress', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Document</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">(Choose: png, jpg, csv, doc, xls)</p>
          <input
            type="file"
            onChange={(e) => handleInputChange('uploadedDocument', e.target.files[0])}
            className="hidden"
            id="document-upload"
            accept=".png,.jpg,.csv,.doc,.xls,.pdf"
          />
          <label htmlFor="document-upload" className="cursor-pointer text-blue-600 hover:underline">
            Browse files
          </label>
        </div>
      </div>

      {budgetData.selectedEnquiry && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enquiry Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase border-r">NAME</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase border-r">CUSTOMER DESCRIPTION</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase border-r">SALES ACCOUNT MANAGER</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">CUSTOMER CONTACT</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="px-4 py-2 text-sm text-gray-900 border-r">{budgetData.selectedEnquiry.customer}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 border-r">
                    {budgetData.selectedEnquiry.products.map(p => p.name).join(', ')}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 border-r">Sales Manager</td>
                  <td className="px-4 py-2 text-sm text-gray-900">{budgetData.selectedEnquiry.contact}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // Step 2 - Budget Details with dark theme
  const renderStep2 = () => {
    const updateProduct = (index, field, value) => {
      setBudgetData(prev => ({
        ...prev,
        budgetDetails: {
          ...prev.budgetDetails,
          products: prev.budgetDetails.products.map((product, i) =>
            i === index ? {
              ...product,
              [field]: value,
              amount: field === 'qty' || field === 'unitPrice'
                ? (field === 'qty' ? value : product.qty) * (field === 'unitPrice' ? value : product.unitPrice)
                : product.amount
            } : product
          )
        }
      }));
    };

    const addProduct = () => {
      setBudgetData(prev => ({
        ...prev,
        budgetDetails: {
          ...prev.budgetDetails,
          products: [...prev.budgetDetails.products, {
            id: Date.now(),
            name: '',
            description: '',
            unit: 'Pieces',
            qty: 1,
            unitPrice: 0,
            buyingTax: 5,
            margin: 20,
            sellingTax: 5,
            amount: 0
          }]
        }
      }));
    };

    const removeProduct = (index) => {
      setBudgetData(prev => ({
        ...prev,
        budgetDetails: {
          ...prev.budgetDetails,
          products: prev.budgetDetails.products.filter((_, i) => i !== index)
        }
      }));
    };

    const calculateSubTotal = () => {
      return budgetData.budgetDetails.products.reduce((sum, product) => sum + (product.qty * product.unitPrice), 0);
    };

    const subTotal = calculateSubTotal();
    const discount = (subTotal * budgetData.budgetDetails.discount) / 100;
    const vatAmount = ((subTotal - discount) * budgetData.budgetDetails.vat) / 100;
    const freight = budgetData.budgetDetails.freightCharges.landFreight +
      budgetData.budgetDetails.freightCharges.airFreight +
      budgetData.budgetDetails.freightCharges.seaFreight;
    const grandTotal = subTotal - discount + vatAmount + freight;

    return (
      <div className="bg-white rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-900">Budget Details</h2>

        {/* Dropdowns - structured */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>---- Select Payment Days ----</option>
              <option>15 Days</option>
              <option>30 Days</option>
              <option>45 Days</option>
              <option>60 Days</option>
              <option>90 Days</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>---- Select Tax Type ----</option>
              <option>VAT 5%</option>
              <option>Zero Rated</option>
              <option>Exempt</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>---- Choose Delivery Days ----</option>
              <option>Immediate</option>
              <option>7 Days</option>
              <option>14 Days</option>
              <option>30 Days</option>
              <option>45 Days</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>---- Choose Licenses Offering ----</option>
              <option>Standard</option>
              <option>Enterprise</option>
              <option>SaaS Annual</option>
              <option>Perpetual</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>---- Choose Payment Term ----</option>
              <option>Advance</option>
              <option>Partial 50%</option>
              <option>On Delivery</option>
              <option>Net 30</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>---- Choose Currency ----</option>
              <option>OMR</option>
              <option>AED</option>
              <option>USD</option>
              <option>SAR</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option>---- Choose Shipping ----</option>
              <option>FOB</option>
              <option>CIF</option>
              <option>Door Delivery</option>
              <option>Pickup</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Terms and Conditions
          </button>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">Notes:</label>
          <textarea
            value={budgetData.budgetDetails.notes}
            onChange={(e) => setBudgetData(prev => ({
              ...prev,
              budgetDetails: { ...prev.budgetDetails, notes: e.target.value }
            }))}
            rows={3}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Product Table */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Products</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">UOM</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Quantity</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Buying Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tax %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Buying</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total with Tax</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Margin %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Selling Price</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Tax %</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Selling</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Total Selling with Tax</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    <button
                      onClick={addProduct}
                      className="text-blue-600 hover:text-blue-800"
                      title="Add Product"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetData.budgetDetails.products.map((product, index) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={product.name}
                        onChange={(e) => updateProduct(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={product.description || ''}
                        onChange={(e) => updateProduct(index, 'description', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={product.unit || 'Pieces'}
                        onChange={(e) => updateProduct(index, 'unit', e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option>Pieces</option>
                        <option>Units</option>
                        <option>Kg</option>
                        <option>Bags</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={product.qty}
                        onChange={(e) => updateProduct(index, 'qty', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={product.unitPrice}
                        onChange={(e) => updateProduct(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={product.buyingTax || 5}
                        onChange={(e) => updateProduct(index, 'buyingTax', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={(product.qty * product.unitPrice).toFixed(2)}
                        readOnly
                        className="w-24 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={(product.qty * product.unitPrice * (1 + (product.buyingTax || 5) / 100)).toFixed(2)}
                        readOnly
                        className="w-24 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={product.margin || 20}
                        onChange={(e) => updateProduct(index, 'margin', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={(product.unitPrice * (1 + (product.margin || 20) / 100)).toFixed(2)}
                        readOnly
                        className="w-24 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={product.sellingTax || 5}
                        onChange={(e) => updateProduct(index, 'sellingTax', parseFloat(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={(product.qty * product.unitPrice * (1 + (product.margin || 20) / 100)).toFixed(2)}
                        readOnly
                        className="w-28 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={(product.qty * product.unitPrice * (1 + (product.margin || 20) / 100) * (1 + (product.sellingTax || 5) / 100)).toFixed(2)}
                        readOnly
                        className="w-28 px-2 py-1 bg-gray-50 border border-gray-300 rounded text-gray-900 text-sm"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => removeProduct(index)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Freight and Totals */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Freight Charges */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">Freight Charges</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1 text-gray-700">Land Freight:</label>
                <input
                  type="number"
                  value={budgetData.budgetDetails.freightCharges.landFreight}
                  onChange={(e) => setBudgetData(prev => ({
                    ...prev,
                    budgetDetails: {
                      ...prev.budgetDetails,
                      freightCharges: { ...prev.budgetDetails.freightCharges, landFreight: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Air Freight:</label>
                <input
                  type="number"
                  value={budgetData.budgetDetails.freightCharges.airFreight}
                  onChange={(e) => setBudgetData(prev => ({
                    ...prev,
                    budgetDetails: {
                      ...prev.budgetDetails,
                      freightCharges: { ...prev.budgetDetails.freightCharges, airFreight: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-1 text-gray-700">Sea Freight:</label>
                <input
                  type="number"
                  value={budgetData.budgetDetails.freightCharges.seaFreight}
                  onChange={(e) => setBudgetData(prev => ({
                    ...prev,
                    budgetDetails: {
                      ...prev.budgetDetails,
                      freightCharges: { ...prev.budgetDetails.freightCharges, seaFreight: parseFloat(e.target.value) || 0 }
                    }
                  }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Totals */}
          <div>
            <h3 className="text-lg font-medium mb-4 text-gray-900">Totals</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Discount (%):</span>
                <input
                  type="number"
                  value={budgetData.budgetDetails.discount}
                  onChange={(e) => setBudgetData(prev => ({
                    ...prev,
                    budgetDetails: { ...prev.budgetDetails, discount: parseFloat(e.target.value) || 0 }
                  }))}
                  className="w-20 px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Sub Total:</span>
                <span className="text-gray-900">{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Discount:</span>
                <span className="text-gray-900">- {discount.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">VAT (5%):</span>
                <span className="text-gray-900">+ {vatAmount.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Freight:</span>
                <span className="text-gray-900">+ {freight.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center bg-blue-600 px-3 py-2 rounded">
                <span className="font-bold text-white">Grand Total:</span>
                <span className="font-bold text-white">{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 3 - Quotation Preview
  const renderStep3 = () => {
    const subTotal = budgetData.budgetDetails.products.reduce((sum, product) => sum + (product.qty * product.unitPrice * 1.2), 0);
    const vatAmount = (subTotal * 5) / 100;
    const totalAmount = subTotal + vatAmount;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Quotation Preview</h2>
          <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Export
          </button>
        </div>

        {/* Quotation Document */}
        <div className="bg-white border shadow-lg p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">RIYADA</h1>
              <p className="text-sm text-gray-600">Public authority for small and medium enterprises development</p>
            </div>
            <div className="text-right text-sm">
              <div className="border border-gray-300 p-2 mb-2">
                <div><strong>Offer No:</strong> LA354-2025</div>
                <div><strong>Date:</strong> September 19, 2025</div>
                <div><strong>Our Ref:</strong> Urgent requirement</div>
                <div><strong>Attn:</strong> Procurement Engineer</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <strong>To:</strong><br />
            {budgetData.selectedEnquiry?.customer || 'N/A'}
          </div>

          <div className="mb-6">
            <strong>Sub:</strong> Proposal for Fittings
          </div>

          {/* Products Table */}
          <table className="w-full border-collapse border border-gray-300 mb-6">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">SL NO.</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Customer Description</th>
                <th className="border border-gray-300 px-4 py-2 text-left">DESCRIPTION</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Qty</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Delivery</th>
                <th className="border border-gray-300 px-4 py-2 text-left">UNIT</th>
                <th className="border border-gray-300 px-4 py-2 text-left">UNIT PRICE IN OMR</th>
                <th className="border border-gray-300 px-4 py-2 text-left">AMOUNT IN OMR</th>
              </tr>
            </thead>
            <tbody>
              {budgetData.budgetDetails.products.map((product, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.description}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.qty}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.delivery}</td>
                  <td className="border border-gray-300 px-4 py-2">{product.unit}</td>
                  <td className="border border-gray-300 px-4 py-2">{(product.unitPrice * 1.2).toFixed(2)}</td>
                  <td className="border border-gray-300 px-4 py-2">{(product.qty * product.unitPrice * 1.2).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="6" className="border border-gray-300 px-4 py-2 text-right font-bold">SUB TOTAL (OMR)</td>
                <td className="border border-gray-300 px-4 py-2">{budgetData.budgetDetails.products.length}</td>
                <td className="border border-gray-300 px-4 py-2 font-bold">{subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="7" className="border border-gray-300 px-4 py-2 text-right">VAT (5%)</td>
                <td className="border border-gray-300 px-4 py-2">{vatAmount.toFixed(3)}</td>
              </tr>
              <tr>
                <td colSpan="7" className="border border-gray-300 px-4 py-2 text-right font-bold">TOTAL IN OMR</td>
                <td className="border border-gray-300 px-4 py-2 font-bold">{totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div className="border border-gray-300 p-4 mb-6">
            <strong>Amount in words:</strong> Omani Rial Six Hundred Fifty & 160/1000 Rial only.
          </div>

          {/* Terms and Conditions */}
          <div className="text-sm space-y-2 mb-6">
            <div><strong>Terms & Conditions :</strong></div>
            <div><strong>Prices Basis:</strong> In Oman Rial DDI. Muscat. Sea shipment mode (Charges extra for air shipment)</div>
            <div><strong>Terms:</strong> All items mentioned are for the 24 month warranty. Suitable added prices in case of basket currency fluctuation in EURO/ USD/ AED to OMR as per exchange rates during Order finalization)</div>
            <div><strong>Delivery:</strong> As per manufacturer's standard. Delivery time is based on current factory capacity & raw material availability (Delivery shall be re-confirmed during order placement).</div>
            <div><strong>Payment:</strong> PDC 90 days before delivery.</div>
            <div><strong>Validity of Offer:</strong> 01 days from the date of Offer (for Price and Delivery).</div>
            {/* More terms... */}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-8 text-sm">
            <div>
              <div><strong>Juhana Kh. Mansul</strong></div>
              <div>Sales Engineer</div>
              <div>AL ROUBA ENT. & TRAD. LLC</div>
              <div>Seeb, Sultanate of Oman</div>
              <div>GSM: +968 93800161</div>
              <div>Tel: +968 24425098</div>
              <div>Email: sales1@alrouba.com</div>
              <div>www.alrouba.com</div>
            </div>
            <div className="text-right">
              <div><strong>Juheed Uddin</strong></div>
              <div>Sr. Sales Engineer</div>
              <div>AL ROUBA ENT. & TRAD. LLC</div>
              <div>Seeb, Sultanate of Oman</div>
              <div>GSM: +968 99387161</div>
              <div>Tel: +968 24425098</div>
              <div>Email: juheed@alrouba.com</div>
              <div>www.alrouba.com</div>
            </div>
          </div>

          <div className="text-center mt-4 text-sm">
            <div><strong>INNOVATIVE SOLUTIONS</strong></div>
            <div className="text-xs mt-2">CR 1/168/91.S.O Box 2614, Building No. 241, Al Khoudh Seeb, Sultanate of Oman | Tel: +968 24425098, Fax: +968 24425098</div>
            <div className="text-xs">Way No.: 2414, Building No.2414, Al Khoudh, Seeb, Sultanate of Oman | E-mail: info@alrouba.com, www.alrouba.com</div>
          </div>

          <div className="text-right mt-4 text-xs">
            Page 1 of 1
          </div>
        </div>
      </div>
    );
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    // In a real app, you would save the data here
    alert('Budget created successfully!');
    navigate('/budgets');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/budgets')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? (location.state?.isRevision ? 'Revise Budget' : 'Edit Budget') : 'Create New Budget'}
              {budgetData.budgetId && ` (${budgetData.budgetId})`}
            </h1>
            <p className="text-gray-600">Set up budget details and generate quotation</p>
          </div>
        </div>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="flex space-x-3">
          {currentStep === 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          ) : currentStep === 2 ? (
            <>
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Preview
              </button>
              <button
                onClick={() => alert('Sent for approval!')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Send for Approval
              </button>
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetCreateEdit;
