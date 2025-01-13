namespace OnSight.Application.RealTime.Interfaces;

public interface ITechnician
{
    Task ChangeTechnicianStatus(Guid technicianId, int technicianNewStatusId);
}
