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

        public class ViewModel
        {
            public String Name { get; set; }

            public Int32 Age { get; set; }
        }

        public ActionResult Form(ViewModel vm = null)
        {
            return View(vm);
        }
    }
}
