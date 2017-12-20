namespace SystemNetCore.Web.Core
{
    using Business.Entity;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public static class Helper
    {
        public static string CreateBodyemailForgotPassword(User user, string callbackUrl)
        {

            string bodyHtmlEmail = System.IO.File.ReadAllText(System.IO.Path.GetFullPath("Templates/emailVerification.html"));
            bodyHtmlEmail = bodyHtmlEmail.Replace("{{title}}", string.Format("Hi {0},", user.UserName));
            bodyHtmlEmail = bodyHtmlEmail.Replace("{{subTitle}}", "Reset Password.");
            bodyHtmlEmail = bodyHtmlEmail.Replace("{{body}}", "Please reset your password by clicking the button below");
            bodyHtmlEmail = bodyHtmlEmail.Replace("{{verifyUrl}}", callbackUrl);

            return bodyHtmlEmail;
        }

        public static string CreateBodyEmail(User user, string callbackUrl)
        {
            string bodyHtmlEmail = System.IO.File.ReadAllText(System.IO.Path.GetFullPath("Templates/emailVerification.html"));

            bodyHtmlEmail = bodyHtmlEmail.Replace("{{title}}", string.Format("Hi {0},", user.UserName));
            bodyHtmlEmail = bodyHtmlEmail.Replace("{{subTitle}}", "Thanks for signing up!");
            bodyHtmlEmail = bodyHtmlEmail.Replace("{{body}}", "Please confirm your account by clicking the button below");
            bodyHtmlEmail = bodyHtmlEmail.Replace("{{verifyUrl}}", callbackUrl);

            return bodyHtmlEmail;
        }

        public static List<Common> ConvertToListItem<T>(IList<T> list, string value, string text)
        {
            var listItems = (from entity in list
                    let propiedad1 = entity.GetType().GetProperty(value)
                    where propiedad1 != null
                    let valor1 = propiedad1.GetValue(entity, null)
                    where valor1 != null
                    let propiedad2 = entity.GetType().GetProperty(text)
                    where propiedad2 != null
                    let valor2 = propiedad2.GetValue(entity, null)
                    where valor2 != null
                    select new Common
                    {
                        Key = valor1.ToString(),
                        Value = valor2.ToString()
                    })
                .OrderBy(p => p.Value)
                .ToList();
            listItems.Insert(0, new Common { Key = "0", Value = "-- Select --" });
            return listItems;
        }

        public static List<Common> EnumToList<T>()
        {
            var enumType = typeof(T);

            if (enumType.BaseType != typeof(Enum))
                throw new ArgumentException("Error Emunm cast to list");

            var enumValArray = Enum.GetValues(enumType);
            var enumValList = (from object l in enumValArray
                    select new Common
                    {
                        Key = Convert.ToString(l),
                        Value = Enum.GetName(enumType, l)
                    })
                .OrderBy(p => p.Key)
                .ToList();
            return enumValList;
        }
    }
}
