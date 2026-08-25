import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User as UserIcon, CalendarPlus, Loader2 } from "lucide-react";

interface Appointment {
  id: number;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  doctorName: string;
  status: number;
}

export default function PatientDashboardPage() {
  const { currentUser } = useAuth();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [bookingDate, setBookingDate] = useState("");
  const [bookingReason, setBookingReason] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.appointments.getMyAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");
    
    if (!bookingDate || !bookingReason) {
      setBookingError("Vui lòng điền đầy đủ ngày và lý do khám.");
      return;
    }

    // Ensure selected date is not in the past
    const selectedDate = new Date(bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setBookingError("Vui lòng chọn ngày khám trong tương lai.");
      return;
    }

    try {
      setBookingLoading(true);
      await api.appointments.book({
        date: new Date(bookingDate).toISOString(),
        reason: bookingReason
      });
      
      setBookingSuccess("Đăng ký khám bệnh thành công! Hệ thống đã xếp lịch ngẫu nhiên cho bạn.");
      setBookingDate("");
      setBookingReason("");
      
      // Refresh list
      await fetchAppointments();
    } catch (err: any) {
      setBookingError(err.message || "Đã xảy ra lỗi khi đăng ký lịch khám.");
    } finally {
      setBookingLoading(false);
    }
  };

  const formatTime = (timeSpan: string) => {
    return timeSpan.substring(0, 5); // Returns HH:MM from HH:MM:SS
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0: return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Chờ khám</span>;
      case 1: return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Đang khám</span>;
      case 2: return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Đã khám xong</span>;
      case 3: return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Đã hủy</span>;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Xin chào, {currentUser?.name}!</h1>
        <p className="text-gray-600">Chào mừng bạn đến với Cổng thông tin Bệnh nhân.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Booking Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CalendarPlus className="text-vlu-red" />
              Đăng ký khám bệnh
            </h2>
            
            <form onSubmit={handleBookAppointment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày khám mong muốn
                </label>
                <Input 
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do khám / Triệu chứng
                </label>
                <Textarea 
                  placeholder="Ví dụ: Đau đầu, sốt nhẹ, cần khám tổng quát..."
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  className="w-full h-24 resize-none"
                />
              </div>

              {bookingError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md">
                  {bookingError}
                </div>
              )}

              {bookingSuccess && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-700 text-sm rounded-md">
                  {bookingSuccess}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-vlu-red hover:bg-red-700 text-white font-medium"
                disabled={bookingLoading}
              >
                {bookingLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...</>
                ) : "Xác nhận đăng ký"}
              </Button>
            </form>
          </div>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="text-vlu-red" />
              Lịch khám của bạn
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có lịch khám nào</h3>
                <p className="text-gray-500">Hãy sử dụng form bên cạnh để đăng ký khám bệnh.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments
                  .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
                  .map((apt) => (
                  <div key={apt.id} className="p-5 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-vlu-red font-semibold bg-red-50 px-3 py-1.5 rounded-md">
                            <Calendar className="w-4 h-4" />
                            {new Date(apt.appointmentDate).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-700 font-medium bg-gray-200 px-3 py-1.5 rounded-md">
                            <Clock className="w-4 h-4" />
                            {formatTime(apt.startTime)} - {formatTime(apt.endTime)}
                          </div>
                          {getStatusBadge(apt.status)}
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-700">
                          <UserIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Bác sĩ:</span> {apt.doctorName}
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500 font-medium uppercase tracking-wider block mb-1">Lý do khám</span>
                          <p className="text-gray-800 bg-white p-3 rounded-md border border-gray-100 text-sm">{apt.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
