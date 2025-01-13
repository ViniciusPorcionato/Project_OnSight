using OnSight.Application.RealTime.DTOs;

namespace OnSight.Application.RealTime.Contracts.Responses;
public record GetSpecificServiceCallResponse (
    SpecificServiceCallDTO serviceCall,
    SpecificTechnicianDTO? assignedTechnician
);