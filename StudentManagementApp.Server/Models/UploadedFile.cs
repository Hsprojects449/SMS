using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SchoolApp.Models
{
    public class UploadedFile
    {
        [Key]
        public int FileID { get; set; }
        public string FileName { get; set; }
        public string StoredFileName { get; set; }
        public string FilePath { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}