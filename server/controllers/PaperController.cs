using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaperController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PaperController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Paper
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Paper>>> GetPapers()
        {
            return await _context.Papers
                .Include(p => p.PaperProperties)
                    .ThenInclude(pp => pp.Property)
                .ToListAsync();
        }

        // GET: api/Paper/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Paper>> GetPaper(int id)
        {
            var paper = await _context.Papers
                .Include(p => p.PaperProperties)
                    .ThenInclude(pp => pp.Property)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (paper == null)
            {
                return NotFound();
            }

            return paper;
        }

        // POST: api/Paper
        [HttpPost]
        public async Task<ActionResult<Paper>> AddPaper([FromBody] PaperRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paper = request.Paper;
            var propertyIds = request.PropertyIds;

            // Add paper to the database
            _context.Papers.Add(paper);
            await _context.SaveChangesAsync();

            // Assign selected properties to the paper, if any
            if (propertyIds != null && propertyIds.Any())
            {
                foreach (var propertyId in propertyIds)
                {
                    // Verify that the Property exists
                    var property = await _context.Properties.FindAsync(propertyId);
                    if (property == null)
                    {
                        return BadRequest($"Property with ID {propertyId} does not exist.");
                    }

                    var paperProperty = new PaperProperty
                    {
                        PaperId = paper.Id,
                        PropertyId = propertyId
                    };
                    _context.PaperProperties.Add(paperProperty);
                }

                await _context.SaveChangesAsync();
            }

            var createdPaper = await _context.Papers
                .Include(p => p.PaperProperties)
                .ThenInclude(pp => pp.Property)
                .FirstOrDefaultAsync(p => p.Id == paper.Id);

            return CreatedAtAction(nameof(GetPaper), new { id = paper.Id }, createdPaper);
        }


        // PUT: api/Paper/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPaper(int id, [FromBody] PaperRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paper = request.Paper;
            var propertyIds = request.PropertyIds;

            if (id != paper.Id)
            {
                return BadRequest("Paper ID mismatch.");
            }

            _context.Entry(paper).State = EntityState.Modified;

            // Update properties assignment
            var existingPaper = await _context.Papers
                .Include(p => p.PaperProperties)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingPaper == null)
            {
                return NotFound();
            }

            // Remove old properties
            _context.PaperProperties.RemoveRange(existingPaper.PaperProperties);

            // Assign new properties, if any
            if (propertyIds != null && propertyIds.Any())
            {
                foreach (var propertyId in propertyIds)
                {
                    var paperProperty = new PaperProperty
                    {
                        PaperId = paper.Id,
                        PropertyId = propertyId
                    };
                    _context.PaperProperties.Add(paperProperty);
                }
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaperExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // Retrieve the updated paper with properties to return
    		var updatedPaper = await _context.Papers
        		.Include(p => p.PaperProperties)
            		.ThenInclude(pp => pp.Property)
        	.FirstOrDefaultAsync(p => p.Id == id);

    		return Ok(updatedPaper);
        }

        // DELETE: api/Paper/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaper(int id)
        {
            var paper = await _context.Papers
                .Include(p => p.PaperProperties)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (paper == null)
            {
                return NotFound();
            }

            _context.Papers.Remove(paper);
            await _context.SaveChangesAsync();

            return NoContent();
        }



        private bool PaperExists(int id)
        {
            return _context.Papers.Any(e => e.Id == id);
        }
    }
}
