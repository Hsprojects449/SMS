using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IHostelService
    {
        IEnumerable<Hostel> GetAllHostels();
        Hostel GetHostelById(Guid id);
        void AddHostel(Hostel hostel);
        void UpdateHostel(Hostel hostel);
        void DeleteHostel(Guid id);
    }
}
