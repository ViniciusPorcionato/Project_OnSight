using OnSight.Infra.Data.DAOs.IndividualPerson;
using OnSight.Infra.Data.DAOs.ServiceCallDAO.DTOs;

namespace OnSight.Infra.Data.DAOs.IndividualPersonDAO;

public interface IIndividualPersonDAO
{
    Task<BasicIndividualPersonDTO> GetIndividualPersonByUserId(Guid userId);

    Task<IEnumerable<IndividualPersonListDTO>> GetIndividualPersonsByType(int userTypeId);
    Task<IndividualPersonDetailsDTO> GetIndividualPersonById(Guid idIndividualPerson);
    Task<CurrentServiceCallDTO> GetServiceCallIdByTechnicianId(Guid technicianId);
}