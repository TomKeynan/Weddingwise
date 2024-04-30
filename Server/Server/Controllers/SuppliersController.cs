
using Microsoft.AspNetCore.Mvc;
using Server.BL;


namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SuppliersController : Controller
    {
        [HttpGet("getTopVenues")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<List<Supplier>> Get()
        {
            try
            {
                // Retrieve list of suppliers synchronously
                List<Supplier> suppliers = Supplier.GetTopVenues();

                return Ok(suppliers); // Return the list of suppliers
            }
            catch (Exception e)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}
