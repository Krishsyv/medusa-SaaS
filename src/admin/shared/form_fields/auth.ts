	import { REGEX } from "../constants";

	export const login_fields = [
		{
			label: "Portal Id",
			name: "portal_id",
		},
		{
			label: "Email",
			name: "email",
			rules: {
				pattern: {
					value: REGEX.email,
					message: "Invalid email address",
				},
			},
		},
		{
			label: "Password",
			name: "password",
			type: "password",
			rules: {
				minLength: {
					value: 6,
					message: "Password must be at least 6 characters",
				},
			},
		},
	];

	export const signup_fields = [
    {
      label: "Portal Id",
      name: "portal_id",
    },
    {
      label: "First Name",
      name: "first_name",
    },
    {
      label: "Last Name",
      name: "last_name",
    },
    {
      label: "Email",
      name: "email",
      rules: {
        pattern: {
          value: REGEX.email,
          message: "Invalid email address",
        },
      },
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      rules: {
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      },
    },
    {
      label: "Confirm Password",
      name: "confirm_password",
      type: "password",
      rules: {
        validate: (value: string, context: Record<string, any>) =>
          value === context.password || "Passwords do not match",
      },
    },
  ];