using System.Collections.Generic;
using System.Linq;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly SchoolContext _context;

        public MedicalRecordService(SchoolContext context)
        {
            _context = context;
        }

        public IEnumerable<MedicalRecord> GetAllMedicalRecords() => _context.MedicalRecords.ToList();

        public MedicalRecord GetMedicalRecordById(int id) => _context.MedicalRecords.FirstOrDefault(mr => mr.RecordID == id);

        public void AddMedicalRecord(MedicalRecord medicalRecord)
        {
            _context.MedicalRecords.Add(medicalRecord);
            _context.SaveChanges();
        }

        public void UpdateMedicalRecord(MedicalRecord medicalRecord)
        {
            _context.MedicalRecords.Update(medicalRecord);
            _context.SaveChanges();
        }

        public void DeleteMedicalRecord(int id)
        {
            var medicalRecord = _context.MedicalRecords.FirstOrDefault(mr => mr.RecordID == id);
            if (medicalRecord != null)
            {
                _context.MedicalRecords.Remove(medicalRecord);
                _context.SaveChanges();
            }
        }
    }
}
