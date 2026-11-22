namespace ImmoSphere.Domain.Exceptions.Auth;

public class LoginException : Exception
{
    public LoginException(string message) : base(message){}


    public class UserNotExist : LoginException
    {
        public UserNotExist(string message) : base(message){}
    }

    public class WrongPassword : LoginException
    {
        public WrongPassword(string message) : base(message){}
    }
}