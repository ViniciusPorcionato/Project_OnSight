namespace OnSight.Infra.Data.DAOs.ClientDAO;

public interface IClientDAO
{
    Task<IEnumerable<ClientListDTO>> GetAllClients();
    Task<BasicClientDTO> GetClientByUserId(Guid userId);
    Task<ClientDetailsDTO> GetClientById(Guid clientId);
}