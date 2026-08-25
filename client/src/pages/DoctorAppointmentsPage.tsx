import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AppointmentStatusBadge = ({ status }: { status: number }) => {
  switch (status) {
    case 0:
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Chờ khám</Badge>;
    case 1:
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">Đã xác nhận</Badge>;
    case 2:
      return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Đã hoàn thành</Badge>;
    case 3:
      return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Đã hủy</Badge>;
    case 4:
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Không đến</Badge>;
    default:
      return <Badge variant="secondary">Không xác định</Badge>;
  }
};

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await api.appointments.getMyAppointments();
      setAppointments(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId: number, newStatus: string) => {
    try {
      const statusInt = parseInt(newStatus, 10);
      await api.appointments.updateStatus(appointmentId, statusInt);
      toast.success("Cập nhật trạng thái thành công");
      // Update local state to reflect change immediately
      setAppointments(appointments.map(a => 
        a.id === appointmentId ? { ...a, status: statusInt } : a
      ));
    } catch (error: any) {
      toast.error(error.message || "Không thể cập nhật trạng thái");
      // Re-fetch to ensure consistency on error
      fetchAppointments();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Lịch khám của tôi</h2>
          <p className="text-gray-500">Quản lý lịch hẹn khám bệnh của bác sĩ</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch hẹn</CardTitle>
          <CardDescription>Hiển thị các lịch hẹn đặt trước của bệnh nhân.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-vlu-red" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              Chưa có lịch hẹn nào.
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã LH</TableHead>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Lý do khám</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Cập nhật trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell className="font-medium">#{appointment.id}</TableCell>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell className="max-w-xs truncate" title={appointment.reason}>{appointment.reason}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {format(new Date(appointment.appointmentDate), 'dd/MM/yyyy')}
                          </span>
                          <span className="text-xs text-gray-500">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <AppointmentStatusBadge status={appointment.status} />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={appointment.status.toString()} 
                          onValueChange={(val) => handleStatusChange(appointment.id, val)}
                        >
                          <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Chờ khám</SelectItem>
                            <SelectItem value="1">Đã xác nhận</SelectItem>
                            <SelectItem value="2">Đã hoàn thành</SelectItem>
                            <SelectItem value="3">Đã hủy</SelectItem>
                            <SelectItem value="4">Không đến</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAppointmentsPage;
