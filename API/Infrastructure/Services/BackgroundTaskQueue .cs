using System.Collections.Concurrent;
using System.Threading.Channels;
using Domain.Constants;
using Domain.Interfaces;

namespace Infrastructure.Services;

public class BackgroundTaskQueue : IBackgroundTaskQueue
{
    private readonly Channel<QueueItem> _queue = Channel.CreateUnbounded<QueueItem>();
    private ConcurrentDictionary<string, byte> _locks = new();

    public void Queue(QueueItem item)
    {
        if (item == null)
            throw new ArgumentNullException(nameof(item));

        if (!_locks.TryAdd(item.Key, 0)) return;
        if (!_queue.Writer.TryWrite(item))
        {
            _locks.TryRemove(item.Key, out _);
            return;
        }
    }

    public async Task<QueueItem> DequeueAsync(CancellationToken ct)
    {
        return await _queue.Reader.ReadAsync(ct);
    }

    public void Release(string key)
    {
        _locks.TryRemove(key, out _);
    }
}