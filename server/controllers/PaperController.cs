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
            var paper = request.Paper;
            var propertyIds = request.PropertyIds;

            // Add paper to the database
            _context.Papers.Add(paper);
            await _context.SaveChangesAsync();

            // Assign selected properties to the paper
            foreach (var propertyId in propertyIds)
            {
                var property = await _context.Properties.FindAsync(propertyId);
                if (property != null)
                {
                    var paperProperty = new PaperProperty
                    {
                        PaperId = paper.Id,
                        PropertyId = property.Id
                    };
                    _context.PaperProperties.Add(paperProperty);
                }
            }

            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPaper), new { id = paper.Id }, paper);
        }

        // PUT: api/Paper/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPaper(int id, [FromBody] PaperRequest request)
        {
            var paper = request.Paper;
            var propertyIds = request.PropertyIds;

            if (id != paper.Id)
            {
                return BadRequest();
            }

            _context.Entry(paper).State = EntityState.Modified;

            // Update properties assignment
            var existingPaper = await _context.Papers
                .Include(p => p.PaperProperties)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (existingPaper == null) return NotFound();

            // Remove old properties
            _context.PaperProperties.RemoveRange(existingPaper.PaperProperties);

            // Assign new properties
            foreach (var propertyId in propertyIds)
            {
                var property = await _context.Properties.FindAsync(propertyId);
                if (property != null)
                {
                    var paperProperty = new PaperProperty
                    {
                        PaperId = paper.Id,
                        PropertyId = property.Id
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

            return NoContent();
        }

        // DELETE: api/Paper/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePaper(int id)
        {
            var paper = await _context.Papers.FindAsync(id);
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
