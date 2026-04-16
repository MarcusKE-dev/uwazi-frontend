const schema = z.object({
  full_name: z.string().min(2).max(100),
  email:     z.string().email(),
  // Backend validator requires: uppercase + lowercase + digit
  password:  z.string().min(8).regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
               'Must have uppercase, lowercase, and a digit'),
  phone:     z.string().regex(/^(\+254|0)[17]\d{8}$/, 'Valid Kenyan number').optional(),
});

// On submit:
const payload = await authService.register(formData);
setAuth(payload.user, payload.accessToken);  // ← accessToken camelCase
navigate('/dashboard');