namespace Domain.Constants;

public record QueueItem(string Key, Func<IServiceProvider, CancellationToken, Task> Work);
