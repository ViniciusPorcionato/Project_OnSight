using Microsoft.AspNetCore.Mvc;
using OnSight.Application.Services.Contracts.Requests;
using OnSight.Application.Services.ServiceCallService;

namespace OnSight.Application.Controllers;

[Route("api/service-call")]
[ApiController]
public class ServiceCallController : ControllerBase
{
    private readonly IServiceCallService _serviceCallService;

    public ServiceCallController(IServiceCallService serviceCallService)
    {
        _serviceCallService = serviceCallService;
    }

    [HttpPost]
    public async Task<IActionResult> RegisterServiceCall([FromBody] RegisterServiceCallRequest request)
    {
        try
        {
            await _serviceCallService.RegisterServiceCall(request);

            return Created();
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpPatch("finish")]
    public async Task<IActionResult> FinishServiceCall([FromQuery] Guid serviceCallId)
    {
        try
        {
            await _serviceCallService.FinishServiceCall(serviceCallId);

            return StatusCode(200);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpPut("attendant-revision")]
    public async Task<IActionResult> AttendantRevisionUpdate(AttendantRevisionUpdateRequest request)
    {
        try
        {
            var response = await _serviceCallService.AttendantRevisionUpdate(request);

            return StatusCode(200, response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet("get-technician-call-history")]
    public async Task<IActionResult> GetTechnicianServiceCallHistory(Guid technicianId)
    {
        try
        {
            var callHistoric = await _serviceCallService.GetCallHistoricByTechnicianId(technicianId);

            return Ok(callHistoric);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }


    [HttpGet("get-opened-service-calls")]
    public async Task<IActionResult> GetOpenedServiceCallsList()
    {
        try
        {
            var openedCallsList = await _serviceCallService.GetOpenedServiceCallsList();

            return Ok(openedCallsList);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet("get-details-service-call")]
    public async Task<IActionResult> GetServiceCallDetailsById(Guid serviceCallId)
    {
        try
        {
            var detailedServiceCall = await _serviceCallService.GetServiceCallDetailsById(serviceCallId);

            return Ok(detailedServiceCall);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("get-current-technician-service-call")]
    public async Task<IActionResult> GetTechnicianCurrentServiceCall(Guid technicianId)
    {
        try
        {
            var currentServiceCall = await _serviceCallService.GetCurrentTechnicianCallById(technicianId);

            return Ok(currentServiceCall);
        }
        catch (Exception error)
        {
            return BadRequest(error.Message);
        }
    }

    [HttpGet("get-opened-calls-search-filter")]
    public async Task<IActionResult> GetOpenedCallsWithSearchAndFilter(string? textToSearch, int serviceTypeId = 2)
    {
        try
        {
            var serviceCallsList = await _serviceCallService.GetFilteredOpenedCallsSearchAndFilter(textToSearch, serviceTypeId);

            return Ok(serviceCallsList);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.ToString());
        }
    }

    [HttpGet("get-calls-search-filter")]
    public async Task<IActionResult> GetServiceCallsListWithSearchAndFilter(string? textToSearch, int serviceTypeId = 2)
    {
        try
        {
            var serviceCallsList = await _serviceCallService.GetServiceCallsSearchAndFilter(textToSearch, serviceTypeId);

            return Ok(serviceCallsList);
        }
        catch (Exception)
        {
            return BadRequest();
        }
    }
}
