import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, MapPin, PackageCheck } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackModalProps {
  onClose: () => void;
  recentOrder?: Order | null;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({ onClose, recentOrder }) => {
  const [orderIdInput, setOrderIdInput] = useState(recentOrder ? recentOrder.orderId : 'SSS-89241');
  const [foundOrder, setFoundOrder] = useState<any>(recentOrder || null);
  const [searched, setSearched] = useState(!!recentOrder);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    if (recentOrder && orderIdInput.trim() === recentOrder.orderId) {
      setFoundOrder(recentOrder);
    } else {
      // Mock demo tracking result
      setFoundOrder({
        orderId: orderIdInput.toUpperCase(),
        trackingId: 'IN-EXP-' + Math.floor(10000000 + Math.random() * 90000000),
        status: 'DISPATCHED_IN_TRANSIT',
        item: 'SEARCH, SOCIAL & SYSTEMS (Printed Edition)',
        amount: 799,
        estimatedDelivery: 'In 2-3 Business Days',
        carrier: 'BlueDart Express / India Post Air',
        timeline: [
          { step: 'Order Placed & Verified', done: true, date: 'Today, 09:30 AM' },
          { step: 'Packed & Companion Blueprint Assigned', done: true, date: 'Today, 11:15 AM' },
          { step: 'In Transit with Express Courier', done: true, date: 'Today, 02:45 PM' },
          { step: 'Out for Delivery to Your Address', done: false, date: 'Pending' }
        ]
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-900 font-serif flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-600" /> Track Your Order
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            Enter your Order ID (e.g. SSS-89241) to view real-time courier status.
          </p>
        </div>

        <form onSubmit={handleLookup} className="flex gap-2 text-xs">
          <input
            type="text"
            required
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="Order ID e.g. SSS-89241"
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase font-bold"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold font-mono rounded-xl transition-colors flex items-center gap-1.5 shadow-md"
          >
            <Search className="w-4 h-4" /> Track
          </button>
        </form>

        {searched && foundOrder && (
          <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs font-mono shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-[10px] text-slate-500">Order ID</div>
                <div className="text-blue-700 font-bold text-sm">{foundOrder.orderId}</div>
              </div>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-[10px] uppercase font-bold">
                IN TRANSIT
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Tracking ID:</span>
                <span className="text-slate-900 font-bold">{foundOrder.trackingId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Est. Delivery:</span>
                <span className="text-emerald-700 font-bold">{foundOrder.estimatedDelivery || '2-3 Days'}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 space-y-2">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Delivery Progress Timeline:</div>
              <div className="space-y-2">
                {foundOrder.timeline ? (
                  foundOrder.timeline.map((step: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <span className={`flex items-center gap-1.5 ${step.done ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                        <CheckCircle2 className={`w-3.5 h-3.5 ${step.done ? 'text-emerald-600' : 'text-slate-300'}`} />
                        {step.step}
                      </span>
                      <span className="text-[10px] text-slate-400">{step.date}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-600">Dispatched via BlueDart Express across India.</div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
