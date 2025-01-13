using OnSight.Application.RealTime.Contracts.Requests;
using OnSight.Application.RealTime.DTOs;
using OnSight.Application.RealTime.Interfaces;
using OnSight.Application.Services.CallAssignmentManagerService;
using OnSight.Domain.Entities;
using System.Collections.Concurrent;

namespace OnSight.Application.RealTime;

public class ActiveUserService : IActiveUserService
{
    // Gerenciamento de Conexões ativas
    private static readonly ConcurrentDictionary<GroupsName, HashSet<RealTimeConnectedUserDTO>> GroupConnections = new();

    public void AddUserToGroupConnections(GroupsName groupName, string connectionId, Guid userId, TechnicianRealTimeDTO technicianRealTimeDTO)
    {
        // Se a chave existir recebe-a, senão, cria uma nova chave
        var group = GroupConnections.GetOrAdd(groupName, new HashSet<RealTimeConnectedUserDTO>());

        lock (group)
        {
            // Verifica se o ConnectionId já existe
            if (group.Any(u => u.connectionId == connectionId))
                return;

            group.Add(new RealTimeConnectedUserDTO(connectionId, userId, technicianRealTimeDTO));
        }
    }

    public void RemoveUserFromGroupConnections(Guid userId, GroupsName groupName)
    {
        if (!GroupConnections.TryGetValue(groupName, out var users) || users == null)
            throw new InvalidOperationException("O Grupo de conexões do usuário está vazio.");

        lock (users)
        {
            var userToDelete = users.FirstOrDefault(t => t.userId == userId);

            if (userToDelete == null)
                throw new KeyNotFoundException("Técnico não encontrado no Grupo de conexões.");

            users.Remove(userToDelete!);
        }
    }

    public IEnumerable<RealTimeConnectedUserDTO>? GetActiveGroupConnections(GroupsName groupName)
    {
        GroupConnections.TryGetValue(groupName, out var users);

        return users;
    }

    public bool VerifyIfAlreadyConnectedInGroupConnections(Guid userId)
    {
        var userAlreadyConnected = GroupConnections.Values
            .Any(group => group.Any(u => u.userId == userId));

        return userAlreadyConnected;
    }

    public void UpdateUserConnectionId(Guid userId, GroupsName userGroupName, string newConnectionId)
    {
        if (!GroupConnections.TryGetValue(userGroupName, out var users) || users == null)
            throw new InvalidOperationException("O Grupo de conexões do usuário está vazio.");

        lock (users)
        {
            var userFromConnectionsGroup = users.FirstOrDefault(user => user.userId == userId);

            if (userFromConnectionsGroup == null)
                throw new KeyNotFoundException("Técnico não encontrado no Grupo de conexões.");

            var updatedUser = userFromConnectionsGroup with
            {
                connectionId = newConnectionId
            };

            users.Remove(userFromConnectionsGroup!);
            users.Add(updatedUser);
            return;
        }
        throw new KeyNotFoundException("Usuário não encontrado em nenhum grupo.");
    }

    public RealTimeConnectedUserDTO? GetTechnicianByIdFromGroupConnections(Guid technicianId)
    {
        if (!GroupConnections.TryGetValue(GroupsName.Technicians, out var technicians) || technicians == null)
            throw new InvalidOperationException("O Grupo de conexões de técnicos está vazio.");

        lock (technicians)
        {
            RealTimeConnectedUserDTO? searchedTechnician = technicians.FirstOrDefault(t => t.technicianRealTimeDTO!.technician.Id == technicianId);

            if (searchedTechnician == null)
                throw new KeyNotFoundException("Técnico não encontrado no Grupo de conexões.");

            return searchedTechnician;
        }
    }

    public RealTimeConnectedUserDTO? ChangeTechnicianStatusInGroupConnections(Guid technicianId, TechnicianStatus technicianStatus)
    {
        // Se não encontrar ou se for nulo, retorna null
        if (!GroupConnections.TryGetValue(GroupsName.Technicians, out var technicians) || technicians == null)
            return null;

        lock (technicians)
        {
            RealTimeConnectedUserDTO? searchedTechnician = technicians.FirstOrDefault(t => t.technicianRealTimeDTO!.technician.Id == technicianId);

            if (searchedTechnician == null)
                return null;

            searchedTechnician.technicianRealTimeDTO!.technician.Status = technicianStatus;

            return searchedTechnician;
        }
    }

    public void UpdateTechnicianLocationInGroupConnections(TechnicianActualLocationRequest technicianLocationRequest)
    {
        if (!GroupConnections.TryGetValue(GroupsName.Technicians, out var technicians) || technicians == null)
            throw new InvalidOperationException("O Grupo de conexões de técnicos está vazio.");

        lock (technicians)
        {
            var searchedTechnician = technicians.FirstOrDefault(t => t.technicianRealTimeDTO!.technician.Id == technicianLocationRequest.idTechnician);

            if (searchedTechnician == null)
                throw new KeyNotFoundException("Técnico não encontrado no Grupo de conexões.");

            // Cria uma cópia do objeto com modificações
            var updatedTechnicianDTO = searchedTechnician with
            {
                technicianRealTimeDTO = new TechnicianRealTimeDTO(
                    searchedTechnician.technicianRealTimeDTO!.technician,
                    technicianLocationRequest.latitude,
                    technicianLocationRequest.longitude
                )
            };

            technicians.Remove(searchedTechnician);
            technicians.Add(updatedTechnicianDTO);
        }
    }
}