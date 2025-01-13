using OnSight.Application.RealTime.DTOs;

namespace OnSight.Application.RealTime.Contracts.Responses;

public record GetSpecificTechnicianResponse (
    SpecificTechnicianDTO technician,
    SpecificServiceCallDTO? assignedServiceCall
);