using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebBack_Lab_2.Backend.Models
{
    public class PurchaseHistory
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        [Column(TypeName = "jsonb")]
        public string Products { get; set; } 

        [Required]
        public DateTime PurchaseDate { get; set; } = DateTime.UtcNow;
    }
}
