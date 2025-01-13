using Microsoft.AspNetCore.Http;

namespace OnSight.Infra.CloudStorage;

public interface ICloudStorage
{
    Task<string> UploadData(IFormFile fileData);
}
