namespace OnSight.Infra.Data.DAOs.TechnicianDAO;

public record TechnicianSearchDTO
(
    Guid technicianId,
    Guid individualPersonId,
    Guid userId,
    string nameTechnician,
    string photoUrlTechnician,
    int technicianStatusId
);