using SchoolApp.Models;

namespace SchoolApp.Services
{
    public interface IFeeService
    {
        IEnumerable<Fee> GetAllFees();
        Fee GetFeeById(Guid id);
        void AddFee(Fee fee);
        void UpdateFee(Fee fee);
        void DeleteFee(Guid id);
    }
}
