namespace CleanArchFramework.Application.Shared.Options.ConfigOptions
{
    public class EmailOptions
    {
        /// <summary>
        /// Gets the host.
        /// </summary>
        public string? Host { get; init; }

        /// <summary>
        /// Gets the port.
        /// </summary>
        public int Port { get; init; }

        /// <summary>
        /// Gets a value indicating whether or not to enable SSL.
        /// </summary>
        public bool EnableSsl { get; init; }

        /// <summary>
        /// Gets the sender email.
        /// </summary>
        public string? SenderEmail { get; init; }
        /// <summary>
        /// Gets the sender usermane may be equal to sender.
        /// </summary>
        public string? Username { get; init; }
        /// <summary>
        /// Gets the password.
        /// </summary>
        public string? Password { get; init; }

        /// <summary>
        /// Gets the display name.
        /// </summary>
        public string? DisplayName { get; init; }

        public string? ContactEmail { get; set; }

        public bool UseAuthentication { get; init; }
    }
}

