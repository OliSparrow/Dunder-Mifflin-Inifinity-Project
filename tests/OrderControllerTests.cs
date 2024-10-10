using AutoMapper;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using Server.Controllers;
using Server.Data;
using Server.Models;
using Server.dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Tests
{
    public class OrderControllerTests
    {
        private async Task<AppDbContext> GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "OrderControllerTestDb")
                .Options;

            var context = new AppDbContext(options);

            // Clear the database to ensure test isolation
            context.Orders.RemoveRange(context.Orders);
            context.Customers.RemoveRange(context.Customers);
            context.Papers.RemoveRange(context.Papers);
            await context.SaveChangesAsync();

            // Seed the database
            var product = new Paper { Id = 1, Name = "Sticky Notes", Price = 5.00, Stock = 50 };
            var customer = new Customer { Id = 1, Name = "Dan Dan", Address = "Address 123", Phone = "12345678", Email = "dandan@email.com" };
            context.Papers.Add(product);
            context.Customers.Add(customer);
            await context.SaveChangesAsync();

            return context;
        }

        private IMapper GetMapper()
        {
            var mockMapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile(new MappingProfile());
            });
            return mockMapper.CreateMapper();
        }

        [Fact]
        public async Task GetOrders_ReturnsAllOrders()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var mapper = GetMapper();
            var controller = new OrderController(context, mapper);

            var order = new Order
            {
                Id = 1,
                CustomerId = 1,
                Status = "Pending",
                OrderDate = DateTime.UtcNow,
                TotalAmount = 5.00,
                Customer = context.Customers.First()
            };
            context.Orders.Add(order);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetOrders();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<OrderDTO>>>(result);
            var orders = Assert.IsAssignableFrom<IEnumerable<OrderDTO>>(actionResult.Value);
            Assert.Single(orders);
        }

        [Fact]
        public async Task GetOrder_ReturnsOrder_WhenIdExists()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var mapper = GetMapper();
            var controller = new OrderController(context, mapper);
            int existingId = 1;

            var order = new Order
            {
                Id = existingId,
                CustomerId = 1,
                Status = "Pending",
                OrderDate = DateTime.UtcNow,
                TotalAmount = 5.00,
                Customer = context.Customers.First()
            };
            context.Orders.Add(order);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.GetOrder(existingId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<OrderDTO>>(result);
            var orderDTO = Assert.IsType<OrderDTO>(actionResult.Value);
            Assert.Equal(existingId, orderDTO.Id);
        }

        [Fact]
        public async Task GetOrder_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var mapper = GetMapper();
            var controller = new OrderController(context, mapper);
            int nonExistingId = 999;

            // Act
            var result = await controller.GetOrder(nonExistingId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task PlaceOrder_AddsOrderSuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var mapper = GetMapper();
            var controller = new OrderController(context, mapper);

            var newOrderDTO = new OrderDTO
            {
                CustomerName = "Dan Dan",
                CustomerAddress = "Address 123",
                CustomerPhone = "12345678",
                CustomerEmail = "dandan@email.com",
                OrderEntries = new List<OrderEntryDTO>
                {
                    new OrderEntryDTO { ProductId = 1, Quantity = 2 }
                },
                Status = "Pending",
                OrderDate = DateTime.UtcNow.ToString("s"),
                TotalAmount = 10.00
            };

            // Act
            var result = await controller.PlaceOrder(newOrderDTO);

            // Assert
            var actionResult = Assert.IsType<ActionResult<OrderDTO>>(result);
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
            var addedOrder = Assert.IsType<OrderDTO>(createdAtActionResult.Value);
            Assert.Equal("Dan Dan", addedOrder.CustomerName);
            Assert.NotEqual(0, addedOrder.Id); // Id should be set by EF
        }

        [Fact]
        public async Task UpdateOrder_UpdatesOrderSuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var mapper = GetMapper();
            var controller = new OrderController(context, mapper);

            var existingOrder = new Order
            {
                Id = 1,
                CustomerId = 1,
                Status = "Pending",
                OrderDate = DateTime.UtcNow,
                TotalAmount = 10.00,
                Customer = context.Customers.First()
            };
            context.Orders.Add(existingOrder);
            await context.SaveChangesAsync();

            var updatedOrderDTO = new OrderDTO
            {
                Id = existingOrder.Id,
                Status = "Delivered"
            };

            // Act
            var result = await controller.UpdateOrder(existingOrder.Id, updatedOrderDTO);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedOrder = await context.Orders.FindAsync(existingOrder.Id);
            Assert.Equal("Delivered", updatedOrder.Status);
        }

        [Fact]
        public async Task DeleteOrder_DeletesOrderSuccessfully()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var mapper = GetMapper();
            var controller = new OrderController(context, mapper);

            var orderToDelete = new Order
            {
                Id = 1,
                CustomerId = 1,
                Status = "Pending",
                OrderDate = DateTime.UtcNow,
                TotalAmount = 10.00,
                Customer = context.Customers.First()
            };
            context.Orders.Add(orderToDelete);
            await context.SaveChangesAsync();

            // Act
            var result = await controller.DeleteOrder(orderToDelete.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var deletedOrder = await context.Orders.FindAsync(orderToDelete.Id);
            Assert.Null(deletedOrder);
        }

        [Fact]
        public async Task DeleteOrder_ReturnsNotFound_WhenIdDoesNotExist()
        {
            // Arrange
            var context = await GetInMemoryDbContext();
            var mapper = GetMapper();
            var controller = new OrderController(context, mapper);
            int nonExistingId = 999;

            // Act
            var result = await controller.DeleteOrder(nonExistingId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
    }
}
