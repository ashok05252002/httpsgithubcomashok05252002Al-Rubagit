import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, MessageSquare, Calculator, ShoppingCart,
  Package, Lock, Truck, ArrowDownCircle, ArrowUpCircle,
  Receipt, Archive, X, Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-pink-500' },
    { name: 'Enquiries', href: '/enquiries', icon: MessageSquare, color: 'text-gray-500' },
    { name: 'Budget and Quote', href: '/budgets', icon: Calculator, color: 'text-gray-500' },
    { name: 'Received Orders', href: '/received-orders', icon: ShoppingCart, color: 'text-gray-500' },
    { name: 'Sales Orders', href: '/sales-orders', icon: Package, color: 'text-gray-500' },
    { name: 'Inventory Blocking', href: '/blocking', icon: Lock, color: 'text-gray-500' },
    { name: 'FPO', href: '/fpo', icon: Truck, color: 'text-gray-500' },
    { name: 'Inward', href: '/inward', icon: ArrowDownCircle, color: 'text-gray-500' },
    { name: 'Issuance', href: '/issuance', icon: ArrowUpCircle, color: 'text-gray-500' },
    { name: 'Invoices', href: '/invoices', icon: Receipt, color: 'text-gray-500' },
    { name: 'Inventory Master', href: '/inventory', icon: Archive, color: 'text-gray-500' }
  ];

  const filteredItems = navigationItems.filter(item => {
    // Filter based on user role
    if (user?.role === 'Storekeeper') {
      return ['Dashboard', 'FPO', 'Inward', 'Issuance', 'Inventory Master'].includes(item.name);
    }
    return true; // Sales Executive and Sales Manager see all items
  });

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">Inventory</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = location.pathname === item.href ||
                (item.href !== '/dashboard' && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-blue-700' : `${item.color} group-hover:text-gray-500`}
                  `} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
