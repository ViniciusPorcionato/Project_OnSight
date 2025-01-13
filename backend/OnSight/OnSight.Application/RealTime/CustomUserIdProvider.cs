using Microsoft.AspNetCore.SignalR;

namespace OnSight.Application.RealTime;

public class CustomUserIdProvider : IUserIdProvider
{
    public string? GetUserId(HubConnectionContext connection)
    {
        // Extract token directly from query string
        var httpContext = connection.GetHttpContext();
        var token = httpContext?.Request.Query["token"].FirstOrDefault();

        // Usar um claim específico ou outro identificador como UserIdentifier
        return token ?? connection.User?.FindFirst("userToken")?.Value;
        //return connection.User?.FindFirst("userToken")?.Value ?? connection.User?.Identity?.Name;
    }
}