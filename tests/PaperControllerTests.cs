using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Controllers;
using Server.Data;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Tests
{
    public class PaperControllerTests
    {
        private async Task<AppDbContext> GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "PaperControllerTestDb")
                .Options;

            var context = new AppDbContext(options);

            // Clear the database to ensure test isolation
            context.Papers.RemoveRange(context.Papers);
            await context.SaveChangesAsync();

            // Seed the database
            context.Papers.AddRange(
                new Paper
                {
                    Id = 1,
                    Name = "Paper A",
                    Price = 10.0,
                    Stock = 100,
                    Discontinued = false,
                    PaperProperties = new List<PaperProperty>()
                },
                new Paper
                {
                    Id = 2,
                    Name = "Paper B",
                    Price = 15.0,
                    Stock = 50,
                    Discontinued = false,
                    PaperProperties = new List<PaperProperty>()
                }
            );

            await context.SaveChangesAsync();

            return context;
        }

        [Fact]
        public async Task GetPapers_ReturnsAllPapers()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);

            // Act
            var result = await controller.GetPapers();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Paper>>>(result);
            var papers = Assert.IsAssignableFrom<IEnumerable<Paper>>(actionResult.Value);
            Assert.Equal(2, papers.Count());
        }

        [Fact]
        public async Task GetPaper_ReturnsPaper_WhenIdExists()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);
            int existingId = 1;

            // Act
            var result = await controller.GetPaper(existingId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Paper>>(result);
            var paper = Assert.IsType<Paper>(actionResult.Value);
            Assert.Equal(existingId, paper.Id);
        }

        [Fact]
        public async Task GetPaper_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);
            int nonExistingId = 999;

            // Act
            var result = await controller.GetPaper(nonExistingId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task AddPaper_AddsPaperSuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);

            var newPaper = new Paper
            {
                Name = "Paper C",
                Price = 20.0,
                Stock = 75,
                Discontinued = false,
                PaperProperties = new List<PaperProperty>()
            };

            // Act
            var result = await controller.AddPaper(newPaper);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Paper>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var addedPaper = Assert.IsType<Paper>(createdAtActionResult.Value);
            Assert.Equal("Paper C", addedPaper.Name);
            Assert.NotEqual(0, addedPaper.Id); // Id should be set by EF
        }

        [Fact]
        public async Task EditPaper_UpdatesPaperSuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);
            var existingPaper = await context.Papers.FirstAsync();

            // Detach existingPaper from the context
            context.Entry(existingPaper).State = EntityState.Detached;

            var updatedPaper = new Paper
            {
                Id = existingPaper.Id,
                Name = "Updated Paper A",
                Price = existingPaper.Price,
                Stock = existingPaper.Stock,
                Discontinued = existingPaper.Discontinued,
                PaperProperties = existingPaper.PaperProperties
            };

            // Act
            var result = await controller.EditPaper(existingPaper.Id, updatedPaper);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var paperInDb = await context.Papers.FindAsync(existingPaper.Id);
            Assert.Equal("Updated Paper A", paperInDb.Name);
        }


        [Fact]
        public async Task EditPaper_ReturnsBadRequest_WhenIdsDoNotMatch()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);
            var existingPaper = await context.Papers.FirstAsync();
            int mismatchedId = existingPaper.Id + 1;

            var updatedPaper = new Paper
            {
                Id = mismatchedId,
                Name = "Updated Paper A",
                Price = existingPaper.Price,
                Stock = existingPaper.Stock,
                Discontinued = existingPaper.Discontinued,
                PaperProperties = existingPaper.PaperProperties
            };

            // Act
            var result = await controller.EditPaper(existingPaper.Id, updatedPaper);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task EditPaper_ReturnsNotFound_WhenPaperDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);
            int nonExistingId = 999;

            var updatedPaper = new Paper
            {
                Id = nonExistingId,
                Name = "Non-existing Paper",
                Price = 0,
                Stock = 0,
                Discontinued = false,
                PaperProperties = new List<PaperProperty>()
            };

            // Act
            var result = await controller.EditPaper(nonExistingId, updatedPaper);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeletePaper_DeletesPaperSuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);
            var paperToDelete = await context.Papers.FirstAsync();

            // Act
            var result = await controller.DeletePaper(paperToDelete.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var deletedPaper = await context.Papers.FindAsync(paperToDelete.Id);
            Assert.Null(deletedPaper);
        }

        [Fact]
        public async Task DeletePaper_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PaperController(context);
            int nonExistingId = 999;

            // Act
            var result = await controller.DeletePaper(nonExistingId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
