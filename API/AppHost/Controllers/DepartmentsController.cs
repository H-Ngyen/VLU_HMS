using Application.Departments.Commands.AssignHeadUserDepartment;
using Application.Departments.Commands.AssignUserToDepartment;
using Application.Departments.Commands.CreateDepartment;
using Application.Departments.Commands.DeleteDepartment;
using Application.Departments.Commands.UnassignHeadUserDepartment;
using Application.Departments.Commands.UnassignUserToDepartment;
using Application.Departments.Commands.UpdateDepartment;
using Application.Departments.Dtos;
using Application.Departments.Queries.GetAllDepartments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AppHost.Controllers;

[ApiController]
[Route("api/departments")]
[Authorize]
public class DepartmentsController(IMediator mediator) : ControllerBase
{
    // [AllowAnonymous]
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<ActionResult<int>> CreateDepartment(CreateDepartmentCommand command)
    {
        var id = await mediator.Send(command);
        return Created("", id);
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    // [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    // [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<DepartmentDto?>> GetAll()
    {
        var departmensDto = await mediator.Send(new GetAllDepartmentQuery());
        return Ok(departmensDto);
    }

    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UpdateDepartment(int id, UpdateDepartmentCommand command)
    {
        command.Id = id;
        await mediator.Send(command);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> DeleteDepartment(int id)
    {
        await mediator.Send(new DeleteDepartmentCommand(id));
        return NoContent();
    }

    [HttpPut("{departmentId:int}/users/{userId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> AddUserToDepartment(int departmentId, int userId)
    {
        await mediator.Send(new AssignUserToDepartmentCommand(departmentId, userId));
        return NoContent();
    }

    [HttpDelete("{departmentId:int}/users/{userId:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UnassignUserToDepartment(int departmentId, int userId)
    {
        await mediator.Send(new UnassignUserToDepartmentCommand(departmentId, userId));
        return NoContent();
    }

    [HttpDelete("{departmentId:int}/users/{userId:int}/head")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> UnassignHeadUserToDepartment(int departmentId, int userId)
    {
        await mediator.Send(new UnassignHeadUserDepartmentCommand(departmentId, userId));
        return NoContent();
    }


    [HttpPut("{departmentId:int}/users/{userId:int}/head")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult> AddHeadUserToDepartment(int departmentId, int userId)
    {
        await mediator.Send(new AssignHeadUserDepartmentCommand(departmentId, userId));
        return NoContent();
    }
}