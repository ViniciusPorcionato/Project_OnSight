using Microsoft.AspNetCore.Mvc;
using OnSight.Application.Services;
using OnSight.Application.Services.Contracts.Requests;
using OnSight.Application.Services.Contracts.Responses;
using OnSight.Infra.Data.UnityOfWork;

namespace OnSight.Application.Controllers;

[Route("api/user")]
[ApiController]
public class UserController(IUserService userService, IUnityOfWork unityOfWork) : ControllerBase
{
    private readonly IUserService _userService = userService;
    private readonly IUnityOfWork _unityOfWork = unityOfWork;


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            var response = await _userService.Login(request);

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet("get-all-clients")]
    public async Task<IActionResult> GetAllClients()
    {
        try
        {
            var allClients = await _userService.GetAllClients();

            return Ok(allClients);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("get-client-by-id")]
    public async Task<IActionResult> GetClientById(Guid clientId)
    {
        try
        {
            ClientDetailsResponse clientSearched = await _userService.GetClientDetailsById(clientId);

            return Ok(clientSearched);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }

    }

    [HttpPost("individual-person")]
    public async Task<IActionResult> RegisterIndividualPerson([FromForm] RegisterIndividualPersonRequest request)
    {
        try
        {
            var response = await _userService.RegisterIndividualPerson(request);

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpPost("client")]
    public async Task<IActionResult> RegisterClient([FromForm] RegisterClientRequest request)
    {
        try
        {
            var response = await _userService.RegisterClient(request);

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpPost("technician/register-unavaliability")]
    public async Task<IActionResult> RegisterUnavaliability([FromBody] RegisterUnavaliabilityRequest request)
    {
        try
        {
            var unavailability = await _userService.RegisterUnavaliability(request);

            return Ok(unavailability);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("technician/{technicianId:Guid}/status")]
    public async Task<IActionResult> GetTechnicianStatusCodeById(Guid technicianId)
    {
        try
        {
            int statusCode = await _userService.GetTechnicianStatusCodeById(technicianId);
            return Ok(statusCode);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("get-users-by-type")]
    public async Task<IActionResult> GetUsersByType(int userTypeId)
    {
        try
        {
            var personsResponses = await _userService.GetIndividualPersonsByType(userTypeId);

            return Ok(personsResponses);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("get-user-by-id")]
    public async Task<IActionResult> GetIndividualPersonById(Guid individualPersonId)
    {
        try
        {
            IndividualPersonDetailsResponse personResponse = await _userService.GetIndividualPersonById(individualPersonId);

            return Ok(personResponse);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("get-technician-filtered-searched")]
    public async Task<IActionResult> GetTechniciansListByFilterAndSearch(string? textToSearch, int technicianStatusId = 0)
    {
        try
        {
            var techniciansLists = await _userService.GetTechniciansByFilterAndSearch(textToSearch, technicianStatusId);

            return Ok(techniciansLists);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }


    [HttpDelete("delete-user-by-id")]
    public async Task<IActionResult> DeleteUserByID(Guid idUserToDelete)
    {
        try
        {
            await _userService.RemoveClientById(idUserToDelete);
            await _unityOfWork.Commit();

            return Ok("Usuário deletado com sucesso!");
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }
}
