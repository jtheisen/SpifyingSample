using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ClassicToSpaSample.Controllers
{
    public class ConfigController : Controller
    {
        public ActionResult SetClassicMode(String returnUrl)
        {
            SetCookie(UseClassicModeCookieName, "true", false);
            return Redirect(returnUrl);
        }

        public ActionResult SetSpifiedMode(String returnUrl)
        {
            SetCookie(UseClassicModeCookieName, "true", true);
            return Redirect(returnUrl);
        }

        const String UseClassicModeCookieName = "use-classic-mode";

        void SetCookie(String name, String value, Boolean remove)
        {
            Response.Cookies.Add(new HttpCookie(name) { Value = value, Expires = remove ? DateTime.Now.AddDays(-1) : DateTime.MaxValue });
        }
    }
}