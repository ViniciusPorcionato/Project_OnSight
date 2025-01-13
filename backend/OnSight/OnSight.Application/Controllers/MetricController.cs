using Microsoft.AspNetCore.Mvc;
using OnSight.Application.Services.Contracts.Requests;
using OnSight.Application.Services.MetricService;
using OnSight.Application.Services.ServiceCallService;

namespace OnSight.Application.Controllers;

[Route("api/metrics")]
[ApiController]
public class MetricController : ControllerBase
{
    private readonly IMetricService _metricService;

    public MetricController(IMetricService metricService)
    {
        _metricService = metricService;
    }

    [HttpPost("category")]
    public async Task<IActionResult> RegisterMetricCategory([FromBody] RegisterMetricCategoryRequest request)
    {
        try
        {
            await _metricService.RegisterMetricCategory(request);

            return Created();
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet]
    public async Task<IActionResult> ListMostRecentMetrics()
    {
        try
        {
            var response = await _metricService.ListMostRecentMetrics();

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }

    [HttpGet("category")]
    public async Task<IActionResult> ListMetricGraphDataByCategory(Guid metricCategory)
    {
        try
        {
            var response = await _metricService.ListMetricGraphDataByCategory(metricCategory);

            return Ok(response);
        }
        catch (Exception error)
        {
            return BadRequest(error.ToString());
        }
    }
}
