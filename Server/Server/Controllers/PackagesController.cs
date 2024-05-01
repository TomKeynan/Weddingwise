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
                // Check if dataForPackage is null
                if (dataForPackage.ValueKind == JsonValueKind.Null)
                {
                    throw new ArgumentNullException(nameof(dataForPackage), "The JSON data for the package is null.");
                }
                else
                {
                    // Accessing the properties of the JSON data using JsonElement
                    JsonElement coupleElement = dataForPackage.GetProperty("couple");
                    Couple couple = JsonSerializer.Deserialize<Couple>(coupleElement.GetRawText()); // leshanot? 
                    JsonElement questionnaireElement = dataForPackage.GetProperty("questionnaireAnswers");
                    int[] questionnaireAnswers = JsonSerializer.Deserialize<int[]>(questionnaireElement.GetRawText());

                    // Generate the package

                    Couple coupleWithPackage = Package.GetPackage(couple, questionnaireAnswers);


                    return Ok(coupleWithPackage);
                }
            }
            catch (ArgumentNullException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
