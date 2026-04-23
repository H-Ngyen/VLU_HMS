namespace Domain.Interfaces;

public interface IBackgroundTaskQueue
{
    void Queue(Func<IServiceProvider, CancellationToken, Task> workItem);
    Task<Func<IServiceProvider, CancellationToken, Task>> DequeueAsync(CancellationToken ct);
}