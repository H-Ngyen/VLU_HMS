using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain.Interfaces;

public interface INotificationEmailJobService
{
    Task Job(int notificationId, int userId, string toEmail, CancellationToken ct);
}