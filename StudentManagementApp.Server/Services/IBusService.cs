using System.Collections.Generic;
using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IBusService
    {
        IEnumerable<Bus> GetAllBuses();
        Bus GetBusById(int id);
        int AddBus(Bus bus);
        void UpdateBus(Bus bus);
        void DeleteBus(int id);
    }
}
