using Microsoft.Extensions.Hosting;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class HostelService : IHostelService
    {
        private readonly SchoolContext _context;

        public HostelService(SchoolContext context)
        {
            _context = context;
        }
        public IEnumerable<Hostel> GetAllHostels()
        {
            return _context.Hostels.ToList();
        }
        public Hostel GetHostelById(Guid id)
        {
            return _context.Hostels.FirstOrDefault(e => e.HostelID == id);
        }
        public void AddHostel(Hostel hostel)
        {
            _context.Hostels.Add(hostel);
            _context.SaveChanges();
        }
        public void UpdateHostel(Hostel hostel)
        {
            _context.Hostels.Update(hostel);
            _context.SaveChanges();
        }
        public void DeleteHostel(Guid id)
        {
            var hostel = _context.Hostels.FirstOrDefault(e => e.HostelID == id);
            if (hostel != null)
            {
                _context.Hostels.Remove(hostel);
                _context.SaveChanges();
            }
        }
    }
}