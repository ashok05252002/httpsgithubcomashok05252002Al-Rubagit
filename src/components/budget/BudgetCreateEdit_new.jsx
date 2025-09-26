import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { faker } from '@faker-js/faker';

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

    const [currentStep, setCurrentStep] = useState(1);
    const [budgetData, setBudgetData] = useState({
        // Step 1 - Customer Details
        enteredBy: '',
        branch: '',
        enquiryId: '',
        budgetDate: new Date().toISOString().split('T')[0],
        billingAddress: '',
        dispatchAddress: '',
        sameAsBilling: false,
        uploadedDocument: null,
        selectedEnquiry: null,

        // Step 2 - Budget Details  
        budgetDetails: {
            dropdowns: {
                field1: '',
                field2: '',
                field3: '',
                field4: '',
                field5: '',
                field6: ''
            },
            narration: 'Standard Terms and Conditions Apply.',
            products: [],
            freightCharges: {
                landFreight: 0,
                airFreight: 0,
                seaFreight: 0
            },
            discount: 0,
            vat: 5
        },

        // Step 3 - Quotation Preview
        quotationData: {
            companyName: 'RIYADA',
            companySubtitle: 'Public authority for small and medium enterprises development',
            offerNo: 'LA354-2025',
            date: new Date().toLocaleDateString('en-GB'),
            ourRef: 'Urgent requirement',
            attn: 'Procurement Engineer'
        }
    });

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
                        amount: 0
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
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase border-r">SALES ACCOUNT MAANAGER</th>
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
                            {id ? 'Edit Budget' : 'Create New Budget'}
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
                {/* Step 2 and 3 will be added next */}
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
                <button
                    onClick={handleNext}
                    disabled={currentStep === 3}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default BudgetCreateEdit;
