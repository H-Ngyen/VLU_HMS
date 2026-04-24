using Domain.Constants;

namespace Domain.Interfaces;

public interface IBackgroundTaskQueue
{
    void Queue(QueueItem item);
    Task<QueueItem> DequeueAsync(CancellationToken ct);
    public void Release(string key);
}