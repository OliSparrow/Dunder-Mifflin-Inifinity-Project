using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrderController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            try
            {
                return await _context.Orders
                    .Include(o => o.OrderEntries)
                    .ThenInclude(oe => oe.Product)
                    .Include(o => o.Customer)
                    .ToListAsync();
            }
            catch (Exception ex) 
            {
                Console.WriteLine($"Error fetching orders: {ex.Message} - {ex.StackTrace}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/Order/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderEntries)
                .ThenInclude(oe => oe.Product)
                .Include(o => o.Customer)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            return order;
        }

        // POST: api/Order
        [HttpPost]
        public async Task<ActionResult<Order>> PlaceOrder([FromBody] Order order)
        {
            Console.WriteLine($"Order received: {JsonSerializer.Serialize(order)}");

            using var transaction = await _context.Database.BeginTransactionAsync();
            
            try
            {
                // Customer logic
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email == order.Customer.Email);

                if (customer == null)
                {
                    customer = new Customer
                    {
                        Name = order.Customer.Name,
                        Address = order.Customer.Address,
                        Phone = order.Customer.Phone,
                        Email = order.Customer.Email
                    };
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                }

                // Set customer ID and create valid order entries
                order.CustomerId = customer.Id;
                order.Customer = customer;

                // Prepare valid order entries list and calculate total amount
                var validOrderEntries = new List<OrderEntry>();
                double totalAmount = 0;

                foreach (var entry in order.OrderEntries)
                {
                    var product = await _context.Papers.FindAsync(entry.ProductId);

                    if (product == null)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"Product with ID {entry.ProductId} not found.");
                    }

                    if (product.Stock < entry.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"Not enough stock for product {product.Name}");
                    }

                    // Update stock and calculate total amount
                    product.Stock -= entry.Quantity;
                    totalAmount += entry.Quantity * product.Price;

                    // Update product stock explicitly
                    _context.Entry(product).State = EntityState.Modified;

                    // Create OrderEntry instance
                    var orderEntry = new OrderEntry
                    {
                        ProductId = entry.ProductId,
                        Quantity = entry.Quantity,
                        Product = product,
                        Order = order // Ensure relationship is properly linked
                    };

                    validOrderEntries.Add(orderEntry);
                }

                // Set order properties before saving
                order.OrderEntries = validOrderEntries;
                order.TotalAmount = totalAmount;
                order.OrderDate = DateTime.UtcNow;

                if (string.IsNullOrEmpty(order.Status))
                {
                    order.Status = "Pending";
                }

                // Add the order to the context and explicitly track all entries
                _context.Orders.Add(order);
                _context.OrderEntries.AddRange(validOrderEntries); // Add order entries explicitly
                await _context.SaveChangesAsync(); // Save changes to both Order and OrderEntries

                await transaction.CommitAsync();

                Console.WriteLine($"Successfully saved order with Total Amount: {totalAmount}");
                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in PlaceOrder: {ex.Message} - {ex.StackTrace}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/Order/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditOrder(int id, Order order)
        {
            if (id != order.Id)
                return BadRequest();

            _context.Entry(order).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Order/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderEntries)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                return NotFound();

            // Remove all related OrderEntries first
            _context.OrderEntries.RemoveRange(order.OrderEntries);

            // Remove the order itself
            _context.Orders.Remove(order);

            // Save changes to the database
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}