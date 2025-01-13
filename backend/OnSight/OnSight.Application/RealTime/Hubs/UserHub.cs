using Microsoft.AspNetCore.SignalR;
using OnSight.Application.RealTime.Contracts.Requests;
using OnSight.Application.RealTime.Contracts.Responses;
using OnSight.Application.RealTime.DTOs;
using OnSight.Application.RealTime.Interfaces;
using OnSight.Application.Services.CallAssignmentManagerService;

namespace OnSight.Application.RealTime.Hubs;

public class UserHub : Hub<IHubResponses>
{
    private readonly IActiveUserService _activeUserService;

    public UserHub(IActiveUserService activeUserService)
    {
        _activeUserService = activeUserService;
    }

    public async Task<GroupsName> JoinGroup(JoinGroupRequest joinGroupRequest)
    {
        try
        {
            string callerConnectionId = Context.ConnectionId;

            if (callerConnectionId == null)
                throw new Exception("O ConnectionId do usuário está null.");

            if (IsUserAlreadyConnected(joinGroupRequest.userId))
            {
                _activeUserService.UpdateUserConnectionId(joinGroupRequest.userId, joinGroupRequest.groupName, callerConnectionId);
            }

            // Garante que o ConnectionId não será duplicado no SignalR
            var existingUser = _activeUserService.GetActiveGroupConnections(joinGroupRequest.groupName)?
                .FirstOrDefault(u => u.connectionId == callerConnectionId);

            // Insere a ConnectionId ao Group do Signalr
            if (existingUser == null)
                await Groups.AddToGroupAsync(callerConnectionId, joinGroupRequest.groupName.ToString());

            // Insere o User ao Grupo de Conexões personalizado e gerenciável
            _activeUserService.AddUserToGroupConnections(joinGroupRequest.groupName, callerConnectionId, joinGroupRequest.userId, joinGroupRequest.technicianRealTimeDTO!);

            return joinGroupRequest.groupName;
        }
        catch (Exception)
        {
            throw;
        }
    }

    public async Task ExitGroup(JoinGroupRequest joinGroupRequest)
    {
        try
        {
            string callerConnectionId = Context.ConnectionId;

            if (callerConnectionId == null)
                throw new Exception("O ConnectionId do usuário está null.");

            if (!IsUserAlreadyConnected(joinGroupRequest.userId))
                throw new InvalidOperationException("O usuário não está conectado.");

            // Remove o connectionId do Group do SignalR
            await Groups.RemoveFromGroupAsync(callerConnectionId, joinGroupRequest.groupName.ToString());

            // Remove-o do Grupo de Conexões personalizado e gerenciável
            _activeUserService.RemoveUserFromGroupConnections(joinGroupRequest.userId, joinGroupRequest.groupName);
        }
        catch (Exception)
        {
            throw;
        }
    }

    public GroupsName? GetGroupName(int userTypeId)
    {
        try
        {
            switch (userTypeId)
            {
                case 0 or 1:
                    return GroupsName.InternalUsers;
                case 2:
                    return GroupsName.Technicians;
                default:
                    return null;
            }
        }
        catch (Exception)
        {
            throw;
        }
    }

    public bool IsUserAlreadyConnected(Guid userId)
    {
        return _activeUserService.VerifyIfAlreadyConnectedInGroupConnections(userId);
    }

    public List<RealTimeConnectedUserDTO> ListGroupActiveConnections(GroupsName groupName)
    {
        var activeConnections = _activeUserService.GetActiveGroupConnections(groupName);
        return activeConnections is null ? [] : activeConnections!.ToList();
    }

    protected Task SendUpdatedTechniciansList(List<TechnicianRealTimeDTO> techniciansDTO)
        => Clients.Group(GroupsName.InternalUsers.ToString()).ReceiveAvailableTechnicians(techniciansDTO);

    protected Task NotifyUser(NotificationType notificationType, string message)
        => Clients.Caller.ReceiveFeedback($"[{notificationType}]: {message}");

    protected Task NotifyUnavailabilityToInternalUsers(UnavailabilityAlertResponse unavailabilityAlertResponse)
        => Clients.Group(GroupsName.InternalUsers.ToString()).ReceiveUnavailabilityAlert(unavailabilityAlertResponse);

    protected Task NotifyTechnicianByConnectionId(string connectionId, string message)
        => Clients.Client(connectionId).ReceiveFeedbackToMe(message);

    protected async Task ReceiveAvailableTechnicians(List<TechnicianRealTimeDTO>? availableTechniciansList)
        => await Clients.Caller.ReceiveAvailableTechnicians(availableTechniciansList);

    protected async Task SendSpecificTechnician(GetSpecificTechnicianResponse? technicianResponse)
       => await Clients.Caller.ReceiveSpecificTechnician(technicianResponse);

    protected async Task SendSpecificServiceCall(GetSpecificServiceCallResponse? serviceCallResponse)
     => await Clients.Caller.ReceiveSpecificServiceCall(serviceCallResponse);

    protected async Task SendAllTechnicians(List<SpecificTechnicianDTO>? allTechnicians)
      => await Clients.Group(GroupsName.InternalUsers.ToString()).ReceiveAllTechnicians(allTechnicians);

    protected async Task SendAllServiceCalls(List<SpecificServiceCallDTO>? allServiceCalls)
      => await Clients.Group(GroupsName.InternalUsers.ToString()).ReceiveAllServiceCalls(allServiceCalls);

    protected async Task SendAvailableTechnicians(List<TechnicianRealTimeDTO>? availableTechniciansList)
        => await Clients.Group(GroupsName.InternalUsers.ToString()).ReceiveAvailableTechnicians(availableTechniciansList);

    protected Task SendConnectedUsers(List<RealTimeConnectedUserDTO>? connectedUsers)
        => Clients.Group(GroupsName.InternalUsers.ToString()).ReceiveConnectedUsers(connectedUsers);

    protected async Task SendTechnicianLocation(TechnicianActualLocationRequest technicianLocation)
        => await Clients.Group(GroupsName.InternalUsers.ToString()).ReceiveTechnicianLocation(technicianLocation);

    protected async Task SendTechnicianUpdated(TechnicianRealTimeDTO updatedCallerTechnician)
        => await Clients.Caller.ReceiveTechnicianUpdated(updatedCallerTechnician);
}

public enum NotificationType
{
    Success,
    Error,
    Info,
    Warning
}
