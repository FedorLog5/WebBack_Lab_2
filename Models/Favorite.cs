using WebBack_Lab_2.Data;

namespace WebBack_Lab_2.Models
{
    public class Favorite
    {
        public int Id { get; set; }

        public string UserId { get; set; }
        public AppUser User { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
    }

}
