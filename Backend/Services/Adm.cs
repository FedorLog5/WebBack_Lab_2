using Microsoft.AspNetCore.Identity;
using WebBack_Lab_2.Backend.Data;

namespace WebBack_Lab_2.Backend.Services
{
    public class DataSeeder
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<AppUser> _userManager;
        private readonly ILogger<DataSeeder> _logger;

        public DataSeeder(
            RoleManager<IdentityRole> roleManager,
            UserManager<AppUser> userManager,
            ILogger<DataSeeder> logger)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SeedAdminAsync()
        {
            try
            {
               
                if (!await _roleManager.RoleExistsAsync("Admin"))
                {
                    await _roleManager.CreateAsync(new IdentityRole("Admin"));
                    _logger.LogInformation("Роль 'Admin' создана");
                }

               
                var adminEmail = "adm@mail.ru";
                var adminUser = await _userManager.FindByEmailAsync(adminEmail);

                if (adminUser == null)
                {
                    adminUser = new AppUser
                    {
                        UserName = "admin",
                        Email = adminEmail,
                        EmailConfirmed = true
                    };

                    var result = await _userManager.CreateAsync(adminUser, "SecurePassword123!");

                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(adminUser, "Admin");
                        _logger.LogInformation("Администратор создан");
                    }
                }
                else if (!await _userManager.IsInRoleAsync(adminUser, "Admin"))
                {
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                    _logger.LogInformation("Роль 'Admin' назначена существующему пользователю");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при инициализации админа");
                throw;
            }
        }
    }
}