using SchoolApp.Models;
using System.Collections.Generic;

namespace SchoolApp.Services
{
    public interface IUploadService
    {
        Task<List<UploadedFile>> GetAllFilesAsync();
        Task<UploadedFile?> GetFileAsync(int id);
        Task<UploadedFile> UploadFileAsync(IFormFile file, string uploadFolder);
        Task<bool> DeleteFileAsync(int id, string uploadFolder);
    }
}