// Controllers/PaperController.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

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
        public async Task<ActionResult<Paper>> AddPaper(Paper paper)
        {
            foreach (var pp in paper.PaperProperties)
            {
                _context.Entry(pp.Property).State = EntityState.Unchanged;
            }

            _context.Papers.Add(paper);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPaper), new { id = paper.Id }, paper);
        }

        // PUT: api/Paper/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> EditPaper(int id, Paper paper)
        {
            if (id != paper.Id)
            {
                return BadRequest();
            }

            _context.Entry(paper).State = EntityState.Modified;

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
