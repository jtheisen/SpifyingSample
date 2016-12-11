using System;
using System.Web.Mvc;

namespace SpifyingSample.Controllers
{
    public class HomeController : Controller
    {
        [Route("")]
        public ActionResult Index() => View();

        [Route("error")]
        public ActionResult Error() { throw new Exception("This exception is thrown for demonstrative purposes."); }

        [Route("pages/page1")]
        public ActionResult Page1() => View();

        [Route("pages/morepages/page2")]
        public ActionResult Page2() => View();

        [Route("page1redirect")]
        public ActionResult Page1Redirect() => Redirect(Url.Action("Page1"));


        public class ViewModel
        {
            public String Name { get; set; }
        }

        [Route("form")]
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
