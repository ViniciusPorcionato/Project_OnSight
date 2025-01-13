using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Application.Services.Contracts.Requests;
using OnSight.Application.Services.ServiceCallService.Contracts.Responses;
using OnSight.Domain.Entities;
using OnSight.Infra.Data.DAOs.ServiceCallDAO;
using OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

namespace OnSight.Application.Services.ServiceCallService;

public interface IServiceCallService
{
    Task RegisterServiceCall(RegisterServiceCallRequest request);
    Task FinishServiceCall(Guid serviceCallId);
    Task<TechnicianSelectedForDTO> AttendantRevisionUpdate(AttendantRevisionUpdateRequest request);
    Task ReassignTechnicianToCall(Guid serviceCallId);
    Task<IEnumerable<ServiceCallHistoryResponse>> GetCallHistoricByTechnicianId(Guid technicianId);
    Task<IEnumerable<OpenedServiceCallResponse>> GetOpenedServiceCallsList();
    Task<DetailsServiceCallResponse> GetServiceCallDetailsById(Guid idServiceCall);
    Task<DetailsServiceCallResponse> GetCurrentTechnicianCallById(Guid technicianId);
    Task<IEnumerable<OpenedServiceCallDTO>> GetFilteredOpenedCallsSearchAndFilter(string? textToSearch, int serviceTypeId = 2);
    Task<IEnumerable<ServiceCallsListResponse>> GetServiceCallsSearchAndFilter(string? textToSearch, int serviceTypeId = 2);
}