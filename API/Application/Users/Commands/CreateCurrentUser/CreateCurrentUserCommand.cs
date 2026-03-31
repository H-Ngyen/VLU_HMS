using MediatR;

namespace Application.Users.Commands.CreateCurrentUser;

public class CreateCurrentUserCommand : IRequest<(int id, bool isNew)>
{
    // public int Id { get; set; }
    // public required int RoleId { get; set; }
    public required string Auth0Id { get; set; }
    public required string Email { get; set; }
    public bool EmailVerify { get; set; }

    public required string Name { get; set; }

    public required string PictureUrl { get; set; }

    // public required DateTime CreateAt { get; set; }
    public required DateTime UpdateAt { get; set; }
}