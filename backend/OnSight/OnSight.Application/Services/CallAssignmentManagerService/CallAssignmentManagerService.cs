using OnSight.Domain.Entities;
using OnSight.Infra.Geolocation;

namespace OnSight.Application.Services.CallAssignmentManagerService;

public class CallAssignmentManagerService : ICallAssignmentManagerService
{
    private readonly IGeolocationProvider _geolocationProvider;
    private readonly ICepInterpreterProvider _cepInterpreterProvider;

    public CallAssignmentManagerService(IGeolocationProvider geolocationProvider, ICepInterpreterProvider cepInterpreterProvider)
    {
        _geolocationProvider = geolocationProvider;
        _cepInterpreterProvider = cepInterpreterProvider;
    }

    public async Task<TechnicianSelectedForDTO> AttributeServiceCallForTechnician(ServiceCall serviceCall, TechnicianRealTimeDTO[] avaliableTechnicians)
    {
        int avaliableTechniciansAmount = avaliableTechnicians.Length;

        if (avaliableTechniciansAmount == 0)
            throw new Exception("There is no avaliable technician.");

        // Get technician origins
        Location[] technicianOrigins = new Location[avaliableTechniciansAmount];

        for (int technicianIndex = 0; technicianIndex < avaliableTechniciansAmount; technicianIndex++)
        {
            var currentTechnician = avaliableTechnicians[technicianIndex];

            technicianOrigins[technicianIndex] = new Location(
                latitude: currentTechnician.latitude,
                longitude: currentTechnician.longitude
            );
        }

        // Get call address
        var addressResponse = await _cepInterpreterProvider.GetAddressFromCep(serviceCall.Address!.CEP!);
        string serviceCallAddressText = $"{addressResponse.logradouro}, {serviceCall.Address!.Number!}. {addressResponse.localidade}";

        // Get lowest distance
        var distanceMatrix = await _geolocationProvider.GetDistanceBetweenPlaces(technicianOrigins, serviceCallAddressText);

        int selectedTechnicianIndex = 0;
        double lowestDurationValue = -1;

        for(int  technicianIndex = 0; technicianIndex < avaliableTechniciansAmount; technicianIndex++)
        {
            var distanceRow = distanceMatrix.rows[technicianIndex];
            var distanceElement = distanceRow.elements[0];

            var durationValue = distanceElement.duration.value;

            if (lowestDurationValue == -1)
            {
                lowestDurationValue = durationValue;
                continue;
            } 
            
            if (durationValue < lowestDurationValue)
            {
                selectedTechnicianIndex = technicianIndex;
                lowestDurationValue = durationValue;
            }
        }

        // Assign call to technician
        Technician selectedTechnician = avaliableTechnicians[selectedTechnicianIndex].technician;
        Guid selectedTechnicianId = selectedTechnician.Id;
        serviceCall.AssignCallToTechnician(selectedTechnicianId);

        // Generate response
        string lowestDurationText = distanceMatrix.rows[selectedTechnicianIndex].elements[0].duration.text;
        string lowestDistanceText = distanceMatrix.rows[selectedTechnicianIndex].elements[0].distance.text;

        var response = new TechnicianSelectedForDTO(
            technicianId: selectedTechnician.Id,
            tecnicianName: selectedTechnician.IndividualPerson!.Name!,
            technicianProfileImageUrl: selectedTechnician.IndividualPerson!.User!.ProfileImageUrl!,
            clientFancyName: serviceCall.Client!.TradeName!,
            locationCity: addressResponse.localidade,
            durationText: lowestDurationText,
            distanceText: lowestDistanceText
        );

        return response;
    }
}

public record TechnicianSelectedForDTO
(
    Guid technicianId,
    string tecnicianName,
    string technicianProfileImageUrl,
    string clientFancyName,
    string locationCity,
    string durationText,
    string distanceText
);


public record TechnicianRealTimeDTO
(
    Technician technician,
    double latitude,
    double longitude
);
