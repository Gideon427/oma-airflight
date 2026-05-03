import { notFound } from 'next/navigation';

export default function InvoicePage({ params }) {
  const trackingNumber = params['tracking-code'];
  
  // Mock data - in a real app this would come from your database
  const invoiceData = {
    trackingNumber,
    invoiceNumber: `INV-${trackingNumber.slice(0, 6)}`,
    date: new Date().toLocaleDateString(),
    sender: {
      name: 'John Smith',
      address: '123 Main St, New York, NY 10001',
      phone: '+1 555 123 4567'
    },
    receiver: {
      name: 'Sarah Johnson',
      address: '456 Oak Ave, Los Angeles, CA 90001',
      phone: '+1 555 987 6543'
    },
    packageDetails: {
      description: 'Electronics',
      weight: '2.5 kg',
      dimensions: '30x20x15 cm',
      value: '$250'
    },
    charges: [
      { description: 'Shipping Fee', amount: 15.00 },
      { description: 'Insurance', amount: 5.00 },
      { description: 'Fuel Surcharge', amount: 2.50 }
    ],
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid'
  };

  if (!invoiceData) {
    return notFound();
  }

  const subtotal = invoiceData.charges.reduce((sum, charge) => sum + charge.amount, 0);
  const tax = subtotal * 0.1; // 10% tax for example
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Shipping Invoice</h1>
              <p className="text-blue-100">Invoice #: {invoiceData.invoiceNumber}</p>
              <p className="text-blue-100">Date: {invoiceData.date}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Tracking Number</p>
              <p className="text-2xl font-bold">{invoiceData.trackingNumber}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Sender and Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Sender Information</h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-700">{invoiceData.sender.name}</p>
                <p className="text-gray-600">{invoiceData.sender.address}</p>
                <p className="text-gray-600">{invoiceData.sender.phone}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Receiver Information</h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-700">{invoiceData.receiver.name}</p>
                <p className="text-gray-600">{invoiceData.receiver.address}</p>
                <p className="text-gray-600">{invoiceData.receiver.phone}</p>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Package Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Description</p>
                <p className="font-medium text-gray-800">{invoiceData.packageDetails.description}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Weight</p>
                <p className="font-medium text-gray-800">{invoiceData.packageDetails.weight}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Dimensions</p>
                <p className="font-medium text-gray-800">{invoiceData.packageDetails.dimensions}</p>
              </div>
            </div>
          </div>

          {/* Charges Table */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Charges Breakdown</h2>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceData.charges.map((charge, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{charge.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">${charge.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Subtotal</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Tax (10%)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">${tax.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900 text-right">${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Payment Method</h2>
              <p className="font-medium text-gray-700">{invoiceData.paymentMethod}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Payment Status</h2>
              <p className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                invoiceData.paymentStatus === 'Paid' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {invoiceData.paymentStatus}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Thank you for choosing Oma-Airflight!</p>
              <p className="text-sm text-gray-500">Your trusted shipping partner</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}