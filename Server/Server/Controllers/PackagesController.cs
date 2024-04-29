using Microsoft.AspNetCore.Mvc;
using Server.BL;
using System.Text.Json;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PackagesController : ControllerBase
    {
        [HttpPost("getPackage")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Package))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public ActionResult Post([FromBody] JsonElement dataForPackage)
        {
            try
            {
                // Accessing the properties of the JSON data using JsonElement
                JsonElement coupleElement = dataForPackage.GetProperty("couple");
                Couple coupleDetails = JsonSerializer.Deserialize<Couple>(coupleElement.GetRawText());
                JsonElement questionnaireElement = dataForPackage.GetProperty("questionnaireAnswers");
                int[] questionnaireAnswers = JsonSerializer.Deserialize<int[]>(questionnaireElement.GetRawText());

                // Generate the package
                var package = Package.getPackage(coupleDetails, questionnaireAnswers);

                return Ok(package);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

