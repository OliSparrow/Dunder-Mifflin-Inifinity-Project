using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropertyController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PropertyController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Property
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Property>>> GetProperties()
        {
            return await _context.Properties.ToListAsync();
        }

        // GET: api/Property/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Property>> GetProperty(int id)
        {
            var property = await _context.Properties.FindAsync(id);

            if (property == null)
            {
                return NotFound();
            }

            return property;
        }

        // POST: api/Property
        [HttpPost]
        public async Task<ActionResult<Property>> AddProperty([FromBody] Property property)
        {
            _context.Properties.Add(property);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
        }
        
        // PUT: api/Property/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditProperty(int id, [FromBody] Property property)
        {
            if (id != property.Id)
            {
                return BadRequest();
            }

            _context.Entry(property).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PropertyExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // Retrieve the updated property
            var updatedProperty = await _context.Properties.FindAsync(id);

            // Return the updated property
            return Ok(updatedProperty);
        }

        // DELETE: api/Property/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProperty(int id, [FromQuery] bool force = false)
        {
            // Fetch the property including any related paper properties
            var property = await _context.Properties
                .Include(p => p.PaperProperties)
                .FirstOrDefaultAsync(p => p.Id == id);
    
            if (property == null)
            {
                return NotFound();
            }

            // Check if property is assigned to any products
            if (property.PaperProperties.Any())
            {
                if (!force)
                {
                    return BadRequest(new { message = $"Property is assigned to {property.PaperProperties.Count} products. Do you still want to delete it?" });
                }
                else
                {
                    // Remove associations with papers
                    _context.PaperProperties.RemoveRange(property.PaperProperties);
                }
            }

            // Proceed to delete the property
            _context.Properties.Remove(property);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //Checker if its associated to products before deleting
        [HttpGet("{id}/canDelete")]
        public async Task<IActionResult> CanDeleteProperty(int id)
        {
            var property = await _context.Properties
                .Include(p => p.PaperProperties)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (property == null)
            {
                return NotFound();
            }

            return Ok(new { canDelete = !property.PaperProperties.Any(), assignedCount = property.PaperProperties.Count });
        }

        private bool PropertyExists(int id)
        {
            return _context.Properties.Any(e => e.Id == id);
        }
    }
}
