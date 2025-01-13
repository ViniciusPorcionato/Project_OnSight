using OnSight.Application.RealTime.Contracts.Requests;
using OnSight.Application.RealTime.Contracts.Responses;
using OnSight.Application.RealTime.DTOs;
using OnSight.Application.Services.CallAssignmentManagerService;

namespace OnSight.Application.RealTime.Interfaces;

public interface IHubResponses
{
    Task ReceiveFeedback(string message);
    Task ReceiveFeedbackToMe(string message);
    Task ReceiveUnavailabilityAlert(UnavailabilityAlertResponse unavailabilityAlertResponse);
    Task ReceiveAvailableTechnicians(List<TechnicianRealTimeDTO>? availableTechniciansList);
    Task ReceiveConnectedUsers(List<RealTimeConnectedUserDTO>? connectedUsers);
    Task ReceiveSpecificTechnician(GetSpecificTechnicianResponse? availableTechniciansList);
    Task ReceiveSpecificServiceCall(GetSpecificServiceCallResponse? serviceCallDTO);
    Task ReceiveAllTechnicians(List<SpecificTechnicianDTO>? allTechnicians);
    Task ReceiveAllServiceCalls(List<SpecificServiceCallDTO>? allServiceCalls);
    Task ReceiveTechnicianUpdated(TechnicianRealTimeDTO updatedCallerTechnician);
    Task ReceiveTechnicianLocation(TechnicianActualLocationRequest technicianLocation);
}
