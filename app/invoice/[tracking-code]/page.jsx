'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { notFound } from 'next/navigation';

export default function InvoicePage() {
  const params = useParams();
  const trackingNumber = params['tracking-code'];   // Matches your folder name

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      if (!trackingNumber) {
        setError('No tracking number provided');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, 'shipments'),
          where('trackingNumber', '==', trackingNumber)
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError('Shipment not found');
        } else {
          querySnapshot.forEach((doc) => {
            setShipment({ id: doc.id, ...doc.data() });
          });
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [trackingNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !shipment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invoice Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'No shipment found with this tracking number'}</p>
          <a href="/track" className="btn btn-primary">
            Back to Tracking
          </a>
        </div>
      </div>
    );
  }

  // Calculate totals
  const charges = [
    { description: 'Shipping Fee', amount: 15.00 },
    { description: 'Insurance', amount: 5.00 },
    { description: 'Fuel Surcharge', amount: 2.50 },
  ];

  const subtotal = charges.reduce((sum, charge) => sum + charge.amount, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Shipping Invoice</h1>
              <p className="text-blue-100">Invoice #: INV-{trackingNumber.slice(0, 6)}</p>
              <p className="text-blue-100">
                Date: {new Date(shipment.createdAt || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Tracking Number</p>
              <p className="text-2xl font-bold">{trackingNumber}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Sender & Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Sender Information</h2>
              <p className="font-medium">{shipment.sender?.name}</p>
              <p className="text-gray-600">{shipment.sender?.address}</p>
              <p className="text-gray-600">{shipment.sender?.phone}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Receiver Information</h2>
              <p className="font-medium">{shipment.receiver?.name}</p>
              <p className="text-gray-600">{shipment.receiver?.address}</p>
              <p className="text-gray-600">{shipment.receiver?.phone}</p>
            </div>
          </div>

          {/* Package Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Package Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{shipment.package?.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Weight</p>
                <p className="font-medium">{shipment.package?.weight} kg</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dimensions</p>
                <p className="font-medium">
                  {shipment.package?.dimensions?.length} × 
                  {shipment.package?.dimensions?.width} × 
                  {shipment.package?.dimensions?.height} cm
                </p>
              </div>
            </div>
          </div>

          {/* Charges */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Charges Breakdown</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">Description</th>
                    <th className="px-6 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {charges.map((charge, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">{charge.description}</td>
                      <td className="px-6 py-4 text-right">${charge.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-6 py-4">Subtotal</td>
                    <td className="px-6 py-4 text-right">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-6 py-4">Tax (10%)</td>
                    <td className="px-6 py-4 text-right">${tax.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-blue-50 font-bold text-lg">
                    <td className="px-6 py-4">Total</td>
                    <td className="px-6 py-4 text-right">${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-600">Thank you for choosing our service!</p>
            </div>
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Print Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}