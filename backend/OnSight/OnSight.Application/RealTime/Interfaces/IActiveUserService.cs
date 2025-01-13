using OnSight.Application.RealTime.Contracts.Requests;
using OnSight.Application.RealTime.DTOs;
using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Domain.Entities;

namespace OnSight.Application.RealTime.Interfaces;

public interface IActiveUserService
{
    void AddUserToGroupConnections(GroupsName groupName, string connectionId, Guid userId, TechnicianRealTimeDTO technicianRealTimeDTO);
    void RemoveUserFromGroupConnections(Guid userId, GroupsName groupName);
    IEnumerable<RealTimeConnectedUserDTO>? GetActiveGroupConnections(GroupsName groupName);
    bool VerifyIfAlreadyConnectedInGroupConnections(Guid userId);
    void UpdateUserConnectionId(Guid userId, GroupsName userGroupName, string newConnectionId);
    RealTimeConnectedUserDTO? ChangeTechnicianStatusInGroupConnections(Guid technicianId, TechnicianStatus technicianStatus);
    void UpdateTechnicianLocationInGroupConnections(TechnicianActualLocationRequest technicianLocation);
    RealTimeConnectedUserDTO? GetTechnicianByIdFromGroupConnections(Guid technicianId);
}