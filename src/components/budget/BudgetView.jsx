import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Printer } from 'lucide-react';
import { findBudget } from '../../data/mockBudgets';
import StatusBadge from '../ui/StatusBadge';

const BudgetView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const budget = findBudget(id);

    if (!budget) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-700">Budget Not Found</h2>
                <p className="text-gray-500">The budget with ID '{id}' could not be found.</p>
                <button onClick={() => navigate('/budgets')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
                    Back to Budget List
                </button>
            </div>
        );
    }
    
    const subTotal = budget.products.reduce((sum, p) => sum + (p.qty * p.unitPrice), 0);
    const discountAmount = (subTotal * budget.discount) / 100;
    const totalAfterDiscount = subTotal - discountAmount;
    const vatAmount = (totalAfterDiscount * budget.vat) / 100;
    const freightTotal = budget.freightCharges.landFreight + budget.freightCharges.airFreight + budget.freightCharges.seaFreight;
    const grandTotal = totalAfterDiscount + vatAmount + freightTotal;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/budgets')} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Budget: {budget.budgetId}</h1>
                        <p className="text-gray-600">Customer: {budget.customer}</p>
                    </div>
                    <StatusBadge status={budget.status} />
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={() => navigate(`/budget/${encodeURIComponent(budget.budgetId)}/edit`)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Budget
                    </button>
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><p className="text-sm text-gray-500">Employee</p><p className="font-medium">{budget.employee}</p></div>
                    <div><p className="text-sm text-gray-500">Branch</p><p className="font-medium">{budget.branch}</p></div>
                    <div><p className="text-sm text-gray-500">Budget Date</p><p className="font-medium">{new Date(budget.budgetDate).toLocaleDateString()}</p></div>
                    <div><p className="text-sm text-gray-500">Enquiry ID</p><p className="font-medium">{budget.enquiryId}</p></div>
                    <div className="col-span-2"><p className="text-sm text-gray-500">Billing Address</p><p className="font-medium">{budget.billingAddress}</p></div>
                    <div className="col-span-2"><p className="text-sm text-gray-500">Dispatch Address</p><p className="font-medium">{budget.dispatchAddress}</p></div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Products</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium">Product</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Qty</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Unit Price</th>
                                <th className="px-4 py-2 text-left text-sm font-medium">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budget.products.map(p => (
                                <tr key={p.id} className="border-b">
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">{p.qty}</td>
                                    <td className="px-4 py-2">{Number(p.unitPrice).toFixed(2)}</td>
                                    <td className="px-4 py-2">{(p.qty * p.unitPrice).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cost Summary</h2>
                <div className="max-w-sm ml-auto space-y-2">
                    <div className="flex justify-between"><p>Subtotal:</p><p>{subTotal.toFixed(2)}</p></div>
                    <div className="flex justify-between"><p>Discount ({budget.discount}%):</p><p>-{discountAmount.toFixed(2)}</p></div>
                    <div className="flex justify-between"><p>Freight:</p><p>+{freightTotal.toFixed(2)}</p></div>
                    <div className="flex justify-between"><p>VAT ({budget.vat}%):</p><p>+{vatAmount.toFixed(2)}</p></div>
                    <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2"><p>Grand Total:</p><p>{grandTotal.toFixed(2)}</p></div>
                </div>
            </div>
        </div>
    );
};

export default BudgetView;
