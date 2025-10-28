using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class FeeService : IFeeService
    {
        private readonly SchoolContext _context;

        public FeeService(SchoolContext context)
        {
            _context = context;
        }
        public IEnumerable<Fee> GetAllFees()
        {
            return _context.Fees.ToList();
        }
        public Fee GetFeeById(Guid id)
        {
            return _context.Fees.FirstOrDefault(e => e.FeeID == id);
        }
        public void AddFee(Fee fee)
        {
            _context.Fees.Add(fee);
            _context.SaveChanges();
        }
        public void UpdateFee(Fee fee)
        {
            _context.Fees.Update(fee);
            _context.SaveChanges();
        }
        public void DeleteFee(Guid id)
        {
            var fee = _context.Fees.FirstOrDefault(e => e.FeeID == id);
            if (fee != null)
            {
                _context.Fees.Remove(fee);
                _context.SaveChanges();
            }
        }
    }
}