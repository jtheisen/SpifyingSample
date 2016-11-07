using System;
using System.Web.Mvc;

namespace ClassicToSpaSample.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index() => View();

        public ActionResult Error() { throw new Exception("This exception is thrown for demonstrative purposes."); }

        public ActionResult Page1() => View();

        public ActionResult Page2() => View();

        public ActionResult Page1Alias() => Redirect(Url.Action("Page1"));

        public class ViewModel
        {
            public String Name { get; set; }

            public Int32 Age { get; set; }
        }

        public ActionResult Form(ViewModel vm = null, String mode = null)
        {
            if (mode == "redirect")
            {
                return Redirect(Url.Action());
            }
            else
            {
                return View(vm);
            }
        }
    }
}
