namespace Domain.Interfaces;

public interface IBackgroundTaskQueue
{
    void Queue(Func<CancellationToken, Task> workItem);
    Task<Func<CancellationToken, Task>> DequeueAsync(CancellationToken ct);
}