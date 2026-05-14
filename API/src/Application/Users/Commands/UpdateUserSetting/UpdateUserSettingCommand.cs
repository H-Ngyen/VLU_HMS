using MediatR;

namespace Application.Users.Commands.UpdateUserSetting;

public class UpdateUserSettingCommand(int id) : IRequest
{
    public int Id { get; set; } = id;
    public required bool IsReceivedEmail { get; set; }
}