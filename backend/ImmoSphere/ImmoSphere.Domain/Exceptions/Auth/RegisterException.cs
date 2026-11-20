namespace ImmoSphere.Domain.Exceptions.Auth;

public class RegisterException : Exception
{
    public RegisterException(string message) : base(message)
    {
    }

    public class EmailAlreadyExistsException : RegisterException
    {
        public EmailAlreadyExistsException(string message) : base(message)
        {
        }
    }

    public class InvalidPasswordException : RegisterException
    {
        public InvalidPasswordException(string message) : base(message)
        {
        }
    }

    public class ConditionsNotAcceptedException : RegisterException
    {
        public ConditionsNotAcceptedException(string message) : base(message)
        {
        }
    }
}