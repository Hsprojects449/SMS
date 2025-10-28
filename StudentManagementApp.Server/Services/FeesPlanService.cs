using SchoolApp.Models;

namespace SchoolApp.Services
{
    public class FeesPlanService : IFeesPlanService
    {
        private readonly SchoolContext _context;

        public FeesPlanService(SchoolContext context)
        {
            _context = context;
        }
        public IEnumerable<FeesPlan> GetAllFeesPlans()
        {
            return _context.FeesPlans.ToList();
        }
        public FeesPlan GetFeesPlanById(Guid id)
        {
            return _context.FeesPlans.FirstOrDefault(e => e.FeePlanID == id);
        }
        public void AddFeesPlan(FeesPlan feesPlan)
        {
            _context.FeesPlans.Add(feesPlan);
            _context.SaveChanges();
        }
        public void UpdateFeesPlan(FeesPlan feesPlan)
        {
            _context.FeesPlans.Update(feesPlan);
            _context.SaveChanges();
        }
        public void DeleteFeesPlan(Guid id)
        {
            var feesPlan = _context.FeesPlans.FirstOrDefault(e => e.FeePlanID == id);
            if (feesPlan != null)
            {
                _context.FeesPlans.Remove(feesPlan);
                _context.SaveChanges();
            }
        }
    }
}