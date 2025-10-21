using SchoolApp.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace SchoolApp.Services
{
    public class UploadService : IUploadService
    {
        private readonly SchoolContext _context;

        public UploadService(SchoolContext context)
        {
            _context = context;
        }

        public async Task<List<UploadedFile>> GetAllFilesAsync()
        {
            return await _context.UploadedFiles.ToListAsync();
        }

        public async Task<UploadedFile?> GetFileAsync(int id)
        {
            return await _context.UploadedFiles.FindAsync(id);
        }

        public async Task<UploadedFile> UploadFileAsync(IFormFile file, string uploadFolder)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("File is empty.");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            var storedName = Guid.NewGuid() + Path.GetExtension(file.FileName);
            var fullPath = Path.Combine(uploadFolder, storedName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var uploadedFile = new UploadedFile
            {
                FileName = file.FileName,
                StoredFileName = storedName,
                FilePath = Path.Combine("uploads", storedName),
                UploadedAt = DateTime.UtcNow
            };

            _context.UploadedFiles.Add(uploadedFile);
            await _context.SaveChangesAsync();

            return uploadedFile;
        }

        public async Task<bool> DeleteFileAsync(int id, string uploadFolder)
        {
            var file = await _context.UploadedFiles.FindAsync(id);
            if (file == null) return false;

            var fullPath = Path.Combine(uploadFolder, file.StoredFileName);
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);

            _context.UploadedFiles.Remove(file);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}