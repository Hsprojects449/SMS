using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using SchoolApp.Models;
using SchoolApp.Services;

namespace SchoolApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordController : ControllerBase
    {
        private readonly IMedicalRecordService _medicalRecordService;

        public MedicalRecordController(IMedicalRecordService medicalRecordService)
        {
            _medicalRecordService = medicalRecordService;
        }

        [HttpGet]
        public IActionResult GetAllMedicalRecords() => Ok(_medicalRecordService.GetAllMedicalRecords());

        [HttpGet("{id}")]
        public IActionResult GetMedicalRecordById(int id)
        {
            var medicalRecord = _medicalRecordService.GetMedicalRecordById(id);
            return medicalRecord == null ? NotFound() : Ok(medicalRecord);
        }

        [HttpPost]
        public IActionResult AddMedicalRecord([FromBody] MedicalRecord medicalRecord)
        {
            _medicalRecordService.AddMedicalRecord(medicalRecord);
            return CreatedAtAction(nameof(GetMedicalRecordById), new { id = medicalRecord.RecordID }, medicalRecord);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMedicalRecord(int id, [FromBody] MedicalRecord medicalRecord)
        {
            if (id != medicalRecord.RecordID) return BadRequest();
            _medicalRecordService.UpdateMedicalRecord(medicalRecord);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteMedicalRecord(int id)
        {
            _medicalRecordService.DeleteMedicalRecord(id);
            return NoContent();
        }
    }
}
