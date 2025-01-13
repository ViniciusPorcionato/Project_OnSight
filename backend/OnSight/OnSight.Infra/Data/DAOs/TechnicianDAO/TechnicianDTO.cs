namespace OnSight.Infra.Data.DAOs.TechnicianDAO;

public record TechnicianDTO
(
    Guid technicianId,
    int statusId,
    Guid individualPersonId
);
