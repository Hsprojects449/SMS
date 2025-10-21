using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IMedicalRecordService
    {
        IEnumerable<MedicalRecord> GetAllMedicalRecords();
        MedicalRecord GetMedicalRecordById(int id);
        void AddMedicalRecord(MedicalRecord medicalRecord);
        void UpdateMedicalRecord(MedicalRecord medicalRecord);
        void DeleteMedicalRecord(int id);
    }
}
