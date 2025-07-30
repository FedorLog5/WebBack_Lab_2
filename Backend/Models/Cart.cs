using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebBack_Lab_2.Backend.Data;

namespace WebBack_Lab_2.Backend.Models
{
    public class Cart
    {
        public int Id { get; set; }

        [Required]
        public string AppUserId { get; set; } = string.Empty;

        [ForeignKey(nameof(AppUserId))]
        public AppUser AppUser { get; set; }

        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
