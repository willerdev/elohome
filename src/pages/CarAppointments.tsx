import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { Car, MapPin, Calendar, Clock, Phone, MessageSquare, X } from 'lucide-react';

const appointments = [
  {
    id: 1,
    carTitle: '2023 Mercedes-Benz G63 AMG',
    price: 'AED 950,000',
    location: 'Dubai Marina',
    date: '2024-03-20',
    time: '14:00',
    seller: 'Premium Motors',
    status: 'upcoming',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80'
  },
  {
    id: 2,
    carTitle: '2022 Porsche 911 GT3',
    price: 'AED 850,000',
    location: 'Al Quoz',
    date: '2024-03-18',
    time: '11:30',
    seller: 'Luxury Cars Dubai',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f371e?auto=format&fit=crop&q=80'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export function CarAppointments() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title="Car Appointments" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Car className="w-6 h-6 text-[#0487b3]" />
          <h1 className="text-2xl font-bold">My Car Appointments</h1>
        </div>

        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="flex">
                <div className="w-48 h-32">
                  <img
                    src={appointment.image}
                    alt={appointment.carTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-medium">{appointment.carTitle}</h3>
                      <p className="text-[#0487b3] font-bold">{appointment.price}</p>
                      <p className="text-sm text-gray-500">{appointment.seller}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  {appointment.status === 'upcoming' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <button className="flex-1 h-10 bg-white border border-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                        <Phone className="w-4 h-4" />
                        <span>Call Seller</span>
                      </button>
                      <button className="flex-1 h-10 bg-white border border-gray-200 text-gray-700 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50">
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                      <button className="h-10 px-4 border border-red-200 text-red-600 rounded-lg flex items-center justify-center gap-2 hover:bg-red-50">
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}