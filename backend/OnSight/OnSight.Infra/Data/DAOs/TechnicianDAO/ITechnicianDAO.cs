using OnSight.Domain.Entities;
using OnSight.Infra.Data.DAOs.TechnicianDAO;

namespace OnSight.Infra.Data.DAOs.ClientDAO;

public interface ITechnicianDAO
{
    Task<Guid> GetTechnicianIdByUserId(Guid userId);
    Task<IEnumerable<TechnicianSearchDTO>> GetTechniciansWithFilterAndSearch(string textToSearch, int serviceTypeId);
    Task<int> GetTechnicianStatusCodeById(Guid technicianId);
}