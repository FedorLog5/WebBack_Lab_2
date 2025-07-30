namespace WebBack_Lab_2.Backend.DTOs
{
    public class CartDto
    {
        public List<CartItemDto> CartItems { get; set; } = new();
    }
}
