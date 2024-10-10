using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Server.dtos;

    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public OrderController(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Order
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDTO>>> GetOrders()
        {
            try
            {
                var orders = await _context.Orders
                    .Include(o => o.OrderEntries)
                    .ThenInclude(oe => oe.Product)
                    .Include(o => o.Customer)
                    .ToListAsync();

                var orderDTOs = _mapper.Map<List<OrderDTO>>(orders);
                return orderDTOs;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching orders: {ex.Message} - {ex.StackTrace}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/Order/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderEntries)
                    .ThenInclude(oe => oe.Product)
                    .Include(o => o.Customer)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound();

                var orderDTO = _mapper.Map<OrderDTO>(order);
                return orderDTO;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching order by ID: {ex.Message} - {ex.StackTrace}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/Order
       [HttpPost]
        public async Task<ActionResult<OrderDTO>> PlaceOrder([FromBody] OrderDTO orderDTO)
        {
            if (orderDTO == null)
            {
                Console.WriteLine("Order data is null.");
                return BadRequest("Order data cannot be null.");
            }

            if (string.IsNullOrEmpty(orderDTO.CustomerEmail) || string.IsNullOrEmpty(orderDTO.CustomerName) ||
                string.IsNullOrEmpty(orderDTO.CustomerAddress) || string.IsNullOrEmpty(orderDTO.CustomerPhone))
            {
                Console.WriteLine("Customer information is missing or invalid in OrderDTO.");
                return BadRequest("Customer information (name, address, phone, email) is required.");
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                Console.WriteLine("Mapping OrderDTO to Order entity...");
                var order = _mapper.Map<Order>(orderDTO);

                Console.WriteLine("Fetching or creating customer...");
                var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == orderDTO.CustomerEmail);
                if (customer == null)
                {
                    Console.WriteLine("Customer not found, creating new customer.");
                    customer = new Customer
                    {
                        Name = orderDTO.CustomerName,
                        Address = orderDTO.CustomerAddress,
                        Phone = orderDTO.CustomerPhone,
                        Email = orderDTO.CustomerEmail
                    };

                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                }

                // Set customer ID and associate the customer object
                order.CustomerId = customer.Id;
                order.Customer = customer;

                Console.WriteLine("Processing order entries...");
                var validOrderEntries = new List<OrderEntry>();
                double totalAmount = 0;

                foreach (var entryDTO in orderDTO.OrderEntries)
                {
                    var product = await _context.Papers.FindAsync(entryDTO.ProductId);
                    if (product == null)
                    {
                        Console.WriteLine($"Product with ID {entryDTO.ProductId} not found.");
                        await transaction.RollbackAsync();
                        return BadRequest($"Product with ID {entryDTO.ProductId} not found.");
                    }

                    if (product.Stock < entryDTO.Quantity)
                    {
                        Console.WriteLine($"Not enough stock for product {product.Name}.");
                        await transaction.RollbackAsync();
                        return BadRequest($"Not enough stock for product {product.Name}");
                    }

                    // Update product stock
                    product.Stock -= entryDTO.Quantity;
                    totalAmount += entryDTO.Quantity * product.Price;

                    _context.Entry(product).State = EntityState.Modified;

                    var orderEntry = new OrderEntry
                    {
                        ProductId = entryDTO.ProductId,
                        Quantity = entryDTO.Quantity,
                        Product = product,
                        Order = order
                    };

                    validOrderEntries.Add(orderEntry);
                }

                order.OrderEntries = validOrderEntries;
                order.TotalAmount = totalAmount;
                order.OrderDate = DateTime.UtcNow;

                if (string.IsNullOrEmpty(order.Status))
                {
                    order.Status = "Pending";
                }

                Console.WriteLine("Saving order to the database...");
                _context.Orders.Add(order);
                _context.OrderEntries.AddRange(validOrderEntries);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                Console.WriteLine("Order placed successfully.");
                var resultDTO = _mapper.Map<OrderDTO>(order);
                return CreatedAtAction(nameof(GetOrder), new { id = resultDTO.Id }, resultDTO);
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
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderDTO orderDTO)
        {
            if (id != orderDTO.Id)
            {
                return BadRequest("Order ID mismatch.");
            }

            try
            {
                var existingOrder = await _context.Orders
                    .Include(o => o.OrderEntries)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (existingOrder == null)
                {
                    return NotFound();
                }

                Console.WriteLine("Updating order status...");
                existingOrder.Status = orderDTO.Status;

                _context.Entry(existingOrder).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in UpdateOrder: {ex.Message} - {ex.StackTrace}");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/Order/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.OrderEntries)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound();
                }

                Console.WriteLine("Deleting order and associated entries...");
                _context.OrderEntries.RemoveRange(order.OrderEntries);
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteOrder: {ex.Message} - {ex.StackTrace}");
                return StatusCode(500, "Internal Server Error");
            }
        }
}
