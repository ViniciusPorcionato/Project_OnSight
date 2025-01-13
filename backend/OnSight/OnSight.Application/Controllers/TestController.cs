using Microsoft.AspNetCore.Mvc;
using OnSight.Application.RealTime.Contracts.Requests;
using OnSight.Application.RealTime.Interfaces;
using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Domain.Respositories;
using OnSight.Infra.Data.DAOs.ServiceCallDAO;
using OnSight.Infra.Geolocation;

namespace OnSight.Application.Controllers;

[Route("api/test")]
[ApiController]
public class TestController : ControllerBase
{
    private readonly IGeolocationProvider _geolocationProvider;
    private readonly ICepInterpreterProvider _cepInterpreterProvider;

    private readonly ICallAssignmentManagerService _callAssignmentManagerService;
    private readonly IActiveUserService _activeUserService;

    private readonly IServiceCallRepository _serviceCallRepository;
    private readonly IUserRepository _userRepository;

    private readonly IServiceCallDAO _serviceCallDAO;

    public TestController(IGeolocationProvider geolocationProvider, ICepInterpreterProvider cepInterpreterProvider, ICallAssignmentManagerService callAssignmentManagerService, IActiveUserService activeUserService, IServiceCallRepository serviceCallRepository, IUserRepository userRepository, IServiceCallDAO serviceCallDAO)
    {
        _geolocationProvider = geolocationProvider;
        _cepInterpreterProvider = cepInterpreterProvider;

        _callAssignmentManagerService = callAssignmentManagerService;
        _activeUserService = activeUserService;

        _serviceCallRepository = serviceCallRepository;
        _userRepository = userRepository;

        _serviceCallDAO = serviceCallDAO;
    }

    /*[HttpGet("distance")]*/
    /*public async Task<IActionResult> GetDistance()*/
    /*{*/
    /*    try*/
    /*    {*/
    /*        var response = await _geolocationProvider.GetDistanceBetweenPlaces(*/
    /*            origin: "-23.64493270530046, -46.428316116018934",*/
    /*            destination: "Av. Winston Churchill, 1502 - Rudge Ramos, São Bernardo do Campo - SP, 09614-000"*/
    /*        );*/
    /**/
    /*        return Ok(response);*/
    /*    }*/
    /*    catch (Exception error)*/
    /*    {*/
    /*        return BadRequest(error.ToString());*/
    /*    }*/
    /*}*/
    /**/

    [HttpGet("address")]
    public async Task<IActionResult> GetAddress()
    {
        try
        {
            var response = await _cepInterpreterProvider.GetAddressFromCep(
                cep: "09321270"
            );

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }


    [HttpGet("distance")]
    public async Task<IActionResult> GetDistances()
    {
        try
        {
            var call = await _serviceCallRepository.GetServiceCallById(Guid.Parse("5039aeaa-ad61-44e1-8966-d98ee7f8326b"));

            var technician1 = await _userRepository.GetTechnicianById(Guid.Parse("662b89d2-95ae-4c3d-b151-2b5cac8422a6"));
            var technician2 = await _userRepository.GetTechnicianById(Guid.Parse("7dcfa8d7-91a8-446d-ba0b-eae404fe3de8"));

            TechnicianRealTimeDTO[] avaliableTechnicians = {
                new TechnicianRealTimeDTO(
                    technician1,
                    latitude: -23.657170,
                    longitude: -46.492730
                ),
                new TechnicianRealTimeDTO(
                    technician2,
                    latitude: -23.680787979518122,
                    longitude: -46.449583258856585
                )
            };

            var response = await _callAssignmentManagerService.AttributeServiceCallForTechnician(call, avaliableTechnicians);

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet("get-connected-technicias")]
    public async Task<IActionResult> GetConnectedTechnicians()
    {
        try
        {
            var response = _activeUserService.GetActiveGroupConnections(GroupsName.Technicians);

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet("get-geocoding-by-address")]
    public async Task<IActionResult> GetConnectedTechnicians(string address)
    {
        try
        {
            var response = await _geolocationProvider.GetGeocodingLocationByAddress(address);

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet("get-call-data-by-technician-id")]
    public async Task<IActionResult> GetCallDataByTechnician()
    {
        try
        {
            var response = await _serviceCallDAO.GetServiceCallByTechniciaId(Guid.Parse("243f00bf-e545-469a-b5d1-710e9c943ac4"));

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }
}
