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
    public class PropertyControllerTests
    {
        private async Task<AppDbContext> GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "PropertyControllerTestDb")
                .Options;

            var context = new AppDbContext(options);

            // Clear the database to ensure test isolation
            context.Properties.RemoveRange(context.Properties);
            await context.SaveChangesAsync();

            // Seed the database
            context.Properties.AddRange(
                new Property { Id = 1, Name = "Property A" },
                new Property { Id = 2, Name = "Property B" }
            );

            await context.SaveChangesAsync();

            return context;
        }

        [Fact]
        public async Task GetProperties_ReturnsAllProperties()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);

            // Act
            var result = await controller.GetProperties();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Property>>>(result);
            var properties = Assert.IsAssignableFrom<IEnumerable<Property>>(actionResult.Value);
            Assert.Equal(2, properties.Count());
        }

        [Fact]
        public async Task GetProperty_ReturnsProperty_WhenIdExists()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);
            int existingId = 1;

            // Act
            var result = await controller.GetProperty(existingId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Property>>(result);
            var property = Assert.IsType<Property>(actionResult.Value);
            Assert.Equal(existingId, property.Id);
        }

        [Fact]
        public async Task GetProperty_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);
            int nonExistingId = 999;

            // Act
            var result = await controller.GetProperty(nonExistingId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task AddProperty_AddsPropertySuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);

            var newProperty = new Property { Name = "Property C" };

            // Act
            var result = await controller.AddProperty(newProperty);

            // Assert
            var actionResult = Assert.IsType<ActionResult<Property>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var addedProperty = Assert.IsType<Property>(createdAtActionResult.Value);
            Assert.Equal("Property C", addedProperty.Name);
            Assert.NotEqual(0, addedProperty.Id); // Id should be set by EF
        }

        [Fact]
        public async Task EditProperty_UpdatesPropertySuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);
            var existingProperty = await context.Properties.FirstAsync();

            // Detach existingProperty from the context
            context.Entry(existingProperty).State = EntityState.Detached;

            var updatedProperty = new Property
            {
                Id = existingProperty.Id,
                Name = "Updated Property A"
            };

            // Act
            var result = await controller.EditProperty(existingProperty.Id, updatedProperty);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            var updatedInDb = Assert.IsType<Property>(((OkObjectResult)result).Value);
            Assert.Equal("Updated Property A", updatedInDb.Name);
        }

        [Fact]
        public async Task EditProperty_ReturnsBadRequest_WhenIdsDoNotMatch()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);
            var existingProperty = await context.Properties.FirstAsync();
            int mismatchedId = existingProperty.Id + 1;

            var updatedProperty = new Property
            {
                Id = mismatchedId,
                Name = "Updated Property A"
            };

            // Act
            var result = await controller.EditProperty(existingProperty.Id, updatedProperty);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task EditProperty_ReturnsNotFound_WhenPropertyDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);
            int nonExistingId = 999;

            var updatedProperty = new Property
            {
                Id = nonExistingId,
                Name = "Non-existing Property"
            };

            // Act
            var result = await controller.EditProperty(nonExistingId, updatedProperty);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task DeleteProperty_DeletesPropertySuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);
            var propertyToDelete = await context.Properties.FirstAsync();

            // Act
            var result = await controller.DeleteProperty(propertyToDelete.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var deletedProperty = await context.Properties.FindAsync(propertyToDelete.Id);
            Assert.Null(deletedProperty);
        }

        [Fact]
        public async Task DeleteProperty_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var controller = new PropertyController(context);
            int nonExistingId = 999;

            // Act
            var result = await controller.DeleteProperty(nonExistingId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
