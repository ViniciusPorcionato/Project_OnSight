using OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

namespace OnSight.Infra.Data.DAOs.ServiceCallDAO;

public interface IServiceCallDAO
{
    Task<IEnumerable<CallHistoryDTO>> GetTechnicianCallHistory(Guid technicianId);
    Task<CallForMapViewDTO> GetServiceCallByTechniciaId(Guid technicianId);
    Task<CallForMapViewDTO> GetServiceCallForMapById(Guid serviceCallId);
    Task<IEnumerable<CallForMapViewDTO>> GetAllServiceCallsInProgress();
    Task<IEnumerable<OpenedServiceCallDTO>> GetOpenedServiceCalls();
    Task<ServiceCallDetailsDTO> GetOpenedCallDetailsById(Guid serviceCallId);
    Task<ushort> CountServiceCallsOpenedByDate(DateTime dateTime);
    Task<decimal> CountAvarageTimePerServiceCall(DateTime dateTime);
    Task<decimal> CountAvarageTravelTimePerServiceCall(DateTime dateTime);
    Task<decimal> CountRecurringServiceCallRate(DateTime dateTime);
    Task<ServiceCallDetailsDTO> GetServiceCallDetailsById(Guid serviceCallId);
    Task<IEnumerable<OpenedServiceCallDTO>> GetFilteredOpenedCallsListSearchAndFilter(string textToSearch, int serviceTypeId);
    Task<IEnumerable<ServiceCallDTO>> GetCallsSearchAndFilter(string textToSearch, int serviceTypeId);
}
