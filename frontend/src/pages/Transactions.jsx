import React, { useContext } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { AuthContext } from '../contexts/AuthContext';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const isReadOnly = user.role === 'read-only';

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400">Manage your income and expenses</p>
        </div>
        
        {!isReadOnly && <TransactionForm />}
        <TransactionList />
      </div>
    </div>
  );
};

export default Transactions;